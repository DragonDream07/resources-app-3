import api from './api';

/**
 * GET /return-requests/:returnRequestId
 */
export async function getReturnRequest(returnRequestId) {
  const response = await api.get(`/return-requests/${returnRequestId}`);
  return response.data;
}

// ── Admin returns endpoints ───────────────────────────────────────────────────

/**
 * GET /return-requests
 */
export async function adminGetReturnRequests(params) {
  const response = await api.get('/return-requests', { params });
  return response.data;
}

/**
 * POST /return-requests/:returnRequestId/review
 */
export async function adminReviewReturnRequest(returnRequestId, payload) {
  const response = await api.post(`/return-requests/${returnRequestId}/review`, payload);
  return response.data;
}
