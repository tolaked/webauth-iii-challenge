exports.up = function(knex) {
  return knex.schema.createTable("users", users => {
    users.increments();

    users.string("username", 28).notNullable();
    users.string("password", 28).notNullable();
    users.string("department", 28).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
