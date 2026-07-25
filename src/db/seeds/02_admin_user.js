'use strict';

const bcrypt = require('bcrypt');

/**
 * Seed default admin user for development.
 * Email: admin@example.com
 * Password: Admin@1234
 */
exports.seed = async function (knex) {
  const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000010';
  const ADMIN_ROLE_ID = '00000000-0000-0000-0000-000000000003';

  const passwordHash = await bcrypt.hash('Admin@1234', 12);

  // Remove existing admin user
  await knex('user_roles').where({ user_id: ADMIN_USER_ID }).del();
  await knex('users').where({ id: ADMIN_USER_ID }).del();

  await knex('users').insert([
    {
      id: ADMIN_USER_ID,
      name: 'Super Admin',
      email: 'admin@example.com',
      password_hash: passwordHash,
      phone: null,
      is_guest: false,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  await knex('user_roles').insert([
    {
      id: '00000000-0000-0000-0000-000000000020',
      user_id: ADMIN_USER_ID,
      role_id: ADMIN_ROLE_ID,
      created_at: knex.fn.now(),
    },
  ]);
};
