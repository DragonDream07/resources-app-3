const cartService = require('./cart.service');
const { sendSuccess, sendError } = require('../../utils/response');

/**
 * POST /carts
 * Create a new cart
 */
async function createCart(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const guestId = req.body.guestId || null;
    const cart = await cartService.createCart({ userId, guestId });
    return sendSuccess(res, cart, 201);
  } catch (err) {
    return sendError(res, err);
  }
}

/**
 * GET /carts/:cartId
 * Retrieve cart by ID
 */
async function getCart(req, res) {
  try {
    const { cartId } = req.params;
    const userId = req.user ? req.user.id : null;
    const guestId = req.query.guestId || null;
    const cart = await cartService.getCart({ cartId, userId, guestId });
    return sendSuccess(res, cart);
  } catch (err) {
    return sendError(res, err);
  }
}

/**
 * POST /carts/:cartId/items
 * Add item to cart
 */
async function addItem(req, res) {
  try {
    const { cartId } = req.params;
    const { skuId, quantity } = req.body;
    const userId = req.user ? req.user.id : null;
    const guestId = req.body.guestId || null;
    const cart = await cartService.addItem({ cartId, skuId, quantity, userId, guestId });
    return sendSuccess(res, cart, 201);
  } catch (err) {
    return sendError(res, err);
  }
}

/**
 * PATCH /carts/:cartId/items/:itemId
 * Update item quantity in cart
 */
async function updateItem(req, res) {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user ? req.user.id : null;
    const guestId = req.body.guestId || null;
    const cart = await cartService.updateItem({ cartId, itemId, quantity, userId, guestId });
    return sendSuccess(res, cart);
  } catch (err) {
    return sendError(res, err);
  }
}

/**
 * DELETE /carts/:cartId/items/:itemId
 * Remove item from cart
 */
async function removeItem(req, res) {
  try {
    const { cartId, itemId } = req.params;
    const userId = req.user ? req.user.id : null;
    const guestId = req.query.guestId || null;
    const cart = await cartService.removeItem({ cartId, itemId, userId, guestId });
    return sendSuccess(res, cart);
  } catch (err) {
    return sendError(res, err);
  }
}

/**
 * POST /carts/:cartId/promo
 * Apply promo code to cart
 */
async function applyPromo(req, res) {
  try {
    const { cartId } = req.params;
    const { promoCode } = req.body;
    const userId = req.user ? req.user.id : null;
    const guestId = req.body.guestId || null;
    const cart = await cartService.applyPromo({ cartId, promoCode, userId, guestId });
    return sendSuccess(res, cart);
  } catch (err) {
    return sendError(res, err);
  }
}

/**
 * DELETE /carts/:cartId/promo
 * Remove promo code from cart
 */
async function removePromo(req, res) {
  try {
    const { cartId } = req.params;
    const userId = req.user ? req.user.id : null;
    const guestId = req.query.guestId || null;
    const cart = await cartService.removePromo({ cartId, userId, guestId });
    return sendSuccess(res, cart);
  } catch (err) {
    return sendError(res, err);
  }
}

module.exports = {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyPromo,
  removePromo,
};
