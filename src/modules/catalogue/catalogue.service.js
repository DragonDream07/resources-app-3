const db = require('../../db');
const { NotFoundError, ConflictError } = require('../../errors');

// ─── Products ────────────────────────────────────────────────────────────────

async function listProducts(query) {
  const {
    page = 1,
    limit = 20,
    category_id,
    brand_id,
    min_price,
    max_price,
    sort_by = 'created_at',
    sort_order = 'desc',
    search,
  } = query;

  const offset = (Number(page) - 1) * Number(limit);
  const allowedSortFields = ['created_at', 'name', 'price'];
  const allowedSortOrders = ['asc', 'desc'];
  const safeSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
  const safeSortOrder = allowedSortOrders.includes(sort_order) ? sort_order : 'desc';

  const conditions = ['p.deleted_at IS NULL'];
  const params = [];

  if (category_id) {
    params.push(category_id);
    conditions.push(`p.category_id = $${params.length}`);
  }
  if (brand_id) {
    params.push(brand_id);
    conditions.push(`p.brand_id = $${params.length}`);
  }
  if (min_price !== undefined) {
    params.push(Number(min_price));
    conditions.push(`p.base_price >= $${params.length}`);
  }
  if (max_price !== undefined) {
    params.push(Number(max_price));
    conditions.push(`p.base_price <= $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*) FROM products p ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(Number(limit));
  params.push(offset);

  const result = await db.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON p.brand_id = b.id
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}
     ORDER BY p.${safeSortBy} ${safeSortOrder}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    data: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      total_pages: Math.ceil(total / Number(limit)),
    },
  };
}

async function getProduct(productId) {
  const result = await db.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON p.brand_id = b.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
    [productId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Product not found');
  }
  const product = result.rows[0];
  const [skus, images] = await Promise.all([
    listSkus(productId),
    listProductImages(productId),
  ]);
  return { ...product, skus, images };
}

async function createProduct(data) {
  const {
    name,
    description,
    base_price,
    category_id,
    brand_id,
    is_active = true,
    attributes,
  } = data;

  const result = await db.query(
    `INSERT INTO products (name, description, base_price, category_id, brand_id, is_active, attributes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, description, base_price, category_id, brand_id, is_active, JSON.stringify(attributes || {})]
  );
  return result.rows[0];
}

async function updateProduct(productId, data) {
  const existing = await db.query(
    'SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL',
    [productId]
  );
  if (!existing.rows.length) {
    throw new NotFoundError('Product not found');
  }

  const fields = [];
  const params = [];

  const updatable = ['name', 'description', 'base_price', 'category_id', 'brand_id', 'is_active', 'attributes'];
  updatable.forEach((key) => {
    if (data[key] !== undefined) {
      params.push(key === 'attributes' ? JSON.stringify(data[key]) : data[key]);
      fields.push(`${key} = $${params.length}`);
    }
  });

  if (!fields.length) {
    return getProduct(productId);
  }

  params.push(productId);
  const result = await db.query(
    `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${params.length} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return result.rows[0];
}

async function deleteProduct(productId) {
  const result = await db.query(
    'UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
    [productId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Product not found');
  }
}

// ─── Product Images ──────────────────────────────────────────────────────────

async function listProductImages(productId) {
  const result = await db.query(
    'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC, created_at ASC',
    [productId]
  );
  return result.rows;
}

async function addProductImage(productId, data) {
  const productExists = await db.query(
    'SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL',
    [productId]
  );
  if (!productExists.rows.length) {
    throw new NotFoundError('Product not found');
  }

  const { url, alt_text, sort_order = 0 } = data;
  const result = await db.query(
    `INSERT INTO product_images (product_id, url, alt_text, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [productId, url, alt_text, sort_order]
  );
  return result.rows[0];
}

async function deleteProductImage(productId, imageId) {
  const result = await db.query(
    'DELETE FROM product_images WHERE id = $1 AND product_id = $2 RETURNING id',
    [imageId, productId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Product image not found');
  }
}

// ─── SKUs ────────────────────────────────────────────────────────────────────

async function listSkus(productId) {
  const result = await db.query(
    'SELECT * FROM skus WHERE product_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC',
    [productId]
  );
  return result.rows;
}

async function getSku(productId, skuId) {
  const result = await db.query(
    'SELECT * FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL',
    [skuId, productId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('SKU not found');
  }
  return result.rows[0];
}

async function createSku(productId, data) {
  const productExists = await db.query(
    'SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL',
    [productId]
  );
  if (!productExists.rows.length) {
    throw new NotFoundError('Product not found');
  }

  const { sku_code, price, stock_quantity = 0, attributes } = data;

  const duplicate = await db.query(
    'SELECT id FROM skus WHERE sku_code = $1 AND deleted_at IS NULL',
    [sku_code]
  );
  if (duplicate.rows.length) {
    throw new ConflictError('SKU code already exists');
  }

  const result = await db.query(
    `INSERT INTO skus (product_id, sku_code, price, stock_quantity, attributes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [productId, sku_code, price, stock_quantity, JSON.stringify(attributes || {})]
  );
  return result.rows[0];
}

async function updateSku(productId, skuId, data) {
  const existing = await db.query(
    'SELECT id FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL',
    [skuId, productId]
  );
  if (!existing.rows.length) {
    throw new NotFoundError('SKU not found');
  }

  const fields = [];
  const params = [];

  const updatable = ['sku_code', 'price', 'stock_quantity', 'attributes'];
  updatable.forEach((key) => {
    if (data[key] !== undefined) {
      params.push(key === 'attributes' ? JSON.stringify(data[key]) : data[key]);
      fields.push(`${key} = $${params.length}`);
    }
  });

  if (!fields.length) {
    return getSku(productId, skuId);
  }

  params.push(skuId);
  const result = await db.query(
    `UPDATE skus SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${params.length} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return result.rows[0];
}

async function deleteSku(productId, skuId) {
  const result = await db.query(
    'UPDATE skus SET deleted_at = NOW() WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL RETURNING id',
    [skuId, productId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('SKU not found');
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

async function listCategories() {
  const result = await db.query(
    'SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY name ASC'
  );
  return result.rows;
}

async function getCategory(categoryId) {
  const result = await db.query(
    'SELECT * FROM categories WHERE id = $1 AND deleted_at IS NULL',
    [categoryId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Category not found');
  }
  return result.rows[0];
}

async function listProductsByCategory(categoryId, query) {
  await getCategory(categoryId);
  return listProducts({ ...query, category_id: categoryId });
}

async function createCategory(data) {
  const { name, description, parent_id, image_url, is_active = true } = data;

  const duplicate = await db.query(
    'SELECT id FROM categories WHERE name = $1 AND deleted_at IS NULL',
    [name]
  );
  if (duplicate.rows.length) {
    throw new ConflictError('Category name already exists');
  }

  const result = await db.query(
    `INSERT INTO categories (name, description, parent_id, image_url, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description, parent_id || null, image_url || null, is_active]
  );
  return result.rows[0];
}

async function updateCategory(categoryId, data) {
  const existing = await db.query(
    'SELECT id FROM categories WHERE id = $1 AND deleted_at IS NULL',
    [categoryId]
  );
  if (!existing.rows.length) {
    throw new NotFoundError('Category not found');
  }

  const fields = [];
  const params = [];

  const updatable = ['name', 'description', 'parent_id', 'image_url', 'is_active'];
  updatable.forEach((key) => {
    if (data[key] !== undefined) {
      params.push(data[key]);
      fields.push(`${key} = $${params.length}`);
    }
  });

  if (!fields.length) {
    return getCategory(categoryId);
  }

  params.push(categoryId);
  const result = await db.query(
    `UPDATE categories SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${params.length} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return result.rows[0];
}

async function deleteCategory(categoryId) {
  const result = await db.query(
    'UPDATE categories SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
    [categoryId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Category not found');
  }
}

// ─── Brands ──────────────────────────────────────────────────────────────────

async function listBrands() {
  const result = await db.query(
    'SELECT * FROM brands WHERE deleted_at IS NULL ORDER BY name ASC'
  );
  return result.rows;
}

async function getBrand(brandId) {
  const result = await db.query(
    'SELECT * FROM brands WHERE id = $1 AND deleted_at IS NULL',
    [brandId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Brand not found');
  }
  return result.rows[0];
}

async function createBrand(data) {
  const { name, description, image_url, is_active = true } = data;

  const duplicate = await db.query(
    'SELECT id FROM brands WHERE name = $1 AND deleted_at IS NULL',
    [name]
  );
  if (duplicate.rows.length) {
    throw new ConflictError('Brand name already exists');
  }

  const result = await db.query(
    `INSERT INTO brands (name, description, image_url, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, image_url || null, is_active]
  );
  return result.rows[0];
}

async function updateBrand(brandId, data) {
  const existing = await db.query(
    'SELECT id FROM brands WHERE id = $1 AND deleted_at IS NULL',
    [brandId]
  );
  if (!existing.rows.length) {
    throw new NotFoundError('Brand not found');
  }

  const fields = [];
  const params = [];

  const updatable = ['name', 'description', 'image_url', 'is_active'];
  updatable.forEach((key) => {
    if (data[key] !== undefined) {
      params.push(data[key]);
      fields.push(`${key} = $${params.length}`);
    }
  });

  if (!fields.length) {
    return getBrand(brandId);
  }

  params.push(brandId);
  const result = await db.query(
    `UPDATE brands SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${params.length} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return result.rows[0];
}

async function deleteBrand(brandId) {
  const result = await db.query(
    'UPDATE brands SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
    [brandId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Brand not found');
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductImages,
  addProductImage,
  deleteProductImage,
  listSkus,
  getSku,
  createSku,
  updateSku,
  deleteSku,
  listCategories,
  getCategory,
  listProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  listBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
