/**
 * @fileoverview JSDoc type definitions for catalogue-related shapes.
 */

/**
 * @typedef {Object} Category
 * @property {string} id - UUID of the category
 * @property {string} name - Category name
 * @property {string|null} slug - URL slug
 * @property {string|null} parent_id - Parent category UUID, null if root
 * @property {string|null} description - Category description
 * @property {string|null} image_url - URL of category image
 * @property {boolean} is_active - Whether the category is active
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Brand
 * @property {string} id - UUID of the brand
 * @property {string} name - Brand name
 * @property {string|null} slug - URL slug
 * @property {string|null} description - Brand description
 * @property {string|null} logo_url - URL of brand logo
 * @property {boolean} is_active - Whether the brand is active
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} ProductImage
 * @property {string} id - UUID of the image
 * @property {string} product_id - UUID of the product
 * @property {string} url - Image URL
 * @property {string|null} alt_text - Alt text for the image
 * @property {number} sort_order - Display order
 * @property {string} created_at - ISO timestamp of creation
 */

/**
 * @typedef {Object} SKU
 * @property {string} id - UUID of the SKU
 * @property {string} product_id - UUID of the parent product
 * @property {string} sku_code - Unique SKU code string
 * @property {number} price - Price in smallest currency unit (paise)
 * @property {number} stock_quantity - Available stock
 * @property {Object.<string, string>} attributes - Key-value attribute pairs (e.g. size, color)
 * @property {boolean} is_active - Whether the SKU is active
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Product
 * @property {string} id - UUID of the product
 * @property {string} name - Product name
 * @property {string|null} slug - URL slug
 * @property {string|null} description - Product description
 * @property {string} category_id - UUID of the category
 * @property {string} brand_id - UUID of the brand
 * @property {boolean} is_active - Whether the product is active
 * @property {Category} [category] - Expanded category object
 * @property {Brand} [brand] - Expanded brand object
 * @property {SKU[]} [skus] - Array of SKU variants
 * @property {ProductImage[]} [images] - Array of product images
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
