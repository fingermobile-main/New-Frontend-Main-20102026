/**
 * Database configuration module
 * Re-exports the sequelize instance from database/connection
 * for use by TypeScript model files that import from '../config/database'
 */
import { sequelize, connectDB, setDBFunctions } from '../database/connection';

export { sequelize, connectDB, setDBFunctions };
export default connectDB;
