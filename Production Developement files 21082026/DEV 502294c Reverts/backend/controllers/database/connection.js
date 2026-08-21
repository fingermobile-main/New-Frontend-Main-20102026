"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.setDBFunctions = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const logger = require('../../utils/logger');
const modelInitializer_1 = require("../utils/modelInitializer");
logger.info('[database/connection] Module loading...');
// Database configuration
const dbName = process.env.DB_NAME || 'fingermobile_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'your_password';
const dbPort = parseInt(process.env.DB_PORT || '5432');
logger.info('[database/connection] Creating sequelize instance...');
// Create a new Sequelize instance
exports.sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: process.env.DB_HOST || 'localhost',
    port: dbPort, dialect: 'postgres', // or 'mysql', 'sqlite', etc.
    dialectOptions: {
        // Use environment variable for SSL in production
        ...(process.env.NODE_ENV === 'production' && {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        })
    }, logging: process.env.NODE_ENV === 'development' ? console.log : false, pool: {
        max: parseInt(process.env.DB_POOL_MAX || '5'), min: parseInt(process.env.DB_POOL_MIN || '0'), acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'), idle: parseInt(process.env.DB_POOL_IDLE || '10000')
    } });
// Set the global sequelize instance for model initialization
(0, modelInitializer_1.setSequelize)(exports.sequelize);
logger.info('[database/connection] Sequelize instance created and registered:', !!exports.sequelize);
// Initialize models and sync database (lazy loading to avoid circular dependency)
let initializeModels = null;
let syncDatabase = null;
// Set initialization functions (called from index.ts after it's loaded)
const setDBFunctions = (initFunc, syncFunc) => {
    logger.info('[database/connection] setDBFunctions called');
    initializeModels = initFunc;
    syncDatabase = syncFunc;
};
exports.setDBFunctions = setDBFunctions;
// Test the database connection
const connectDB = async () => {
    try {
        logger.info('[database/connection] Authenticating database connection...');
        await exports.sequelize.authenticate();
        logger.info('Database connection has been established successfully.');
        // Initialize models after sequelize is ready
        if (initializeModels) {
            logger.info('[database/connection] Calling initializeModels...');
            initializeModels();
            logger.info('Database models initialized successfully.');
        }
        else {
            logger.error('[database/connection] ERROR: initializeModels is null!');
        }
        // Sync all models - only in development or when explicitly enabled
        if ((process.env.NODE_ENV !== 'production' || process.env.SYNC_DB === 'true') && syncDatabase) {
            await syncDatabase();
            logger.info('Database synchronized successfully.');
        }
    }
    catch (error) {
        logger.error('Unable to connect to the database:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
logger.info('[database/connection] Module loaded successfully');
exports.default = exports.connectDB;
