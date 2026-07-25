/**
 * Migration: 002_create_users
 * Creates the users table with bcrypt password_hash column.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 128).nullable();
    table.string('last_name', 128).nullable();
    table.string('phone', 32).nullable();
    table.boolean('is_guest').notNullable().defaultTo(false);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.string('reset_password_token', 255).nullable();
    table.timestamp('reset_password_expires').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('users');
};
