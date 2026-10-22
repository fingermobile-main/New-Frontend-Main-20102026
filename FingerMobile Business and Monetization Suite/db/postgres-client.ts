import pkg from 'pg';
const Pool = (pkg as any).Pool || (pkg as any).default?.Pool || pkg;

/**
 * PostgreSQL Database Client
 * Connects to fingermobile_monetization_db
 */

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'fingermobile_business_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
  console.error('❌ PostgreSQL connection error:', err);
});

export const postgresPool = pool;

/**
 * Helper function to execute queries with proper error handling
 */
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query execution error:', { text, error });
    throw error;
  }
}

/**
 * Helper function to get a single row
 */
export async function queryOne(text: string, params?: unknown[]) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Graceful shutdown
 */
export async function closePool() {
  await pool.end();
  console.log('PostgreSQL pool closed');
}
