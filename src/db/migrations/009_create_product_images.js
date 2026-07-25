/**
 * Migration: 009_create_product_images
 * Creates the product_images table with FK to products.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('product_images', (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    table.string('url', 512).notNullable();
    table.string('alt_text', 255).nullable();
    table.integer('position').notNullable().defaultTo(0);
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('product_images');
};
