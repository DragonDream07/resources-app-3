'use strict';

/**
 * Seed sample promo codes.
 *
 * discount_type values: 'percentage' | 'flat'
 * Prices/amounts are in the smallest currency unit (paise / cents).
 */
exports.seed = async function (knex) {
  await knex('promo_codes').del();

  await knex('promo_codes').insert([
    {
      id: '50000000-0000-0000-0000-000000000001',
      code: 'WELCOME10',
      description: '10% off for new customers',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_value: 50000,
      max_discount_amount: 20000,
      usage_limit: 1000,
      usage_count: 0,
      per_user_limit: 1,
      is_active: true,
      starts_at: '2024-01-01T00:00:00.000Z',
      expires_at: '2025-12-31T23:59:59.000Z',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '50000000-0000-0000-0000-000000000002',
      code: 'FLAT200',
      description: 'Flat ₹200 off on orders above ₹999',
      discount_type: 'flat',
      discount_value: 20000,
      min_order_value: 99900,
      max_discount_amount: null,
      usage_limit: 500,
      usage_count: 0,
      per_user_limit: 2,
      is_active: true,
      starts_at: '2024-01-01T00:00:00.000Z',
      expires_at: '2025-12-31T23:59:59.000Z',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '50000000-0000-0000-0000-000000000003',
      code: 'TECH15',
      description: '15% off on electronics',
      discount_type: 'percentage',
      discount_value: 15,
      min_order_value: 100000,
      max_discount_amount: 50000,
      usage_limit: 200,
      usage_count: 0,
      per_user_limit: 1,
      is_active: true,
      starts_at: '2024-01-01T00:00:00.000Z',
      expires_at: '2025-06-30T23:59:59.000Z',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '50000000-0000-0000-0000-000000000004',
      code: 'EXPIRED50',
      description: 'Expired flat ₹50 off — for testing purposes',
      discount_type: 'flat',
      discount_value: 5000,
      min_order_value: 0,
      max_discount_amount: null,
      usage_limit: 100,
      usage_count: 0,
      per_user_limit: 1,
      is_active: false,
      starts_at: '2023-01-01T00:00:00.000Z',
      expires_at: '2023-12-31T23:59:59.000Z',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
