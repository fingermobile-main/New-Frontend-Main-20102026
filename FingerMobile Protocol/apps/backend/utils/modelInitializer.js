'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.initializeModel = exports.getSequelize = exports.setSequelize = void 0;
const sequelize_1 = require('sequelize');
// Global sequelize instance (set by database/connection.ts)
let sequelizeInstance = null;
// Set the sequelize instance (called after connection is established)
const setSequelize = (sequelize) => {
  sequelizeInstance = sequelize;
};
exports.setSequelize = setSequelize;
// Get the sequelize instance (throws error if not set)
const getSequelize = () => {
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance not initialized. Call setSequelize() first.');
  }
  return sequelizeInstance;
};
exports.getSequelize = getSequelize;
const initializeModel = (config) => {
  const sequelize = (0, exports.getSequelize)();
  class BaseModel extends sequelize_1.Model {
  }
  BaseModel.init(config.attributes, {
    sequelize,
    modelName: config.modelName,
    tableName: config.tableName || config.modelName.toLowerCase() + 's',
    timestamps: true,
    ...config.options
  });
  return BaseModel;
};
exports.initializeModel = initializeModel;
