/**
 * Migration: 008_create_products
 * Creates the products table with FK to categories and brands.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('description').nullable();
    table
      .integer('category_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL');
    table
      .integer('brand_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('brands')
      .onDelete('SET NULL');
    table.decimal('base_price', 12, 2).notNullable();
    table.decimal('selling_price', 12, 2).notNullable();
    table.string('currency', 8).notNullable().defaultTo('INR');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.jsonb('attributes').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('products');
};
