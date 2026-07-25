const db = require('../../db');
const { AppError } = require('../../utils/errors');
const { v4: uuidv4 } = require('uuid');

// In-memory checkout session store (replace with Redis/DB in production)
const checkoutSessions = new Map();

/**
 * Creates and stores a new checkout session tied to a cart.
 *
 * @param {object} params
 * @param {string} params.cartId
 * @param {string|null} params.guestToken
 * @param {string|null} params.userId
 * @returns {object} checkout session data
 */
async function startCheckout({ cartId, guestToken, userId }) {
  if (!cartId) {
    throw new AppError('cartId is required to start checkout.', 400);
  }

  // Verify cart exists and belongs to the caller
  const cartQuery = await db.query(
    `SELECT * FROM carts WHERE id = $1 AND (user_id = $2 OR guest_token = $3)`,
    [cartId, userId, guestToken]
  );

  if (cartQuery.rows.length === 0) {
    throw new AppError('Cart not found or does not belong to this user.', 404);
  }

  const cart = cartQuery.rows[0];

  // Fetch cart items
  const itemsQuery = await db.query(
    `SELECT ci.id, ci.sku_id, ci.quantity, s.price, s.stock_quantity, p.name AS product_name
     FROM cart_items ci
     JOIN skus s ON s.id = ci.sku_id
     JOIN products p ON p.id = s.product_id
     WHERE ci.cart_id = $1`,
    [cartId]
  );

  if (itemsQuery.rows.length === 0) {
    throw new AppError('Cannot start checkout with an empty cart.', 400);
  }

  const checkoutToken = uuidv4();
  const session = {
    checkoutToken,
    cartId,
    userId,
    guestToken: guestToken || null,
    items: itemsQuery.rows,
    address: null,
    promoCode: null,
    promoDiscount: 0,
    status: 'initiated',
    createdAt: new Date().toISOString(),
  };

  checkoutSessions.set(checkoutToken, session);

  return {
    checkoutToken,
    cartId,
    itemCount: itemsQuery.rows.length,
    status: session.status,
  };
}

/**
 * Validates and saves the shipping address against a checkout session.
 *
 * @param {object} params
 * @param {string} params.checkoutToken
 * @param {object} params.address
 * @param {string|null} params.userId
 * @returns {object} updated session summary
 */
async function submitAddress({ checkoutToken, address, userId }) {
  const session = _getSession(checkoutToken);
  _assertSessionOwner(session, userId);

  // Validate serviceability (stub — integrate with serviceability service if available)
  const isServiceable = await _validateAddressServiceability(address);
  if (!isServiceable) {
    throw new AppError('Delivery is not available to the provided address.', 422);
  }

  session.address = address;
  session.status = 'address_set';
  checkoutSessions.set(checkoutToken, session);

  return {
    checkoutToken,
    address: session.address,
    status: session.status,
  };
}

/**
 * Returns the full order review summary for the current checkout session.
 *
 * @param {object} params
 * @param {string} params.checkoutToken
 * @param {string|null} params.userId
 * @returns {object} review summary
 */
async function reviewCheckout({ checkoutToken, userId }) {
  if (!checkoutToken) {
    throw new AppError('checkoutToken is required.', 400);
  }

  const session = _getSession(checkoutToken);
  _assertSessionOwner(session, userId);

  if (!session.address) {
    throw new AppError('Shipping address must be provided before reviewing checkout.', 400);
  }

  const subtotal = session.items.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const discount = session.promoDiscount || 0;
  const total = Math.max(0, subtotal - discount);

  return {
    checkoutToken,
    items: session.items,
    address: session.address,
    promoCode: session.promoCode || null,
    subtotal: subtotal.toFixed(2),
    discount: discount.toFixed(2),
    total: total.toFixed(2),
    status: session.status,
  };
}

/**
 * Confirms stock, applies promo, creates the order record, and initiates payment.
 *
 * @param {object} params
 * @param {string} params.checkoutToken
 * @param {string} params.paymentMethod
 * @param {string|null} params.promoCode
 * @param {string|null} params.userId
 * @returns {object} created order and payment intent data
 */
async function placeOrder({ checkoutToken, paymentMethod, promoCode, userId }) {
  const session = _getSession(checkoutToken);
  _assertSessionOwner(session, userId);

  if (!session.address) {
    throw new AppError('Shipping address is required before placing an order.', 400);
  }

  // Step 1: Confirm stock reservation
  await _confirmStockReservation(session.items);

  // Step 2: Finalise promo code if provided
  let promoDiscount = 0;
  let appliedPromoCode = session.promoCode || promoCode || null;
  if (appliedPromoCode) {
    promoDiscount = await _finalisePromo(appliedPromoCode, session.items);
    session.promoCode = appliedPromoCode;
    session.promoDiscount = promoDiscount;
  }

  // Step 3: Compute totals
  const subtotal = session.items.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );
  const total = Math.max(0, subtotal - promoDiscount);

  // Step 4: Create order in DB
  const orderId = uuidv4();
  const now = new Date().toISOString();

  await db.query(
    `INSERT INTO orders
       (id, user_id, guest_token, cart_id, status, address, promo_code, subtotal, discount, total, payment_method, created_at, updated_at)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      orderId,
      userId,
      session.guestToken,
      session.cartId,
      'pending_payment',
      JSON.stringify(session.address),
      appliedPromoCode,
      subtotal.toFixed(2),
      promoDiscount.toFixed(2),
      total.toFixed(2),
      paymentMethod,
      now,
      now,
    ]
  );

  // Step 5: Insert order items
  for (const item of session.items) {
    await db.query(
      `INSERT INTO order_items (id, order_id, sku_id, quantity, unit_price, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), orderId, item.sku_id, item.quantity, item.price, now]
    );
  }

  // Step 6: Deduct stock
  for (const item of session.items) {
    await db.query(
      `UPDATE skus SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
      [item.quantity, item.sku_id]
    );
  }

  // Step 7: Mark cart as checked out
  await db.query(
    `UPDATE carts SET status = 'checked_out', updated_at = $1 WHERE id = $2`,
    [now, session.cartId]
  );

  // Step 8: Delegate payment intent (stub — real integration delegated to payments module)
  const paymentIntent = await _delegatePaymentIntent({ orderId, total, paymentMethod, userId });

  // Step 9: Clean up session
  checkoutSessions.delete(checkoutToken);

  return {
    orderId,
    status: 'pending_payment',
    total: total.toFixed(2),
    paymentIntent,
  };
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function _getSession(checkoutToken) {
  if (!checkoutToken) {
    throw new AppError('checkoutToken is required.', 400);
  }
  const session = checkoutSessions.get(checkoutToken);
  if (!session) {
    throw new AppError('Checkout session not found or has expired.', 404);
  }
  return session;
}

function _assertSessionOwner(session, userId) {
  if (userId && session.userId && session.userId !== userId) {
    throw new AppError('You do not have access to this checkout session.', 403);
  }
}

async function _validateAddressServiceability(address) {
  // Stub: integrate with GET /serviceability in a full implementation
  if (!address || !address.pincode) {
    return false;
  }
  return true;
}

async function _confirmStockReservation(items) {
  for (const item of items) {
    const result = await db.query(
      `SELECT stock_quantity FROM skus WHERE id = $1`,
      [item.sku_id]
    );
    if (result.rows.length === 0) {
      throw new AppError(`SKU ${item.sku_id} not found.`, 404);
    }
    const available = result.rows[0].stock_quantity;
    if (available < item.quantity) {
      throw new AppError(
        `Insufficient stock for product "${item.product_name}". Requested: ${item.quantity}, Available: ${available}.`,
        409
      );
    }
  }
}

async function _finalisePromo(promoCode, items) {
  const result = await db.query(
    `SELECT * FROM promo_codes WHERE code = $1 AND is_active = true AND (expires_at IS NULL OR expires_at > NOW())`,
    [promoCode]
  );

  if (result.rows.length === 0) {
    throw new AppError('Promo code is invalid or has expired.', 400);
  }

  const promo = result.rows[0];
  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  if (promo.minimum_order_value && subtotal < parseFloat(promo.minimum_order_value)) {
    throw new AppError(
      `Order subtotal does not meet the minimum required for this promo code.`,
      400
    );
  }

  let discount = 0;
  if (promo.discount_type === 'percentage') {
    discount = (subtotal * parseFloat(promo.discount_value)) / 100;
    if (promo.max_discount_amount) {
      discount = Math.min(discount, parseFloat(promo.max_discount_amount));
    }
  } else if (promo.discount_type === 'flat') {
    discount = parseFloat(promo.discount_value);
  }

  return Math.min(discount, subtotal);
}

async function _delegatePaymentIntent({ orderId, total, paymentMethod, userId }) {
  // Stub: in production, call the payments service (POST /payments/initiate)
  return {
    paymentIntentId: `pi_${uuidv4().replace(/-/g, '')}`,
    orderId,
    amount: total,
    currency: 'INR',
    paymentMethod,
    status: 'created',
  };
}

module.exports = {
  startCheckout,
  submitAddress,
  reviewCheckout,
  placeOrder,
};
