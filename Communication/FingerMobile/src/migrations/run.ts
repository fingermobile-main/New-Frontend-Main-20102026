import { sequelize } from '../config/database';
import createCommunicationsTable from './001-create-communications-table';

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    // Sync the database (this will create tables based on models)
    await sequelize.sync({ alter: true });
    
    console.log('Migrations completed successfully!');
    
    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();