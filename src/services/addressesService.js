import api from './api';

/**
 * GET /users/me/addresses
 */
export async function getAddresses() {
  const response = await api.get('/users/me/addresses');
  return response.data;
}

/**
 * GET /users/me/addresses/:addressId
 */
export async function getAddress(addressId) {
  const response = await api.get(`/users/me/addresses/${addressId}`);
  return response.data;
}

/**
 * POST /users/me/addresses
 */
export async function createAddress(payload) {
  const response = await api.post('/users/me/addresses', payload);
  return response.data;
}

/**
 * PUT /users/me/addresses/:addressId
 */
export async function updateAddress(addressId, payload) {
  const response = await api.put(`/users/me/addresses/${addressId}`, payload);
  return response.data;
}

/**
 * DELETE /users/me/addresses/:addressId
 */
export async function deleteAddress(addressId) {
  const response = await api.delete(`/users/me/addresses/${addressId}`);
  return response.data;
}

/**
 * GET /serviceability — check PIN code serviceability
 */
export async function checkServiceability(params) {
  const response = await api.get('/serviceability', { params });
  return response.data;
}
