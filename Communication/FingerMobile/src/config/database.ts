import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || 'fingermobile_comms';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASS || process.env.DB_PASSWORD || 'password';
const dbHost = process.env.DB_HOST && process.env.DB_HOST !== 'fingermobile-postgres' ? process.env.DB_HOST : '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '5433');

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database.');
    
    // Uncomment the following line if you want to sync models automatically
    // await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.warn("Continuing without DB in dev mode");
  }
};