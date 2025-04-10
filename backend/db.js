// backend/db.js
const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'db', // Docker service name
  database: 'blogdb',
  password: 'password',
  port: 5432,
});

module.exports = pool;