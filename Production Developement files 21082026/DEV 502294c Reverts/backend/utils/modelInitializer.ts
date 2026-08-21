import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Global sequelize instance (set by database/connection.ts)
let sequelizeInstance: Sequelize | null = null;

// Set the sequelize instance (called after connection is established)
export const setSequelize = (sequelize: Sequelize) => {
  sequelizeInstance = sequelize;
};

// Get the sequelize instance (throws error if not set)
export const getSequelize = (): Sequelize => {
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance not initialized. Call setSequelize() first.');
  }
  return sequelizeInstance;
};

// Helper function to initialize models with proper timing
export interface ModelInitConfig {
  modelName: string;
  tableName?: string;
  attributes: any;
  options?: any;
}

export const initializeModel = (config: ModelInitConfig): typeof Model => {
  const sequelize = getSequelize();
  
  class BaseModel extends Model {}
  
  BaseModel.init(config.attributes, {
    sequelize,
    modelName: config.modelName,
    tableName: config.tableName || config.modelName.toLowerCase() + 's',
    timestamps: true,
    ...config.options
  });
  
  return BaseModel;
};
