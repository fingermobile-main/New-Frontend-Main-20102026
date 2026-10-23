import { Sequelize } from 'sequelize';
import { setSequelize, getSequelize } from '../utils/modelInitializer';
import logger from '../utils/logger';

export { getSequelize };

logger.info('[database/connection] Module loading...');

// Database configuration
const dbName = process.env.DB_NAME || 'fingermobile_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'your_password';
const dbPort = parseInt(process.env.DB_PORT || '5432');

logger.info('[database/connection] Creating sequelize instance...');
// Create a new Sequelize instance
export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: process.env.DB_HOST || 'localhost',
  port: dbPort,
  dialect: 'postgres', // or 'mysql', 'sqlite', etc.,
  dialectOptions: {
    // Use environment variable for SSL in production
    ...(process.env.DB_SSL === 'true' && {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    })
  },
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.info(msg) : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '5'),
    min: parseInt(process.env.DB_POOL_MIN || '0'),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
    idle: parseInt(process.env.DB_POOL_IDLE || '10000')
  }
});

// Set the global sequelize instance for model initialization
setSequelize(sequelize);
logger.info('[database/connection] Sequelize instance created and registered:', !!sequelize);

// Initialize models and sync database (lazy loading to avoid circular dependency)
let initializeModels: (() => void) | null = null;
let syncDatabase: (() => Promise<void>) | null = null;

// Set initialization functions (called from index.ts after it's loaded)
export const setDBFunctions = (
  initFunc: () => void,
  syncFunc: () => Promise<void>) => {
  logger.info('[database/connection] setDBFunctions called');
  initializeModels = initFunc;
  syncDatabase = syncFunc;
};

// Test the database connection
export const connectDB = async (): Promise<void> => {
  try {
    logger.info('[database/connection] Authenticating database connection...');
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // Initialize models after sequelize is ready
    if (initializeModels) {
      logger.info('[database/connection] Calling initializeModels...');
      initializeModels();
      logger.info('Database models initialized successfully.');
    } else {
      logger.error('[database/connection] ERROR: initializeModels is null!');
    }

    // Sync all models - only in development or when explicitly enabled
    if ((process.env.NODE_ENV !== 'production' || process.env.SYNC_DB === 'true') && syncDatabase) {
      await syncDatabase();
      logger.info('Database synchronized successfully.');
    }
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    logger.warn('[database/connection] ⚠️ Continuing without database connection (development mode)');
    // Don't throw error - allow server to start in development mode without database
    // throw error;
  }
};

logger.info('[database/connection] Module loaded successfully');
export default connectDB;
