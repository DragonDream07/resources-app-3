const { v4: uuidv4 } = require('uuid');
const db = require('../../config/db');

// ---------------------------------------------------------------------------
// Adapter registry — resolved at runtime from PAYMENT_PROVIDER env variable.
// Additional adapters (e.g. razorpay, stripe) can be registered here.
// ---------------------------------------------------------------------------
const ADAPTERS = {};

function getAdapter() {
  const provider = (process.env.PAYMENT_PROVIDER || 'mock').toLowerCase();
  if (!ADAPTERS[provider]) {
    // Lazy-load adapter to avoid hard dependency on optional SDKs
    try {
      // eslint-disable-next-line import/no-dynamic-require
      ADAPTERS[provider] = require(`./adapters/${provider}.adapter`);
    } catch {
      throw new Error(`Payment adapter '${provider}' not found.`);
    }
  }
  return ADAPTERS[provider];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function persistAttempt(fields) {
  const id = fields.id || uuidv4();
  await db.query(
    `INSERT INTO payment_attempts
       (id, order_id, provider, provider_ref, amount, currency, status, meta, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET
       status     = EXCLUDED.status,
       meta       = EXCLUDED.meta,
       updated_at = NOW()`,
    [
      id,
      fields.orderId,
      fields.provider,
      fields.providerRef || null,
      fields.amount,
      fields.currency || 'INR',
      fields.status,
      JSON.stringify(fields.meta || {}),
    ]
  );
  return id;
}

async function findAttemptById(paymentId) {
  const { rows } = await db.query(
    'SELECT * FROM payment_attempts WHERE id = $1 LIMIT 1',
    [paymentId]
  );
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

/**
 * Initiate a new payment attempt for an order.
 *
 * @param {object} body   - { orderId, amount, currency, method, meta }
 * @param {object} user   - authenticated user (optional for guest)
 * @returns {object}      - payment attempt record + provider checkout data
 */
async function initiatePayment(body, user) {
  const { orderId, amount, currency = 'INR', method, meta = {} } = body;

  const adapter = getAdapter();
  const provider = adapter.PROVIDER_NAME;

  // Create a pending attempt first so we have an id to pass to the provider
  const attemptId = uuidv4();
  await persistAttempt({
    id: attemptId,
    orderId,
    provider,
    amount,
    currency,
    status: 'pending',
    meta: { method, ...meta },
  });

  // Delegate to provider adapter
  const providerData = await adapter.createOrder({
    attemptId,
    orderId,
    amount,
    currency,
    method,
    meta,
    user,
  });

  // Persist provider reference
  await persistAttempt({
    id: attemptId,
    orderId,
    provider,
    providerRef: providerData.providerRef || null,
    amount,
    currency,
    status: 'initiated',
    meta: { method, ...meta, providerData },
  });

  return {
    paymentId: attemptId,
    status: 'initiated',
    provider,
    providerData,
  };
}

/**
 * Handle provider callback / webhook.
 *
 * @param {object} body     - raw provider payload
 * @param {object} headers  - HTTP headers (used for signature verification)
 * @returns {object}        - updated attempt
 */
async function handleCallback(body, headers) {
  const adapter = getAdapter();

  // Let the adapter verify signature and extract normalised fields
  const {
    attemptId,
    providerRef,
    status: providerStatus,
    meta = {},
  } = await adapter.verifyCallback(body, headers);

  const attempt = await findAttemptById(attemptId);
  if (!attempt) {
    const err = new Error('Payment attempt not found.');
    err.status = 404;
    throw err;
  }

  const status = providerStatus === 'success' ? 'paid' : 'failed';

  await persistAttempt({
    id: attemptId,
    orderId: attempt.order_id,
    provider: attempt.provider,
    providerRef,
    amount: attempt.amount,
    currency: attempt.currency,
    status,
    meta: { ...JSON.parse(attempt.meta || '{}'), callbackMeta: meta },
  });

  // Update parent order payment status
  if (status === 'paid') {
    await db.query(
      `UPDATE orders SET payment_status = 'paid', updated_at = NOW() WHERE id = $1`,
      [attempt.order_id]
    );
  } else {
    await db.query(
      `UPDATE orders SET payment_status = 'failed', updated_at = NOW() WHERE id = $1`,
      [attempt.order_id]
    );
  }

  return { paymentId: attemptId, status };
}

/**
 * Retrieve a single payment attempt.
 *
 * @param {string} paymentId
 * @param {object} user
 * @returns {object}
 */
async function getPayment(paymentId, user) {
  const attempt = await findAttemptById(paymentId);
  if (!attempt) {
    const err = new Error('Payment not found.');
    err.status = 404;
    throw err;
  }
  return attempt;
}

/**
 * Retry a failed payment attempt (creates a new attempt for the same order).
 *
 * @param {string} paymentId  - id of the original failed attempt
 * @param {object} body       - optional overrides { method, meta }
 * @param {object} user
 * @returns {object}
 */
async function retryPayment(paymentId, body, user) {
  const original = await findAttemptById(paymentId);
  if (!original) {
    const err = new Error('Payment attempt not found.');
    err.status = 404;
    throw err;
  }

  if (!['failed', 'cancelled'].includes(original.status)) {
    const err = new Error('Only failed or cancelled payments can be retried.');
    err.status = 400;
    throw err;
  }

  const originalMeta = JSON.parse(original.meta || '{}');

  return initiatePayment(
    {
      orderId: original.order_id,
      amount: original.amount,
      currency: original.currency,
      method: body.method || originalMeta.method,
      meta: { ...originalMeta, retryOf: paymentId, ...(body.meta || {}) },
    },
    user
  );
}

module.exports = {
  initiatePayment,
  handleCallback,
  getPayment,
  retryPayment,
};
