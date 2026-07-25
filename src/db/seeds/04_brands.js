'use strict';

/**
 * Seed sample brands.
 */
exports.seed = async function (knex) {
  await knex('brands').del();

  await knex('brands').insert([
    {
      id: '20000000-0000-0000-0000-000000000001',
      name: 'TechNova',
      slug: 'technova',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      name: 'StyleCraft',
      slug: 'stylecraft',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      name: 'HomeEssentials',
      slug: 'homeessentials',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '20000000-0000-0000-0000-000000000004',
      name: 'ApexMobile',
      slug: 'apexmobile',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '20000000-0000-0000-0000-000000000005',
      name: 'ComputeX',
      slug: 'computex',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
