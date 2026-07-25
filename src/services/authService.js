import api from './api';

/**
 * POST /auth/register
 */
export async function register(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

/**
 * POST /auth/guest-register
 */
export async function guestRegister(payload) {
  const response = await api.post('/auth/guest-register', payload);
  return response.data;
}

/**
 * POST /auth/login
 */
export async function login(payload) {
  const response = await api.post('/auth/login', payload);
  const data = response.data.data || response.data;
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return response.data;
}

/**
 * POST /auth/logout
 */
export async function logout() {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

/**
 * POST /auth/forgot-password
 */
export async function forgotPassword(payload) {
  const response = await api.post('/auth/forgot-password', payload);
  return response.data;
}

/**
 * POST /auth/reset-password
 */
export async function resetPassword(payload) {
  const response = await api.post('/auth/reset-password', payload);
  return response.data;
}
