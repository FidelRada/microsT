require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    // usar DB_PASSWORD (coincide con .env y docker-compose)
    password: process.env.DB_PASSWORD || "60910990",
    database: process.env.DB_NAME || "topicos_db",
    // por defecto en contenedores usar el servicio 'db'
    host: process.env.DB_HOST || "db",
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  }
};
