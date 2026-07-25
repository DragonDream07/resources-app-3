const Joi = require('joi');

const updateMe = Joi.object({
  first_name: Joi.string().trim().min(1).max(100).optional(),
  last_name: Joi.string().trim().min(1).max(100).optional(),
  phone: Joi.string().trim().max(20).optional().allow(null, ''),
}).min(1).messages({
  'object.min': 'At least one field must be provided.',
});

const changePassword = Joi.object({
  current_password: Joi.string().required().messages({
    'any.required': 'Current password is required.',
    'string.empty': 'Current password is required.',
  }),
  new_password: Joi.string().min(8).required().messages({
    'any.required': 'New password is required.',
    'string.empty': 'New password is required.',
    'string.min': 'New password must be at least 8 characters.',
  }),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
    'any.required': 'Confirm password is required.',
    'string.empty': 'Confirm password is required.',
    'any.only': 'Passwords do not match.',
  }),
});

const createAddress = Joi.object({
  label: Joi.string().trim().max(50).optional(),
  recipient_name: Joi.string().trim().min(1).max(150).required().messages({
    'any.required': 'Recipient name is required.',
    'string.empty': 'Recipient name is required.',
  }),
  phone: Joi.string().trim().max(20).required().messages({
    'any.required': 'Phone is required.',
    'string.empty': 'Phone is required.',
  }),
  address_line1: Joi.string().trim().min(1).max(255).required().messages({
    'any.required': 'Address line 1 is required.',
    'string.empty': 'Address line 1 is required.',
  }),
  address_line2: Joi.string().trim().max(255).optional().allow(null, ''),
  city: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': 'City is required.',
    'string.empty': 'City is required.',
  }),
  state: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': 'State is required.',
    'string.empty': 'State is required.',
  }),
  postal_code: Joi.string().trim().min(1).max(20).required().messages({
    'any.required': 'Postal code is required.',
    'string.empty': 'Postal code is required.',
  }),
  country: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': 'Country is required.',
    'string.empty': 'Country is required.',
  }),
  is_default: Joi.boolean().optional(),
});

const updateAddress = Joi.object({
  label: Joi.string().trim().max(50).optional(),
  recipient_name: Joi.string().trim().min(1).max(150).optional(),
  phone: Joi.string().trim().max(20).optional(),
  address_line1: Joi.string().trim().min(1).max(255).optional(),
  address_line2: Joi.string().trim().max(255).optional().allow(null, ''),
  city: Joi.string().trim().min(1).max(100).optional(),
  state: Joi.string().trim().min(1).max(100).optional(),
  postal_code: Joi.string().trim().min(1).max(20).optional(),
  country: Joi.string().trim().min(1).max(100).optional(),
  is_default: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided.',
});

const adminUpdateUser = Joi.object({
  first_name: Joi.string().trim().min(1).max(100).optional(),
  last_name: Joi.string().trim().min(1).max(100).optional(),
  phone: Joi.string().trim().max(20).optional().allow(null, ''),
  role: Joi.string().valid('customer', 'admin', 'staff').optional().messages({
    'any.only': 'Role must be one of customer, admin, staff.',
  }),
  is_active: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided.',
});

module.exports = {
  updateMe,
  changePassword,
  createAddress,
  updateAddress,
  adminUpdateUser,
};
