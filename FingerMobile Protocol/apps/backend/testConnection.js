const logger = require('./utils/logger');
const { connectDB, sequelize } = require('./database/connection');

async function testConnection() {
  try {
    logger.info('Testing database connection...');
    await connectDB();
    logger.info('Database connection successful!');

    // Test querying the Users table
    const User = require('./models/User');
    const userCount = await User.count();
    logger.info(`Users table exists and has ${userCount} records.`);

    await sequelize.close();
    logger.info('Connection closed.');
  } catch (error) {
    logger.error('Database connection failed:', error.message);
  }
}

testConnection();
