import api from './api';

/**
 * GET /promo-codes — list all promo codes (admin)
 */
export async function getPromoCodes(params) {
  const response = await api.get('/promo-codes', { params });
  return response.data;
}

/**
 * POST /carts/:cartId/promo — validate and apply a promo code to a cart
 * (delegates to cartService.applyPromo; exposed here for convenience)
 */
export async function validatePromo(cartId, payload) {
  const response = await api.post(`/carts/${cartId}/promo`, payload);
  return response.data;
}

// ── Admin promo-code CRUD ─────────────────────────────────────────────────────

/**
 * POST /admin/promo-codes
 */
export async function adminCreatePromoCode(payload) {
  const response = await api.post('/admin/promo-codes', payload);
  return response.data;
}

/**
 * GET /admin/promo-codes/:promoCodeId
 */
export async function adminGetPromoCode(promoCodeId) {
  const response = await api.get(`/admin/promo-codes/${promoCodeId}`);
  return response.data;
}

/**
 * PUT /admin/promo-codes/:promoCodeId
 */
export async function adminUpdatePromoCode(promoCodeId, payload) {
  const response = await api.put(`/admin/promo-codes/${promoCodeId}`, payload);
  return response.data;
}

/**
 * DELETE /admin/promo-codes/:promoCodeId
 */
export async function adminDeletePromoCode(promoCodeId) {
  const response = await api.delete(`/admin/promo-codes/${promoCodeId}`);
  return response.data;
}
