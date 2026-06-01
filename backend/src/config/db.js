const { Pool } = require('pg');
require('dotenv').config();

let pool;

async function initializePool() {
  try {
    const config = {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

    // If DATABASE_URL is not set, use separate config for local fallback
    if (!config.connectionString) {
      config.user = process.env.PGUSER || 'postgres';
      config.host = process.env.PGHOST || 'localhost';
      config.database = process.env.PGDATABASE || 'my_blog';
      config.password = process.env.PGPASSWORD || 'postgres';
      config.port = parseInt(process.env.PGPORT || '5432', 10);
    } else {
      // In production (Vercel/Render/Supabase), enable SSL rejectUnauthorized: false
      if (
        config.connectionString.includes('supabase') ||
        config.connectionString.includes('render') ||
        config.connectionString.includes('aiven') ||
        config.connectionString.includes('neon') ||
        process.env.NODE_ENV === 'production'
      ) {
        config.ssl = {
          rejectUnauthorized: false
        };
      }
    }

    pool = new Pool(config);

    // Test connection
    const client = await pool.connect();
    console.log('PostgreSQL Database connection pool initialized successfully.');
    client.release();
    return pool;
  } catch (err) {
    console.error('Error initializing PostgreSQL DB connection pool:', err);
    throw err;
  }
}

async function closePool() {
  try {
    if (pool) {
      await pool.end();
      console.log('PostgreSQL Database connection pool closed.');
    }
  } catch (err) {
    console.error('Error closing PostgreSQL DB connection pool:', err);
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
async function execute(sql, params = []) {
  try {
    const result = await getPool().query(sql, params);
    return result;
  } catch (err) {
    console.error(`Database Execution Error for SQL: ${sql}`, err);
    throw err;
  }
}

/**
 * Helper to execute multiple queries under a single transaction
 * @param {Function} callback - (connection) => Promise
 */
async function executeTransaction(callback) {
  const client = await getPool().connect();
  try {
    // Add compatibility method for repositories using transaction connection
    client.execute = function(sql, params = []) {
      return this.query(sql, params);
    };

    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction rolled back due to error:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  initializePool,
  closePool,
  getPool,
  execute,
  executeTransaction
};
