/**
 * Migration: 014_create_orders
 * Creates the orders table with FK to users (nullable) and addresses.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.string('order_number', 64).notNullable().unique();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .integer('address_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('addresses')
      .onDelete('RESTRICT');
    table.string('status', 64).notNullable().defaultTo('pending');
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('discount_amount', 12, 2).notNullable().defaultTo(0);
    table.decimal('shipping_charge', 12, 2).notNullable().defaultTo(0);
    table.decimal('total', 12, 2).notNullable();
    table.string('currency', 8).notNullable().defaultTo('INR');
    table
      .integer('promo_code_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('promo_codes')
      .onDelete('SET NULL');
    table.text('notes').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('orders');
};
