import api from './api';

// ── Customer order endpoints ──────────────────────────────────────────────────

/**
 * GET /orders
 */
export async function getOrders(params) {
  const response = await api.get('/orders', { params });
  return response.data;
}

/**
 * GET /orders/:orderId
 */
export async function getOrder(orderId) {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
}

/**
 * GET /orders/:orderId/timeline
 */
export async function getOrderTimeline(orderId) {
  const response = await api.get(`/orders/${orderId}/timeline`);
  return response.data;
}

/**
 * GET /orders/:orderId/tracking
 */
export async function getOrderTracking(orderId) {
  const response = await api.get(`/orders/${orderId}/tracking`);
  return response.data;
}

/**
 * POST /orders/:orderId/cancel
 */
export async function cancelOrder(orderId, payload) {
  const response = await api.post(`/orders/${orderId}/cancel`, payload);
  return response.data;
}

/**
 * GET /orders/:orderId/refunds
 */
export async function getOrderRefunds(orderId) {
  const response = await api.get(`/orders/${orderId}/refunds`);
  return response.data;
}

/**
 * POST /orders/:orderId/return-requests
 */
export async function createReturnRequest(orderId, payload) {
  const response = await api.post(`/orders/${orderId}/return-requests`, payload);
  return response.data;
}

// ── Admin order endpoints ─────────────────────────────────────────────────────

/**
 * GET /admin/orders
 */
export async function adminGetOrders(params) {
  const response = await api.get('/admin/orders', { params });
  return response.data;
}

/**
 * GET /admin/orders/:orderId
 */
export async function adminGetOrder(orderId) {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data;
}

/**
 * POST /orders/:orderId/advance — advance order status
 */
export async function adminAdvanceOrder(orderId, payload) {
  const response = await api.post(`/orders/${orderId}/advance`, payload);
  return response.data;
}
