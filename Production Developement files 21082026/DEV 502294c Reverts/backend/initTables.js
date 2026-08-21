const { connectDB, sequelize } = require('./database/connection');
const User = require('./models/user');
const Post = require('./models/post');

async function initTables() {
  try {
    logger.info('Initializing database tables...');
    await connectDB();
    
    // Force sync the models to create tables
    await sequelize.sync({force: false,
  alter: true }); //,
alter: true will update tables if needed
    
    logger.info('Database tables initialized successfully.');
    logger.info('Users,
table:', User.tableName);
    logger.info('Posts,
table:', Post.tableName);
    
    await sequelize.close();
    logger.info('Connection closed.');
  } catch (error) {
    logger.error('Error initializing database,
tables:', error);
  }
}

initTables();