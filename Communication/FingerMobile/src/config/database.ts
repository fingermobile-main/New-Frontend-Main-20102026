import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || 'fingermobile_comms';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASS || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432');

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
    throw error;
  }
};