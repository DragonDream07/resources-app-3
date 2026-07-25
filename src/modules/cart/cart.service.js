const db = require('../../db');
const { AppError } = require('../../utils/errors');
const { v4: uuidv4 } = require('uuid');

/**
 * Assert the caller has access to the given cart.
 * A cart belongs to a user (userId) or a guest (guestId).
 */
function assertCartAccess(cart, { userId, guestId }) {
  if (cart.user_id && userId && cart.user_id === userId) return;
  if (!cart.user_id && guestId && cart.guest_id === guestId) return;
  if (userId && !cart.user_id) return; // authenticated user accessing guest cart for merge
  throw new AppError('Cart not found or access denied.', 403);
}

/**
 * Compute cart totals from items.
 */
function computeTotals(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const discountAmount = Math.min(discount, subtotal);
  const total = subtotal - discountAmount;
  return { subtotal, discountAmount, total };
}

/**
 * Fetch a cart row with its items.
 */
async function fetchCartWithItems(cartId) {
  const cartResult = await db.query(
    'SELECT * FROM carts WHERE id = $1 AND deleted_at IS NULL',
    [cartId]
  );
  if (!cartResult.rows.length) {
    throw new AppError('Cart not found.', 404);
  }
  const cart = cartResult.rows[0];

  const itemsResult = await db.query(
    `SELECT ci.*, s.stock_quantity, s.price AS sku_price, s.sku_code,
            p.name AS product_name, p.id AS product_id
     FROM cart_items ci
     JOIN skus s ON ci.sku_id = s.id
     JOIN products p ON s.product_id = p.id
     WHERE ci.cart_id = $1 AND ci.deleted_at IS NULL`,
    [cartId]
  );
  cart.items = itemsResult.rows;
  return cart;
}

/**
 * POST /carts
 * Create a new cart for a user or guest.
 */
async function createCart({ userId, guestId }) {
  // If user already has an active cart, return it
  if (userId) {
    const existing = await db.query(
      'SELECT * FROM carts WHERE user_id = $1 AND status = $2 AND deleted_at IS NULL LIMIT 1',
      [userId, 'active']
    );
    if (existing.rows.length) {
      return fetchCartWithItems(existing.rows[0].id);
    }
  }

  const id = uuidv4();
  const resolvedGuestId = userId ? null : (guestId || uuidv4());

  await db.query(
    `INSERT INTO carts (id, user_id, guest_id, status, promo_code, discount_amount, created_at, updated_at)
     VALUES ($1, $2, $3, 'active', NULL, 0, NOW(), NOW())`,
    [id, userId || null, resolvedGuestId]
  );

  return fetchCartWithItems(id);
}

/**
 * GET /carts/:cartId
 * Retrieve cart with items. Merge guest cart into user cart if applicable.
 */
async function getCart({ cartId, userId, guestId }) {
  const cart = await fetchCartWithItems(cartId);
  assertCartAccess(cart, { userId, guestId });

  // Auto-merge: if authenticated user is accessing a guest cart
  if (userId && !cart.user_id && cart.guest_id) {
    return mergeGuestCartIntoUserCart({ guestCart: cart, userId });
  }

  const { subtotal, discountAmount, total } = computeTotals(cart.items, cart.discount_amount);
  return { ...cart, subtotal, discountAmount, total };
}

/**
 * Merge a guest cart's items into the authenticated user's cart.
 */
async function mergeGuestCartIntoUserCart({ guestCart, userId }) {
  // Find or create user cart
  let userCartResult = await db.query(
    'SELECT * FROM carts WHERE user_id = $1 AND status = $2 AND deleted_at IS NULL LIMIT 1',
    [userId, 'active']
  );

  let userCart;
  if (userCartResult.rows.length) {
    userCart = await fetchCartWithItems(userCartResult.rows[0].id);
  } else {
    userCart = await createCart({ userId, guestId: null });
  }

  // Merge guest items into user cart
  for (const guestItem of guestCart.items) {
    const existingItem = userCart.items.find(i => i.sku_id === guestItem.sku_id);
    if (existingItem) {
      const newQty = existingItem.quantity + guestItem.quantity;
      await db.query(
        `UPDATE cart_items SET quantity = $1, updated_at = NOW()
         WHERE id = $2 AND deleted_at IS NULL`,
        [newQty, existingItem.id]
      );
    } else {
      const newItemId = uuidv4();
      await db.query(
        `INSERT INTO cart_items (id, cart_id, sku_id, quantity, unit_price, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [newItemId, userCart.id, guestItem.sku_id, guestItem.quantity, guestItem.unit_price]
      );
    }
  }

  // Soft-delete guest cart
  await db.query(
    'UPDATE carts SET deleted_at = NOW(), status = $1 WHERE id = $2',
    ['merged', guestCart.id]
  );

  return fetchCartWithItems(userCart.id).then(cart => {
    const { subtotal, discountAmount, total } = computeTotals(cart.items, cart.discount_amount);
    return { ...cart, subtotal, discountAmount, total };
  });
}

/**
 * POST /carts/:cartId/items
 * Add an item to the cart with stock reservation validation.
 */
async function addItem({ cartId, skuId, quantity, userId, guestId }) {
  if (!skuId) throw new AppError('skuId is required.', 400);
  if (!quantity || quantity < 1) throw new AppError('Quantity must be at least 1.', 400);

  const cart = await fetchCartWithItems(cartId);
  assertCartAccess(cart, { userId, guestId });

  if (cart.status !== 'active') {
    throw new AppError('Cart is not active.', 400);
  }

  // Validate SKU exists and check stock
  const skuResult = await db.query(
    'SELECT * FROM skus WHERE id = $1 AND deleted_at IS NULL',
    [skuId]
  );
  if (!skuResult.rows.length) {
    throw new AppError('SKU not found.', 404);
  }
  const sku = skuResult.rows[0];

  // Check existing item in cart for combined quantity
  const existingItem = cart.items.find(i => i.sku_id === skuId);
  const existingQty = existingItem ? existingItem.quantity : 0;
  const requestedQty = existingQty + quantity;

  if (sku.stock_quantity < requestedQty) {
    throw new AppError(
      `Insufficient stock. Available: ${sku.stock_quantity}, Requested: ${requestedQty}.`,
      422
    );
  }

  if (existingItem) {
    await db.query(
      `UPDATE cart_items SET quantity = $1, updated_at = NOW()
       WHERE id = $2 AND deleted_at IS NULL`,
      [requestedQty, existingItem.id]
    );
  } else {
    const newItemId = uuidv4();
    await db.query(
      `INSERT INTO cart_items (id, cart_id, sku_id, quantity, unit_price, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [newItemId, cartId, skuId, quantity, sku.price]
    );
  }

  // Update cart timestamp
  await db.query('UPDATE carts SET updated_at = NOW() WHERE id = $1', [cartId]);

  const updatedCart = await fetchCartWithItems(cartId);
  const { subtotal, discountAmount, total } = computeTotals(updatedCart.items, updatedCart.discount_amount);
  return { ...updatedCart, subtotal, discountAmount, total };
}

/**
 * PATCH /carts/:cartId/items/:itemId
 * Update item quantity in cart.
 */
async function updateItem({ cartId, itemId, quantity, userId, guestId }) {
  if (quantity === undefined || quantity === null) {
    throw new AppError('Quantity is required.', 400);
  }
  if (quantity < 0) {
    throw new AppError('Quantity must be a non-negative integer.', 400);
  }

  const cart = await fetchCartWithItems(cartId);
  assertCartAccess(cart, { userId, guestId });

  if (cart.status !== 'active') {
    throw new AppError('Cart is not active.', 400);
  }

  const item = cart.items.find(i => i.id === itemId);
  if (!item) {
    throw new AppError('Cart item not found.', 404);
  }

  // quantity === 0 means remove
  if (quantity === 0) {
    await db.query(
      'UPDATE cart_items SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1',
      [itemId]
    );
  } else {
    // Validate stock
    const skuResult = await db.query(
      'SELECT stock_quantity FROM skus WHERE id = $1 AND deleted_at IS NULL',
      [item.sku_id]
    );
    if (!skuResult.rows.length) {
      throw new AppError('SKU not found.', 404);
    }
    const sku = skuResult.rows[0];
    if (sku.stock_quantity < quantity) {
      throw new AppError(
        `Insufficient stock. Available: ${sku.stock_quantity}, Requested: ${quantity}.`,
        422
      );
    }
    await db.query(
      'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL',
      [quantity, itemId]
    );
  }

  await db.query('UPDATE carts SET updated_at = NOW() WHERE id = $1', [cartId]);

  const updatedCart = await fetchCartWithItems(cartId);
  const { subtotal, discountAmount, total } = computeTotals(updatedCart.items, updatedCart.discount_amount);
  return { ...updatedCart, subtotal, discountAmount, total };
}

/**
 * DELETE /carts/:cartId/items/:itemId
 * Remove an item from the cart.
 */
async function removeItem({ cartId, itemId, userId, guestId }) {
  const cart = await fetchCartWithItems(cartId);
  assertCartAccess(cart, { userId, guestId });

  if (cart.status !== 'active') {
    throw new AppError('Cart is not active.', 400);
  }

  const item = cart.items.find(i => i.id === itemId);
  if (!item) {
    throw new AppError('Cart item not found.', 404);
  }

  await db.query(
    'UPDATE cart_items SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1',
    [itemId]
  );

  await db.query('UPDATE carts SET updated_at = NOW() WHERE id = $1', [cartId]);

  const updatedCart = await fetchCartWithItems(cartId);
  const { subtotal, discountAmount, total } = computeTotals(updatedCart.items, updatedCart.discount_amount);
  return { ...updatedCart, subtotal, discountAmount, total };
}

/**
 * POST /carts/:cartId/promo
 * Apply a promo code to the cart.
 */
async function applyPromo({ cartId, promoCode, userId, guestId }) {
  if (!promoCode) throw new AppError('Promo code is required.', 400);

  const cart = await fetchCartWithItems(cartId);
  assertCartAccess(cart, { userId, guestId });

  if (cart.status !== 'active') {
    throw new AppError('Cart is not active.', 400);
  }

  // Validate promo code
  const promoResult = await db.query(
    `SELECT * FROM promo_codes
     WHERE code = $1
       AND is_active = TRUE
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (usage_limit IS NULL OR used_count < usage_limit)`,
    [promoCode]
  );

  if (!promoResult.rows.length) {
    throw new AppError('Promo code is invalid or has expired.', 422);
  }

  const promo = promoResult.rows[0];

  // Compute discount amount
  const subtotal = cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  let discountAmount = 0;
  if (promo.discount_type === 'percentage') {
    discountAmount = (subtotal * promo.discount_value) / 100;
    if (promo.max_discount_amount) {
      discountAmount = Math.min(discountAmount, promo.max_discount_amount);
    }
  } else if (promo.discount_type === 'fixed') {
    discountAmount = Math.min(promo.discount_value, subtotal);
  }

  await db.query(
    `UPDATE carts SET promo_code = $1, promo_code_id = $2, discount_amount = $3, updated_at = NOW()
     WHERE id = $4`,
    [promoCode, promo.id, discountAmount, cartId]
  );

  const updatedCart = await fetchCartWithItems(cartId);
  const totals = computeTotals(updatedCart.items, discountAmount);
  return { ...updatedCart, ...totals };
}

/**
 * DELETE /carts/:cartId/promo
 * Remove promo code from cart.
 */
async function removePromo({ cartId, userId, guestId }) {
  const cart = await fetchCartWithItems(cartId);
  assertCartAccess(cart, { userId, guestId });

  if (cart.status !== 'active') {
    throw new AppError('Cart is not active.', 400);
  }

  await db.query(
    `UPDATE carts SET promo_code = NULL, promo_code_id = NULL, discount_amount = 0, updated_at = NOW()
     WHERE id = $1`,
    [cartId]
  );

  const updatedCart = await fetchCartWithItems(cartId);
  const { subtotal, discountAmount, total } = computeTotals(updatedCart.items, 0);
  return { ...updatedCart, subtotal, discountAmount, total };
}

module.exports = {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyPromo,
  removePromo,
  mergeGuestCartIntoUserCart,
};
