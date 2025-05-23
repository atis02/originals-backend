const { Sequelize } = require("sequelize");
const { DB_NAME, DB_PASS, DB_USER, DB_HOST, DB_PORT } = require("./config");

module.exports = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASS,

  {
    dialect: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    // logging: true,
  }
);
