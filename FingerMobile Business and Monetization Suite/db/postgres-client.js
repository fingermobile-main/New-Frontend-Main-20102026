"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPool = void 0;
exports.query = query;
exports.queryOne = queryOne;
exports.closePool = closePool;
const pg_1 = require("pg");
const { Pool } = pg_1.default;
/**
 * PostgreSQL Database Client
 * Connects to fingermobile_monetization_db
 */
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fingermobile_monetization_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// Test connection on startup
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});
pool.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err);
});
exports.postgresPool = pool;
/**
 * Helper function to execute queries with proper error handling
 */
async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    }
    catch (error) {
        console.error('Query execution error:', { text, error });
        throw error;
    }
}
/**
 * Helper function to get a single row
 */
async function queryOne(text, params) {
    const result = await query(text, params);
    return result.rows[0] || null;
}
/**
 * Graceful shutdown
 */
async function closePool() {
    await pool.end();
    console.log('PostgreSQL pool closed');
}
