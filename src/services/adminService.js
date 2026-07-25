import api from './api';
import { adminGetOrders, adminGetOrder, adminAdvanceOrder } from './ordersService';
import { adminGetReturnRequests, adminReviewReturnRequest } from './returnsService';
import { adminListUsers, adminGetUser, adminUpdateUser, adminDeleteUser } from './usersService';
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadProductImages,
  adminCreateProductSku,
  adminUpdateProductSku,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateBrand,
} from './catalogueService';
import {
  adminCreatePromoCode,
  adminGetPromoCode,
  adminUpdatePromoCode,
  adminDeletePromoCode,
} from './promotionsService';

// ── Dashboard & Reports ───────────────────────────────────────────────────────

/**
 * GET /admin/reports
 */
export async function getAdminReports(params) {
  const response = await api.get('/admin/reports', { params });
  return response.data;
}

/**
 * GET /admin/dashboard/stats  (inferred from design; falls back gracefully)
 */
export async function getAdminDashboardStats() {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
}

// ── Domain service delegates — Orders ─────────────────────────────────────────
export { adminGetOrders, adminGetOrder, adminAdvanceOrder };

// ── Domain service delegates — Returns ────────────────────────────────────────
export { adminGetReturnRequests, adminReviewReturnRequest };

// ── Domain service delegates — Users ──────────────────────────────────────────
export { adminListUsers, adminGetUser, adminUpdateUser, adminDeleteUser };

// ── Domain service delegates — Catalogue ──────────────────────────────────────
export {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadProductImages,
  adminCreateProductSku,
  adminUpdateProductSku,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateBrand,
};

// ── Domain service delegates — Promotions ─────────────────────────────────────
export { adminCreatePromoCode, adminGetPromoCode, adminUpdatePromoCode, adminDeletePromoCode };
