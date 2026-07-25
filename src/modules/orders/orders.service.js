const db = require('../../db');

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
  'refunded',
];

const CANCELLABLE_STATUSES = ['pending', 'confirmed', 'processing'];

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: ['return_requested'],
  return_requested: ['returned', 'delivered'],
  returned: ['refunded'],
  refunded: [],
  cancelled: [],
};

async function listOrders(filters) {
  const { page, limit, status, userId, isAdmin } = filters;
  const offset = (page - 1) * limit;

  let query = `
    SELECT
      o.id,
      o.user_id,
      o.status,
      o.total_amount,
      o.currency,
      o.payment_status,
      o.created_at,
      o.updated_at
    FROM orders o
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (!isAdmin) {
    query += ` AND o.user_id = $${paramIndex++}`;
    params.push(userId);
  } else if (userId) {
    query += ` AND o.user_id = $${paramIndex++}`;
    params.push(userId);
  }

  if (status) {
    query += ` AND o.status = $${paramIndex++}`;
    params.push(status);
  }

  const countQuery = `SELECT COUNT(*) FROM orders o WHERE 1=1${!isAdmin || userId ? ` AND o.user_id = $1` : ''}${status ? ` AND o.status = $${!isAdmin || userId ? 2 : 1}` : ''}`;

  query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  const [ordersResult, countResult] = await Promise.all([
    db.query(query, params),
    (async () => {
      const countParams = [];
      let cq = 'SELECT COUNT(*) FROM orders o WHERE 1=1';
      if (!isAdmin) {
        cq += ` AND o.user_id = $${countParams.length + 1}`;
        countParams.push(userId);
      } else if (userId) {
        cq += ` AND o.user_id = $${countParams.length + 1}`;
        countParams.push(userId);
      }
      if (status) {
        cq += ` AND o.status = $${countParams.length + 1}`;
        countParams.push(status);
      }
      return db.query(cq, countParams);
    })(),
  ]);

  const total = parseInt(countResult.rows[0].count, 10);

  return {
    orders: ordersResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getOrder(orderId, userId, isAdmin) {
  const result = await db.query(
    `SELECT
      o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'sku_id', oi.sku_id,
          'product_name', oi.product_name,
          'sku_name', oi.sku_name,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'total_price', oi.total_price
        )
      ) FILTER (WHERE oi.id IS NOT NULL) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.id = $1
    GROUP BY o.id`,
    [orderId]
  );

  if (result.rows.length === 0) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const order = result.rows[0];

  if (!isAdmin && order.user_id !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  return order;
}

async function getOrderTimeline(orderId, userId, isAdmin) {
  await getOrder(orderId, userId, isAdmin);

  const result = await db.query(
    `SELECT
      id,
      order_id,
      status,
      note,
      created_by,
      created_at
    FROM order_status_history
    WHERE order_id = $1
    ORDER BY created_at ASC`,
    [orderId]
  );

  return { orderId, timeline: result.rows };
}

async function getOrderTracking(orderId, userId, isAdmin) {
  await getOrder(orderId, userId, isAdmin);

  const result = await db.query(
    `SELECT
      id,
      order_id,
      carrier,
      tracking_number,
      tracking_url,
      status,
      estimated_delivery,
      events,
      updated_at
    FROM order_tracking
    WHERE order_id = $1
    ORDER BY updated_at DESC
    LIMIT 1`,
    [orderId]
  );

  if (result.rows.length === 0) {
    return { orderId, tracking: null };
  }

  return { orderId, tracking: result.rows[0] };
}

async function getOrderRefunds(orderId, userId, isAdmin) {
  await getOrder(orderId, userId, isAdmin);

  const result = await db.query(
    `SELECT
      id,
      order_id,
      return_request_id,
      amount,
      currency,
      status,
      reason,
      payment_method,
      created_at,
      updated_at
    FROM refunds
    WHERE order_id = $1
    ORDER BY created_at DESC`,
    [orderId]
  );

  return { orderId, refunds: result.rows };
}

async function cancelOrder(orderId, userId, isAdmin, reason) {
  const order = await getOrder(orderId, userId, isAdmin);

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    const err = new Error(`Order cannot be cancelled in status: ${order.status}`);
    err.status = 422;
    throw err;
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, note, created_by, created_at)
       VALUES ($1, 'cancelled', $2, $3, NOW())`,
      [orderId, reason || 'Order cancelled by user', isAdmin ? 'admin' : String(userId)]
    );

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function advanceOrder(orderId, newStatus, trackingData) {
  const result = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);

  if (result.rows.length === 0) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const order = result.rows[0];
  const allowedTransitions = STATUS_TRANSITIONS[order.status] || [];

  if (!allowedTransitions.includes(newStatus)) {
    const err = new Error(
      `Invalid status transition from '${order.status}' to '${newStatus}'`
    );
    err.status = 422;
    throw err;
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [newStatus, orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, note, created_by, created_at)
       VALUES ($1, $2, $3, 'admin', NOW())`,
      [orderId, newStatus, `Status advanced to ${newStatus}`]
    );

    if (newStatus === 'shipped' && trackingData && trackingData.trackingNumber) {
      await client.query(
        `INSERT INTO order_tracking (order_id, carrier, tracking_number, tracking_url, status, events, updated_at)
         VALUES ($1, $2, $3, $4, 'shipped', '[]'::jsonb, NOW())
         ON CONFLICT (order_id) DO UPDATE
           SET carrier = EXCLUDED.carrier,
               tracking_number = EXCLUDED.tracking_number,
               tracking_url = EXCLUDED.tracking_url,
               status = EXCLUDED.status,
               updated_at = NOW()`,
        [
          orderId,
          trackingData.carrier || null,
          trackingData.trackingNumber,
          trackingData.trackingUrl || null,
        ]
      );
    }

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function createReturnRequest(orderId, userId, { reason, items, notes }) {
  const order = await getOrder(orderId, userId, false);

  if (order.status !== 'delivered') {
    const err = new Error('Return requests can only be created for delivered orders');
    err.status = 422;
    throw err;
  }

  const existingRequest = await db.query(
    `SELECT id FROM return_requests WHERE order_id = $1 AND status NOT IN ('rejected', 'cancelled') LIMIT 1`,
    [orderId]
  );

  if (existingRequest.rows.length > 0) {
    const err = new Error('A return request already exists for this order');
    err.status = 409;
    throw err;
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const returnResult = await client.query(
      `INSERT INTO return_requests (order_id, user_id, reason, items, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4::jsonb, $5, 'pending', NOW(), NOW())
       RETURNING *`,
      [orderId, userId, reason, JSON.stringify(items || []), notes || null]
    );

    await client.query(
      `UPDATE orders SET status = 'return_requested', updated_at = NOW() WHERE id = $1`,
      [orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, note, created_by, created_at)
       VALUES ($1, 'return_requested', $2, $3, NOW())`,
      [orderId, `Return requested: ${reason}`, String(userId)]
    );

    await client.query('COMMIT');
    return returnResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function createOrder(orderData, client) {
  const {
    userId,
    addressId,
    items,
    subtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    totalAmount,
    currency,
    promoCodeId,
    paymentMethod,
    notes,
  } = orderData;

  const orderResult = await client.query(
    `INSERT INTO orders (
      user_id, address_id, status, subtotal, discount_amount,
      shipping_amount, tax_amount, total_amount, currency,
      promo_code_id, payment_method, payment_status, notes, created_at, updated_at
    ) VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11, NOW(), NOW())
    RETURNING *`,
    [
      userId,
      addressId,
      subtotal,
      discountAmount || 0,
      shippingAmount || 0,
      taxAmount || 0,
      totalAmount,
      currency || 'USD',
      promoCodeId || null,
      paymentMethod || null,
      notes || null,
    ]
  );

  const order = orderResult.rows[0];

  for (const item of items) {
    await client.query(
      `INSERT INTO order_items (
        order_id, sku_id, product_name, sku_name, quantity, unit_price, total_price, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        order.id,
        item.skuId,
        item.productName,
        item.skuName,
        item.quantity,
        item.unitPrice,
        item.totalPrice,
      ]
    );
  }

  await client.query(
    `INSERT INTO order_status_history (order_id, status, note, created_by, created_at)
     VALUES ($1, 'pending', 'Order created', $2, NOW())`,
    [order.id, String(userId)]
  );

  return order;
}

module.exports = {
  listOrders,
  getOrder,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  advanceOrder,
  createReturnRequest,
  createOrder,
};
