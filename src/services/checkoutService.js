import api from './api';

/**
 * GET /checkout/review
 */
export async function getCheckoutReview(params) {
  const response = await api.get('/checkout/review', { params });
  return response.data;
}

/**
 * POST /checkout/address
 */
export async function submitCheckoutAddress(payload) {
  const response = await api.post('/checkout/address', payload);
  return response.data;
}

/**
 * POST /checkout/place-order
 */
export async function placeOrder(payload) {
  const response = await api.post('/checkout/place-order', payload);
  return response.data;
}
