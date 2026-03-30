exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      table.string('password_hash').notNullable();
      table.string('full_name');
      table.enu('role', ['customer', 'admin']).defaultTo('customer');
      table.timestamps(true, true);
    })
    .createTable('products', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.string('image_url');
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock').defaultTo(0);
      table.boolean('is_available').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('orders', table => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
      table.enu('status', ['placed', 'paid', 'shipped', 'delivered', 'canceled']).defaultTo('placed');
      table.decimal('total', 10, 2).defaultTo(0);
      table.jsonb('shipping_address');
      table.timestamps(true, true);
    })
    .createTable('order_items', table => {
      table.increments('id').primary();
      table.integer('order_id').references('id').inTable('orders').onDelete('CASCADE');
      table.integer('product_id').references('id').inTable('products').onDelete('RESTRICT');
      table.integer('quantity').notNullable();
      table.decimal('unit_price', 10, 2).notNullable();
    })
    .createTable('admin_audit_log', table => {
      table.increments('id').primary();
      table.integer('admin_user_id').references('id').inTable('users').onDelete('SET NULL');
      table.string('action').notNullable();
      table.string('target_type').notNullable();
      table.integer('target_id');
      table.jsonb('metadata');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('admin_audit_log')
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('products')
    .dropTableIfExists('users');
};