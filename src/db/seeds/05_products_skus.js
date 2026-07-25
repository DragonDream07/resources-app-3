'use strict';

/**
 * Seed sample products and SKU variants.
 */
exports.seed = async function (knex) {
  await knex('skus').del();
  await knex('product_images').del();
  await knex('products').del();

  // ------------------------------------------------------------------ products
  await knex('products').insert([
    {
      id: '30000000-0000-0000-0000-000000000001',
      name: 'ApexMobile X1',
      slug: 'apexmobile-x1',
      description: 'A flagship smartphone with a stunning display and long battery life.',
      category_id: '10000000-0000-0000-0000-000000000011',
      brand_id: '20000000-0000-0000-0000-000000000004',
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '30000000-0000-0000-0000-000000000002',
      name: 'ComputeX Laptop Pro',
      slug: 'computex-laptop-pro',
      description: 'A high-performance laptop built for professionals.',
      category_id: '10000000-0000-0000-0000-000000000012',
      brand_id: '20000000-0000-0000-0000-000000000005',
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '30000000-0000-0000-0000-000000000003',
      name: 'StyleCraft Men Casual Shirt',
      slug: 'stylecraft-men-casual-shirt',
      description: 'Comfortable cotton casual shirt for everyday wear.',
      category_id: '10000000-0000-0000-0000-000000000021',
      brand_id: '20000000-0000-0000-0000-000000000002',
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '30000000-0000-0000-0000-000000000004',
      name: 'HomeEssentials Non-Stick Pan',
      slug: 'homeessentials-non-stick-pan',
      description: 'Durable non-stick frying pan suitable for all stovetops.',
      category_id: '10000000-0000-0000-0000-000000000003',
      brand_id: '20000000-0000-0000-0000-000000000003',
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '30000000-0000-0000-0000-000000000005',
      name: 'TechNova Wireless Earbuds',
      slug: 'technova-wireless-earbuds',
      description: 'True wireless earbuds with active noise cancellation.',
      category_id: '10000000-0000-0000-0000-000000000001',
      brand_id: '20000000-0000-0000-0000-000000000001',
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // ----------------------------------------------------------------------- skus
  await knex('skus').insert([
    // ApexMobile X1 — storage variants
    {
      id: '40000000-0000-0000-0000-000000000001',
      product_id: '30000000-0000-0000-0000-000000000001',
      sku_code: 'APEX-X1-64',
      attributes: JSON.stringify({ storage: '64GB', color: 'Midnight Black' }),
      price: 29999,
      compare_at_price: 34999,
      stock_quantity: 100,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      product_id: '30000000-0000-0000-0000-000000000001',
      sku_code: 'APEX-X1-128',
      attributes: JSON.stringify({ storage: '128GB', color: 'Pearl White' }),
      price: 34999,
      compare_at_price: 39999,
      stock_quantity: 80,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // ComputeX Laptop Pro — RAM/storage variants
    {
      id: '40000000-0000-0000-0000-000000000003',
      product_id: '30000000-0000-0000-0000-000000000002',
      sku_code: 'CX-LP-8-256',
      attributes: JSON.stringify({ ram: '8GB', storage: '256GB SSD' }),
      price: 59999,
      compare_at_price: 69999,
      stock_quantity: 50,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000004',
      product_id: '30000000-0000-0000-0000-000000000002',
      sku_code: 'CX-LP-16-512',
      attributes: JSON.stringify({ ram: '16GB', storage: '512GB SSD' }),
      price: 79999,
      compare_at_price: 89999,
      stock_quantity: 30,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // StyleCraft Men Casual Shirt — size variants
    {
      id: '40000000-0000-0000-0000-000000000005',
      product_id: '30000000-0000-0000-0000-000000000003',
      sku_code: 'SC-MCS-S',
      attributes: JSON.stringify({ size: 'S', color: 'Blue' }),
      price: 999,
      compare_at_price: 1499,
      stock_quantity: 200,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000006',
      product_id: '30000000-0000-0000-0000-000000000003',
      sku_code: 'SC-MCS-M',
      attributes: JSON.stringify({ size: 'M', color: 'Blue' }),
      price: 999,
      compare_at_price: 1499,
      stock_quantity: 250,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000007',
      product_id: '30000000-0000-0000-0000-000000000003',
      sku_code: 'SC-MCS-L',
      attributes: JSON.stringify({ size: 'L', color: 'Blue' }),
      price: 999,
      compare_at_price: 1499,
      stock_quantity: 200,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000008',
      product_id: '30000000-0000-0000-0000-000000000003',
      sku_code: 'SC-MCS-XL',
      attributes: JSON.stringify({ size: 'XL', color: 'Blue' }),
      price: 999,
      compare_at_price: 1499,
      stock_quantity: 150,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // HomeEssentials Non-Stick Pan — single SKU
    {
      id: '40000000-0000-0000-0000-000000000009',
      product_id: '30000000-0000-0000-0000-000000000004',
      sku_code: 'HE-NSP-28',
      attributes: JSON.stringify({ size: '28cm' }),
      price: 1299,
      compare_at_price: 1799,
      stock_quantity: 120,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // TechNova Wireless Earbuds — color variants
    {
      id: '40000000-0000-0000-0000-000000000010',
      product_id: '30000000-0000-0000-0000-000000000005',
      sku_code: 'TN-WE-BLK',
      attributes: JSON.stringify({ color: 'Black' }),
      price: 4999,
      compare_at_price: 6999,
      stock_quantity: 75,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '40000000-0000-0000-0000-000000000011',
      product_id: '30000000-0000-0000-0000-000000000005',
      sku_code: 'TN-WE-WHT',
      attributes: JSON.stringify({ color: 'White' }),
      price: 4999,
      compare_at_price: 6999,
      stock_quantity: 60,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
