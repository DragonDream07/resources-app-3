const Joi = require('joi');

// ─── Product Schemas ──────────────────────────────────────────────────────────

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required',
    'string.max': 'Product name must not exceed 255 characters',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  base_price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Base price must be a number',
    'number.positive': 'Base price must be greater than 0',
    'any.required': 'Base price is required',
  }),
  category_id: Joi.string().uuid().required().messages({
    'string.guid': 'category_id must be a valid UUID',
    'any.required': 'category_id is required',
  }),
  brand_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'brand_id must be a valid UUID',
  }),
  is_active: Joi.boolean().optional(),
  attributes: Joi.object().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Product name must not be empty',
    'string.max': 'Product name must not exceed 255 characters',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  base_price: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'Base price must be a number',
    'number.positive': 'Base price must be greater than 0',
  }),
  category_id: Joi.string().uuid().optional().messages({
    'string.guid': 'category_id must be a valid UUID',
  }),
  brand_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'brand_id must be a valid UUID',
  }),
  is_active: Joi.boolean().optional(),
  attributes: Joi.object().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ─── SKU Schemas ──────────────────────────────────────────────────────────────

const createSkuSchema = Joi.object({
  sku_code: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'SKU code is required',
    'any.required': 'SKU code is required',
    'string.max': 'SKU code must not exceed 100 characters',
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be greater than 0',
    'any.required': 'Price is required',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity must be 0 or greater',
  }),
  attributes: Joi.object().optional(),
});

const updateSkuSchema = Joi.object({
  sku_code: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'SKU code must not be empty',
    'string.max': 'SKU code must not exceed 100 characters',
  }),
  price: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be greater than 0',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity must be 0 or greater',
  }),
  attributes: Joi.object().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ─── Category Schemas ─────────────────────────────────────────────────────────

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Category name is required',
    'any.required': 'Category name is required',
    'string.max': 'Category name must not exceed 255 characters',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  parent_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'parent_id must be a valid UUID',
  }),
  image_url: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'image_url must be a valid URL',
  }),
  is_active: Joi.boolean().optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Category name must not be empty',
    'string.max': 'Category name must not exceed 255 characters',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  parent_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'parent_id must be a valid UUID',
  }),
  image_url: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'image_url must be a valid URL',
  }),
  is_active: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ─── Brand Schemas ────────────────────────────────────────────────────────────

const createBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Brand name is required',
    'any.required': 'Brand name is required',
    'string.max': 'Brand name must not exceed 255 characters',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  image_url: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'image_url must be a valid URL',
  }),
  is_active: Joi.boolean().optional(),
});

const updateBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Brand name must not be empty',
    'string.max': 'Brand name must not exceed 255 characters',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  image_url: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'image_url must be a valid URL',
  }),
  is_active: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ─── Product Image Schema ─────────────────────────────────────────────────────

const productImageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'url must be a valid URL',
    'string.empty': 'Image URL is required',
    'any.required': 'Image URL is required',
  }),
  alt_text: Joi.string().trim().max(255).allow('', null).optional().messages({
    'string.max': 'alt_text must not exceed 255 characters',
  }),
  sort_order: Joi.number().integer().min(0).optional().messages({
    'number.base': 'sort_order must be a number',
    'number.integer': 'sort_order must be an integer',
    'number.min': 'sort_order must be 0 or greater',
  }),
});

// ─── Query Schemas ────────────────────────────────────────────────────────────

const productListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    'number.base': 'page must be a number',
    'number.integer': 'page must be an integer',
    'number.min': 'page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    'number.base': 'limit must be a number',
    'number.integer': 'limit must be an integer',
    'number.min': 'limit must be at least 1',
    'number.max': 'limit must not exceed 100',
  }),
  category_id: Joi.string().uuid().optional().messages({
    'string.guid': 'category_id must be a valid UUID',
  }),
  brand_id: Joi.string().uuid().optional().messages({
    'string.guid': 'brand_id must be a valid UUID',
  }),
  min_price: Joi.number().min(0).optional().messages({
    'number.base': 'min_price must be a number',
    'number.min': 'min_price must be 0 or greater',
  }),
  max_price: Joi.number().min(0).optional().messages({
    'number.base': 'max_price must be a number',
    'number.min': 'max_price must be 0 or greater',
  }),
  sort_by: Joi.string().valid('created_at', 'name', 'price').optional().messages({
    'any.only': 'sort_by must be one of created_at, name, price',
  }),
  sort_order: Joi.string().valid('asc', 'desc').optional().messages({
    'any.only': 'sort_order must be one of asc, desc',
  }),
  search: Joi.string().trim().max(255).allow('').optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  createSkuSchema,
  updateSkuSchema,
  createCategorySchema,
  updateCategorySchema,
  createBrandSchema,
  updateBrandSchema,
  productImageSchema,
  productListQuerySchema,
};
