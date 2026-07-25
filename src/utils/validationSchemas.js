import * as yup from 'yup';

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address'),
  password: yup
    .string()
    .required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address'),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

// ---------------------------------------------------------------------------
// User / profile schemas
// ---------------------------------------------------------------------------

export const updateProfileSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: yup
    .string()
    .nullable()
    .matches(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number')
    .optional(),
});

// ---------------------------------------------------------------------------
// Address schemas
// ---------------------------------------------------------------------------

export const addressSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  line1: yup
    .string()
    .required('Address line 1 is required'),
  line2: yup
    .string()
    .nullable()
    .optional(),
  city: yup
    .string()
    .required('City is required'),
  state: yup
    .string()
    .required('State is required'),
  pinCode: yup
    .string()
    .required('PIN code is required')
    .matches(/^\d{6}$/, 'PIN code must be a 6-digit number'),
  isDefault: yup
    .boolean()
    .optional(),
});

// ---------------------------------------------------------------------------
// Checkout schemas
// ---------------------------------------------------------------------------

export const checkoutAddressSchema = addressSchema;

export const promoCodeSchema = yup.object({
  code: yup
    .string()
    .required('Promo code is required')
    .trim()
    .uppercase(),
});

// ---------------------------------------------------------------------------
// Search schema
// ---------------------------------------------------------------------------

export const searchSchema = yup.object({
  q: yup
    .string()
    .required('Search query is required')
    .min(1, 'Search query cannot be empty')
    .max(200, 'Search query is too long'),
});

// ---------------------------------------------------------------------------
// Cart schemas
// ---------------------------------------------------------------------------

export const addToCartSchema = yup.object({
  skuId: yup
    .string()
    .required('SKU is required'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
});

export const updateCartItemSchema = yup.object({
  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
});

// ---------------------------------------------------------------------------
// Admin — product schemas
// ---------------------------------------------------------------------------

export const productSchema = yup.object({
  name: yup
    .string()
    .required('Product name is required')
    .min(2, 'Product name must be at least 2 characters'),
  description: yup
    .string()
    .nullable()
    .optional(),
  categoryId: yup
    .string()
    .required('Category is required'),
  brandId: yup
    .string()
    .nullable()
    .optional(),
  isActive: yup
    .boolean()
    .optional(),
});

export const skuSchema = yup.object({
  sku: yup
    .string()
    .required('SKU code is required'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be a positive number'),
  stock: yup
    .number()
    .required('Stock is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  attributes: yup
    .object()
    .nullable()
    .optional(),
});

// ---------------------------------------------------------------------------
// Admin — category schemas
// ---------------------------------------------------------------------------

export const categorySchema = yup.object({
  name: yup
    .string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters'),
  parentId: yup
    .string()
    .nullable()
    .optional(),
  description: yup
    .string()
    .nullable()
    .optional(),
});

// ---------------------------------------------------------------------------
// Admin — brand schemas
// ---------------------------------------------------------------------------

export const brandSchema = yup.object({
  name: yup
    .string()
    .required('Brand name is required')
    .min(2, 'Brand name must be at least 2 characters'),
  description: yup
    .string()
    .nullable()
    .optional(),
});

// ---------------------------------------------------------------------------
// Admin — promotion schemas
// ---------------------------------------------------------------------------

export const promotionSchema = yup.object({
  code: yup
    .string()
    .required('Promo code is required')
    .trim()
    .uppercase(),
  discountType: yup
    .string()
    .required('Discount type is required')
    .oneOf(['percentage', 'flat'], 'Invalid discount type'),
  discountValue: yup
    .number()
    .required('Discount value is required')
    .positive('Discount value must be positive'),
  minOrderAmount: yup
    .number()
    .nullable()
    .min(0, 'Minimum order amount cannot be negative')
    .optional(),
  maxUses: yup
    .number()
    .nullable()
    .integer('Max uses must be a whole number')
    .min(1, 'Max uses must be at least 1')
    .optional(),
  expiresAt: yup
    .string()
    .nullable()
    .optional(),
  isActive: yup
    .boolean()
    .optional(),
});

// ---------------------------------------------------------------------------
// Return request schema
// ---------------------------------------------------------------------------

export const returnRequestSchema = yup.object({
  reason: yup
    .string()
    .required('Return reason is required')
    .min(10, 'Please provide a more detailed reason (at least 10 characters)'),
  items: yup
    .array()
    .of(
      yup.object({
        orderItemId: yup.string().required('Order item is required'),
        quantity: yup
          .number()
          .required('Quantity is required')
          .integer('Quantity must be a whole number')
          .min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'At least one item must be selected for return')
    .required('Items are required'),
});
