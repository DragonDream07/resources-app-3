'use strict';

/**
 * Seed sample category tree.
 *
 * Tree structure:
 *   Electronics
 *     ├── Mobile Phones
 *     └── Laptops
 *   Fashion
 *     ├── Men
 *     └── Women
 *   Home & Kitchen
 */
exports.seed = async function (knex) {
  await knex('categories').del();

  await knex('categories').insert([
    // Root categories
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'Electronics',
      slug: 'electronics',
      parent_id: null,
      image_url: null,
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'Fashion',
      slug: 'fashion',
      parent_id: null,
      image_url: null,
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      parent_id: null,
      image_url: null,
      is_active: true,
      sort_order: 3,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // Electronics children
    {
      id: '10000000-0000-0000-0000-000000000011',
      name: 'Mobile Phones',
      slug: 'mobile-phones',
      parent_id: '10000000-0000-0000-0000-000000000001',
      image_url: null,
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '10000000-0000-0000-0000-000000000012',
      name: 'Laptops',
      slug: 'laptops',
      parent_id: '10000000-0000-0000-0000-000000000001',
      image_url: null,
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // Fashion children
    {
      id: '10000000-0000-0000-0000-000000000021',
      name: 'Men',
      slug: 'men',
      parent_id: '10000000-0000-0000-0000-000000000002',
      image_url: null,
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '10000000-0000-0000-0000-000000000022',
      name: 'Women',
      slug: 'women',
      parent_id: '10000000-0000-0000-0000-000000000002',
      image_url: null,
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
