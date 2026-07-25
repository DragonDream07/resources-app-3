import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

// Layouts
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// Public pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

// Auth pages (guest only)
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Protected user pages
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AddressesPage = lazy(() => import('@/pages/AddressesPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const ReturnRequestPage = lazy(() => import('@/pages/ReturnRequestPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminBrandsPage = lazy(() => import('@/pages/admin/AdminBrandsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('@/pages/admin/AdminOrderDetailPage'));
const AdminPromoCodesPage = lazy(() => import('@/pages/admin/AdminPromoCodesPage'));
const AdminReturnsPage = lazy(() => import('@/pages/admin/AdminReturnsPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));

const withSuspense = (element) => (
  <Suspense fallback={<div className="page-loading" />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    element: withSuspense(<MainLayout />),
    children: [
      // Public routes
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'search', element: withSuspense(<SearchPage />) },
      { path: 'products/:productId', element: withSuspense(<ProductPage />) },
      { path: 'categories/:categoryId', element: withSuspense(<CategoryPage />) },

      // Guest-only routes
      {
        element: withSuspense(<GuestRoute />),
        children: [
          {
            element: withSuspense(<AuthLayout />),
            children: [
              { path: 'login', element: withSuspense(<LoginPage />) },
              { path: 'register', element: withSuspense(<RegisterPage />) },
              { path: 'forgot-password', element: withSuspense(<ForgotPasswordPage />) },
              { path: 'reset-password', element: withSuspense(<ResetPasswordPage />) },
            ],
          },
        ],
      },

      // Protected user routes
      {
        element: withSuspense(<ProtectedRoute />),
        children: [
          { path: 'cart', element: withSuspense(<CartPage />) },
          { path: 'checkout', element: withSuspense(<CheckoutPage />) },
          { path: 'orders', element: withSuspense(<OrdersPage />) },
          { path: 'orders/:orderId', element: withSuspense(<OrderDetailPage />) },
          { path: 'profile', element: withSuspense(<ProfilePage />) },
          { path: 'addresses', element: withSuspense(<AddressesPage />) },
          { path: 'notifications', element: withSuspense(<NotificationsPage />) },
          { path: 'return-requests/:returnRequestId', element: withSuspense(<ReturnRequestPage />) },
        ],
      },
    ],
  },

  // Admin routes
  {
    element: withSuspense(<AdminRoute />),
    children: [
      {
        path: 'admin',
        element: withSuspense(<AdminLayout />),
        children: [
          { index: true, element: withSuspense(<AdminDashboardPage />) },
          { path: 'products', element: withSuspense(<AdminProductsPage />) },
          { path: 'categories', element: withSuspense(<AdminCategoriesPage />) },
          { path: 'brands', element: withSuspense(<AdminBrandsPage />) },
          { path: 'orders', element: withSuspense(<AdminOrdersPage />) },
          { path: 'orders/:orderId', element: withSuspense(<AdminOrderDetailPage />) },
          { path: 'promo-codes', element: withSuspense(<AdminPromoCodesPage />) },
          { path: 'returns', element: withSuspense(<AdminReturnsPage />) },
          { path: 'reports', element: withSuspense(<AdminReportsPage />) },
        ],
      },
    ],
  },

  // Utility pages
  { path: '403', element: withSuspense(<ForbiddenPage />) },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]);

export default router;
