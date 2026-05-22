const oracledb = require('oracledb');
require('dotenv').config();

// Global config for oracledb
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

let pool;

async function initializePool() {
  try {
    pool = await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60
    });
    console.log('Oracle Database connection pool initialized successfully.');
    return pool;
  } catch (err) {
    console.error('Error initializing Oracle DB connection pool:', err);
    throw err;
  }
}

async function closePool() {
  try {
    if (pool) {
      await pool.close();
      console.log('Oracle Database connection pool closed.');
    }
  } catch (err) {
    console.error('Error closing Oracle DB connection pool:', err);
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Connection pool not initialized. Call initializePool first.');
  }
  return pool;
}

/**
 * Helper to execute a single query (auto-releases connection)
 */
async function execute(sql, binds = {}, options = {}) {
  let connection;
  try {
    connection = await getPool().getConnection();
    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.error(`Database Execution Error for SQL: ${sql}`, err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error closing connection:', closeErr);
      }
    }
  }
}

/**
 * Helper to execute multiple queries under a single transaction
 * @param {Function} callback - (connection) => Promise
 */
async function executeTransaction(callback) {
  let connection;
  try {
    connection = await getPool().getConnection();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error('Error rolling back transaction:', rollbackErr);
      }
    }
    console.error('Transaction rolled back due to error:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error closing transaction connection:', closeErr);
      }
    }
  }
}

module.exports = {
  initializePool,
  closePool,
  getPool,
  execute,
  executeTransaction
};
