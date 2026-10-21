/* eslint-disable no-unused-vars */
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env'), quiet: true });
require('dotenv').config({ quiet: true });
const logger = require('./utils/logger');

// Common connection settings
const dbUser = process.env.DB_USER || 'postgres';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPassword = process.env.DB_PASSWORD || undefined;
const dbPort = parseInt(process.env.DB_PORT || '5433', 10);
const defaultDbName = process.env.DB_NAME || 'fingermobile_platform_db';
const maxPoolSize = parseInt(process.env.DB_POOL_MAX || '10', 10);

// Primary platform database pool
const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: defaultDbName,
  password: dbPassword,
  port: dbPort,
  max: maxPoolSize,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// Domain Database Names mapping to docker-compose 15 platform PostgreSQL databases
const DOMAIN_DATABASES = {
  content: process.env.CONTENT_DB_NAME || process.env.DB_NAME_CONTENT || 'fingermobile_content_db',
  identity: process.env.IDENTITY_DB_NAME || process.env.DB_NAME_IDENTITY || 'fingermobile_identity_db',
  social: process.env.SOCIAL_DB_NAME || process.env.DB_NAME_SOCIAL || 'fingermobile_social_db',
  monetization: process.env.MONETIZATION_DB_NAME || process.env.DB_NAME_MONETIZATION || 'fingermobile_monetization_db',
  financial: process.env.FINANCIAL_DB_NAME || process.env.DB_NAME_FINANCIAL || 'fingermobile_monetization_db',
  commerce: process.env.COMMERCE_DB_NAME || process.env.DB_NAME_COMMERCE || 'fingermobile_business_db',
  gaming: process.env.GAMING_DB_NAME || process.env.DB_NAME_GAMING || 'fingermobile_gaming_db',
  learning: process.env.LEARNING_DB_NAME || process.env.DB_NAME_LEARNING || 'fingermobile_learning_db',
  governance: process.env.GOVERNANCE_DB_NAME || process.env.DB_NAME_GOVERNANCE || 'governance_db',
  security: process.env.SECURITY_DB_NAME || process.env.DB_NAME_SECURITY || 'guardian_db',
  communication: process.env.COMMUNICATION_DB_NAME || process.env.DB_NAME_COMMS || 'fingermobile_comms',
  prompts: process.env.PROMPTS_DB_NAME || 'prompts_db',
  sentient: process.env.SENTIENT_DB_NAME || 'sentient_db',
  meishe: process.env.MEISHE_DB_NAME || 'meishe_db',
  nexusgnn: process.env.NEXUSGNN_DB_NAME || 'nexusgnn_db',
  seshat: process.env.SESHAT_DB_NAME || 'seshat_db'
};

const domainPools = new Map();

/**
 * Creates a domain-specific PostgreSQL pool with graceful fallback to the primary pool
 * if the domain database is not separately provisioned.
 */
function getOrCreateDomainPool(domainKey) {
  if (domainPools.has(domainKey)) {
    return domainPools.get(domainKey);
  }

  const targetDbName = DOMAIN_DATABASES[domainKey] || defaultDbName;

  // If target database name is the default one, reuse the main pool
  if (targetDbName === defaultDbName) {
    domainPools.set(domainKey, pool);
    return pool;
  }

  const domainPool = new Pool({
    user: process.env[`${domainKey.toUpperCase()}_DB_USER`] || dbUser,
    host: process.env[`${domainKey.toUpperCase()}_DB_HOST`] || dbHost,
    database: targetDbName,
    password: process.env[`${domainKey.toUpperCase()}_DB_PASSWORD`] || dbPassword,
    port: parseInt(process.env[`${domainKey.toUpperCase()}_DB_PORT`] || String(dbPort), 10),
    max: maxPoolSize,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  });

  // Create resilient wrapper
  const resilientProxy = {
    pool: domainPool,
    targetDb: targetDbName,
    query: async (text, params) => {
      try {
        return await domainPool.query(text, params);
      } catch (err) {
        // If domain database does not exist (PostgreSQL error 3D000), fallback to primary pool
        if (err.code === '3D000' || err.message?.includes('does not exist')) {
          if (logger && logger.warn) {
            logger.warn(`Domain DB "${targetDbName}" not found; falling back to primary pool: ${err.message}`);
          }
          return await pool.query(text, params);
        }
        throw err;
      }
    },
    connect: async () => {
      try {
        return await domainPool.connect();
      } catch (err) {
        if (err.code === '3D000' || err.message?.includes('does not exist')) {
          return await pool.connect();
        }
        throw err;
      }
    }
  };

  domainPools.set(domainKey, resilientProxy);
  return resilientProxy;
}

// Instantiate domain database proxies
const contentDb = getOrCreateDomainPool('content');
const identityDb = getOrCreateDomainPool('identity');
const socialDb = getOrCreateDomainPool('social');
const monetizationDb = getOrCreateDomainPool('monetization');
const financialDb = getOrCreateDomainPool('financial');
const commerceDb = getOrCreateDomainPool('commerce');
const gamingDb = getOrCreateDomainPool('gaming');
const learningDb = getOrCreateDomainPool('learning');
const governanceDb = getOrCreateDomainPool('governance');
const securityDb = getOrCreateDomainPool('security');
const communicationDb = getOrCreateDomainPool('communication');
const promptsDb = getOrCreateDomainPool('prompts');
const sentientDb = getOrCreateDomainPool('sentient');
const meisheDb = getOrCreateDomainPool('meishe');
const nexusgnnDb = getOrCreateDomainPool('nexusgnn');
const seshatDb = getOrCreateDomainPool('seshat');

// Schema bootstrap: verify and apply table migrations
async function bootstrapConsoleSchemas() {
  const migrationPath = path.resolve(__dirname, 'migrations', '20261021_consoles_persistence_and_screens_micromanagement.sql');
  if (!fs.existsSync(migrationPath)) return;

  try {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    // Execute on primary pool
    await pool.query(sql);
    if (logger && logger.info) {
      logger.info('✅ Consoles persistence & screens micromanagement database schema verified successfully.');
    }
  } catch (err) {
    if (logger && logger.warn) {
      logger.warn('Schema bootstrap verification note:', err.message);
    }
  }
}

// Test primary database connection & bootstrap tables
setImmediate(() => {
  pool.query('SELECT NOW()', async (err, res) => {
    if (err) {
      if (logger && typeof logger.error === 'function') logger.error('Database connection error:', err.message);
      else console.error('Database connection error:', err.message);
    } else {
      if (logger && typeof logger.info === 'function') logger.info('Primary platform database connected successfully!');
      else console.log('Primary platform database connected successfully!');
      await bootstrapConsoleSchemas();
    }
  });
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
  contentDb,
  commerceDb,
  identityDb,
  socialDb,
  financialDb,
  monetizationDb,
  gamingDb,
  learningDb,
  governanceDb,
  securityDb,
  communicationDb,
  commsDb: communicationDb,
  promptsDb,
  sentientDb,
  meisheDb,
  nexusgnnDb,
  seshatDb,
  bootstrapConsoleSchemas
};
