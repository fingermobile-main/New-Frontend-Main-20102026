const { DataTypes, Model } = require('sequelize');
const { identityDb } = require('../db'); // Use the identity database

class Forum extends Model {}

// Deferred initialization - will be called when sequelize is ready
const initializeForum = () => {
  Forum.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize: identityDb, // Use the identityDb connection
    modelName: 'Forum',
    tableName: 'forums',
    timestamps: true
  });
};

module.exports = {
  Forum,
  initializeForum
};
