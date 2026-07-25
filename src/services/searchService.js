import api from './api';

/**
 * GET /search
 */
export async function search(params) {
  const response = await api.get('/search', { params });
  return response.data;
}

/**
 * GET /search/suggest
 */
export async function searchSuggest(params) {
  const response = await api.get('/search/suggest', { params });
  return response.data;
}
