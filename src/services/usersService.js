import api from './api';

/**
 * GET /users/me
 */
export async function getMe() {
  const response = await api.get('/users/me');
  return response.data;
}

/**
 * PATCH /users/me
 */
export async function updateMe(payload) {
  const response = await api.patch('/users/me', payload);
  return response.data;
}

/**
 * POST /users/me/change-password
 */
export async function changePassword(payload) {
  const response = await api.post('/users/me/change-password', payload);
  return response.data;
}

// ── Admin user endpoints ──────────────────────────────────────────────────────

/**
 * GET /admin/users
 */
export async function adminListUsers(params) {
  const response = await api.get('/admin/users', { params });
  return response.data;
}

/**
 * GET /admin/users/:userId
 */
export async function adminGetUser(userId) {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
}

/**
 * PATCH /admin/users/:userId
 */
export async function adminUpdateUser(userId, payload) {
  const response = await api.patch(`/admin/users/${userId}`, payload);
  return response.data;
}

/**
 * DELETE /admin/users/:userId
 */
export async function adminDeleteUser(userId) {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
}
