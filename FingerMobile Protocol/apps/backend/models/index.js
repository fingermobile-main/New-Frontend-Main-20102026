// Removed trailing spaces throughout the file
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Load database configuration
const config = require(__dirname + '/../config/config')[env];

// Initialize db object to store models
const db = {};

// Create sequelize instance
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read models directory and import all model files
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    try {
      const imported = require(path.join(__dirname, file));
      let model;
      if (typeof imported === 'function') {
        if (/^\s*class\s+/.test(imported.toString())) {
          model = imported;
        } else {
          model = imported(sequelize, Sequelize.DataTypes);
        }
      } else {
        model = imported;
      }
      if (model && model.name) {
        db[model.name] = model;
      }
    } catch (_err) {
      // Ignore models that initialize themselves
    }
  });

// Set up model associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (_err) {
      // Ignore missing cross-model associations
    }
  }
});

// Export db object containing all models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Add a helper function to sync individual models
db.syncModel = async (modelName) => {
  if (db[modelName] && typeof db[modelName].sync === 'function') {
    console.log('Syncing model:', modelName);
    return await db[modelName].sync();
  }
  console.log('Model not found or sync not available:', modelName);
  return null;
};

module.exports = db;
