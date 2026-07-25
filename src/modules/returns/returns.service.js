const db = require('../../db');
const { NotFoundError, ForbiddenError, ConflictError } = require('../../errors');

const RETURNABLE_DAYS = 30;
const ELIGIBLE_ORDER_STATUSES = ['delivered'];
const RETURN_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

/**
 * Check whether an order is eligible for a return.
 * @param {string} orderId
 * @param {string} userId
 * @returns {Promise<object>} the order row
 */
async function checkReturnEligibility(orderId, userId) {
  const orderResult = await db.query(
    `SELECT id, user_id, status, delivered_at
       FROM orders
      WHERE id = $1`,
    [orderId]
  );

  if (orderResult.rowCount === 0) {
    throw new NotFoundError('Order not found.');
  }

  const order = orderResult.rows[0];

  if (order.user_id !== userId) {
    throw new ForbiddenError('You do not have permission to request a return for this order.');
  }

  if (!ELIGIBLE_ORDER_STATUSES.includes(order.status)) {
    throw new ConflictError('Order is not eligible for a return. Only delivered orders can be returned.');
  }

  if (order.delivered_at) {
    const deliveredAt = new Date(order.delivered_at);
    const now = new Date();
    const diffDays = (now - deliveredAt) / (1000 * 60 * 60 * 24);
    if (diffDays > RETURNABLE_DAYS) {
      throw new ConflictError(
        `Return window has expired. Returns must be requested within ${RETURNABLE_DAYS} days of delivery.`
      );
    }
  }

  return order;
}

/**
 * Create a return request for an order.
 * POST /orders/:orderId/return-requests
 */
async function createReturnRequest(orderId, userId, payload) {
  await checkReturnEligibility(orderId, userId);

  // Check for an existing pending/approved return request
  const existing = await db.query(
    `SELECT id FROM return_requests
      WHERE order_id = $1 AND status IN ('pending', 'approved')`,
    [orderId]
  );
  if (existing.rowCount > 0) {
    throw new ConflictError('A return request for this order is already in progress.');
  }

  const { reason, items } = payload;

  const result = await db.query(
    `INSERT INTO return_requests
       (order_id, user_id, reason, items, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING *`,
    [orderId, userId, reason, JSON.stringify(items || []), RETURN_STATUSES.PENDING]
  );

  return result.rows[0];
}

/**
 * List all return requests (admin).
 * GET /return-requests
 */
async function listReturnRequests(filters) {
  const { status, orderId, page, limit } = filters;
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (status) {
    values.push(status);
    conditions.push(`rr.status = $${values.length}`);
  }

  if (orderId) {
    values.push(orderId);
    conditions.push(`rr.order_id = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;
  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const dataResult = await db.query(
    `SELECT rr.*
       FROM return_requests rr
     ${where}
     ORDER BY rr.created_at DESC
     LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
    values
  );

  const countValues = values.slice(0, conditions.length);
  const countResult = await db.query(
    `SELECT COUNT(*) AS total
       FROM return_requests rr
     ${where}`,
    countValues
  );

  return {
    data: dataResult.rows,
    pagination: {
      total: parseInt(countResult.rows[0].total, 10),
      page,
      limit,
    },
  };
}

/**
 * Get a single return request by ID.
 * GET /return-requests/:returnRequestId
 */
async function getReturnRequest(returnRequestId, userId, isAdmin) {
  const result = await db.query(
    `SELECT * FROM return_requests WHERE id = $1`,
    [returnRequestId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Return request not found.');
  }

  const returnRequest = result.rows[0];

  if (!isAdmin && returnRequest.user_id !== userId) {
    throw new ForbiddenError('You do not have permission to view this return request.');
  }

  return returnRequest;
}

/**
 * Trigger a refund for an approved return request.
 * @param {string} returnRequestId
 * @param {object} returnRequest
 */
async function triggerRefund(returnRequestId, returnRequest) {
  await db.query(
    `INSERT INTO refunds
       (order_id, return_request_id, status, created_at, updated_at)
     VALUES ($1, $2, 'pending', NOW(), NOW())
     ON CONFLICT DO NOTHING`,
    [returnRequest.order_id, returnRequestId]
  );
}

/**
 * Update stock on approval of a return request.
 * @param {object} returnRequest
 */
async function updateStockOnApproval(returnRequest) {
  const items = returnRequest.items;
  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    if (item.sku_id && item.quantity) {
      await db.query(
        `UPDATE skus
            SET stock = stock + $1, updated_at = NOW()
          WHERE id = $2`,
        [item.quantity, item.sku_id]
      );
    }
  }
}

/**
 * Admin review (approve/reject) a return request.
 * POST /return-requests/:returnRequestId/review
 */
async function reviewReturnRequest(returnRequestId, adminId, payload) {
  const result = await db.query(
    `SELECT * FROM return_requests WHERE id = $1`,
    [returnRequestId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Return request not found.');
  }

  const returnRequest = result.rows[0];

  if (returnRequest.status !== RETURN_STATUSES.PENDING) {
    throw new ConflictError('Only pending return requests can be reviewed.');
  }

  const { decision, adminNote } = payload;

  if (!['approved', 'rejected'].includes(decision)) {
    throw new ConflictError('Decision must be either approved or rejected.');
  }

  const updated = await db.query(
    `UPDATE return_requests
        SET status = $1,
            admin_note = $2,
            reviewed_by = $3,
            reviewed_at = NOW(),
            updated_at = NOW()
      WHERE id = $4
      RETURNING *`,
    [decision, adminNote || null, adminId, returnRequestId]
  );

  const updatedRequest = updated.rows[0];

  if (decision === RETURN_STATUSES.APPROVED) {
    await triggerRefund(returnRequestId, updatedRequest);
    const itemsData =
      typeof updatedRequest.items === 'string'
        ? JSON.parse(updatedRequest.items)
        : updatedRequest.items;
    await updateStockOnApproval({ ...updatedRequest, items: itemsData });
  }

  return updatedRequest;
}

module.exports = {
  createReturnRequest,
  listReturnRequests,
  getReturnRequest,
  reviewReturnRequest,
  checkReturnEligibility,
};
