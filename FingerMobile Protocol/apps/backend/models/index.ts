import fs from 'fs';
import path from 'path';
import { setDBFunctions, sequelize } from '../database/connection';
import logger from '../utils/logger';


// Collection to hold all models
const models: Record<string, any> = {};

// Initialize models by dynamically loading all model files
export const initModels = () => {
  const PlatformLogoModel = require("./PlatformLogoModel");
  if(PlatformLogoModel.initializePlatformLogo) PlatformLogoModel.initializePlatformLogo();
  models.PlatformLogo = PlatformLogoModel.default;
  logger.info('[models/index] Initializing models...');
  try {
    if (!sequelize) {
      logger.warn('Sequelize not initialized yet in initModels');
      return;
    }

    // Read all files in the models directory
    const modelFiles = fs.readdirSync(__dirname).filter(file => {
      return (file.indexOf('.') !== 0) && (file !== 'index.ts') && (file !== 'index.js') && (file.slice(-3) === '.js' || file.slice(-3) === '.ts');
    });

    // Import and register each model
    for (const file of modelFiles) {
      const filePath = path.join(__dirname, file);
      // Skip the index file and only load model files
      if (file !== 'index.ts' && file !== 'index.js') {
        try {
          const modelModule = require(filePath);
          // Look for a default export or named exports that might be models
          // Automatically call any initialization functions exported by the module
          for (const key in modelModule) {
            if (key.startsWith('initialize') && typeof modelModule[key] === 'function') {
              modelModule[key]();
            }
          }
          
          if (modelModule.default) {
            // If there's a default export, use it as the model
            const model = modelModule.default;
            if (model && typeof model === 'function' && model.prototype instanceof require('sequelize').Model) {
              models[model.name] = model;
            }
          }
          
          // Check for named exports that might be models
          for (const key in modelModule) {
            if (key !== 'default' && 
                !key.startsWith('initialize') && 
                modelModule[key] && 
                typeof modelModule[key] === 'function' && 
                modelModule[key].prototype instanceof require('sequelize').Model) {
              models[key] = modelModule[key];
            }
          }
        } catch (err) {
          logger.warn(`Could not load model from ${file}:`, err);
        }
      }
    }

    // Set up associations after all models are loaded
    for (const modelName in models) {
      const model = models[modelName];
      if (model.associate) {
        model.associate(models);
      }
    }

    logger.info(`[models/index] Loaded ${Object.keys(models).length} models`);
  } catch (e) {
    logger.error('Error in initModels', e);
  }
};

// Synchronize all models with the database
export const syncModels = async () => {
  logger.info('[models/index] Syncing models...');
  try {
    if (sequelize) {
      // Initialize models first if not already done
      if (Object.keys(models).length === 0) {
        initModels();
      }
      
      // Sync all models
      await Promise.all(
        Object.values(models).map(model => {
          if (model && typeof model.sync === 'function') {
            return model.sync();
          }
          return Promise.resolve();
        })
      );
      
      logger.info('[models/index] All models synced successfully.');
    }
  } catch (e) {
    logger.error('Error in syncModels', e);
  }
};

setDBFunctions(initModels, syncModels);

export default models;