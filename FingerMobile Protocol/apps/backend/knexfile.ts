import knex from 'knex';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config: any = {
client: 'postgresql',
connection: {
host: process.env.DB_HOST || 'localhost',
port: parseInt(process.env.DB_PORT || '5432'),
user: process.env.DB_USER || 'postgres',
password: process.env.DB_PASSWORD || 'your_password',
database: process.env.DB_NAME || 'fingermobile_db',
    // SSL configuration for production
    ...(process.env.NODE_ENV === 'production' && {
ssl: {
rejectUnauthorized: false
      }
    })
  },
pool: {
min: parseInt(process.env.DB_POOL_MIN || '2'),
max: parseInt(process.env.DB_POOL_MAX || '10')
  },
migrations: {
directory: './database/migrations',
tableName: 'knex_migrations',
extension: 'js'
  },
seeds: {
directory: './database/seeds'
  },
debug: process.env.NODE_ENV === 'development'
};

export default config;
