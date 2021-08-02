const Pool = require('pg-pool');

const pool = new Pool({
  port: 5432,
  ssl: false,
  max: 5
})

module.exports = pool;
