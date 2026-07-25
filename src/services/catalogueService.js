import api from './api';

// ── Products ──────────────────────────────────────────────────────────────────

/**
 * GET /products
 */
export async function getProducts(params) {
  const response = await api.get('/products', { params });
  return response.data;
}

/**
 * GET /products/:productId
 */
export async function getProduct(productId) {
  const response = await api.get(`/products/${productId}`);
  return response.data;
}

/**
 * GET /products/:productId/skus
 */
export async function getProductSkus(productId) {
  const response = await api.get(`/products/${productId}/skus`);
  return response.data;
}

/**
 * GET /products/:productId/images
 */
export async function getProductImages(productId) {
  const response = await api.get(`/products/${productId}/images`);
  return response.data;
}

// ── Categories ────────────────────────────────────────────────────────────────

/**
 * GET /categories
 */
export async function getCategories(params) {
  const response = await api.get('/categories', { params });
  return response.data;
}

/**
 * GET /categories/:categoryId
 */
export async function getCategory(categoryId) {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data;
}

/**
 * GET /categories/:categoryId/products
 */
export async function getCategoryProducts(categoryId, params) {
  const response = await api.get(`/categories/${categoryId}/products`, { params });
  return response.data;
}

// ── Brands ────────────────────────────────────────────────────────────────────

/**
 * GET /brands
 */
export async function getBrands(params) {
  const response = await api.get('/brands', { params });
  return response.data;
}

/**
 * GET /brands/:brandId
 */
export async function getBrand(brandId) {
  const response = await api.get(`/brands/${brandId}`);
  return response.data;
}

// ── Admin catalogue CRUD ──────────────────────────────────────────────────────

/**
 * POST /products
 */
export async function adminCreateProduct(payload) {
  const response = await api.post('/products', payload);
  return response.data;
}

/**
 * PUT /products/:productId
 */
export async function adminUpdateProduct(productId, payload) {
  const response = await api.put(`/products/${productId}`, payload);
  return response.data;
}

/**
 * DELETE /products/:productId
 */
export async function adminDeleteProduct(productId) {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
}

/**
 * POST /products/:productId/images
 */
export async function adminUploadProductImages(productId, formData) {
  const response = await api.post(`/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * POST /products/:productId/skus
 */
export async function adminCreateProductSku(productId, payload) {
  const response = await api.post(`/products/${productId}/skus`, payload);
  return response.data;
}

/**
 * PUT /products/:productId/skus/:skuId
 */
export async function adminUpdateProductSku(productId, skuId, payload) {
  const response = await api.put(`/products/${productId}/skus/${skuId}`, payload);
  return response.data;
}

/**
 * POST /categories
 */
export async function adminCreateCategory(payload) {
  const response = await api.post('/categories', payload);
  return response.data;
}

/**
 * PUT /categories/:categoryId
 */
export async function adminUpdateCategory(categoryId, payload) {
  const response = await api.put(`/categories/${categoryId}`, payload);
  return response.data;
}

/**
 * DELETE /categories/:categoryId
 */
export async function adminDeleteCategory(categoryId) {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
}

/**
 * POST /brands
 */
export async function adminCreateBrand(payload) {
  const response = await api.post('/brands', payload);
  return response.data;
}
