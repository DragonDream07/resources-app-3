import api from './api';

/**
 * GET /carts/:cartId
 */
export async function getCart(cartId) {
  const response = await api.get(`/carts/${cartId}`);
  return response.data;
}

/**
 * POST /carts/:cartId/items
 */
export async function addCartItem(cartId, payload) {
  const response = await api.post(`/carts/${cartId}/items`, payload);
  return response.data;
}

/**
 * PATCH /carts/:cartId/items/:itemId
 */
export async function updateCartItem(cartId, itemId, payload) {
  const response = await api.patch(`/carts/${cartId}/items/${itemId}`, payload);
  return response.data;
}

/**
 * DELETE /carts/:cartId/items/:itemId
 */
export async function removeCartItem(cartId, itemId) {
  const response = await api.delete(`/carts/${cartId}/items/${itemId}`);
  return response.data;
}

/**
 * POST /carts/:cartId/promo — apply promo code to cart
 */
export async function applyPromo(cartId, payload) {
  const response = await api.post(`/carts/${cartId}/promo`, payload);
  return response.data;
}
