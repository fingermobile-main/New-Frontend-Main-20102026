const { DataTypes, Model } = require('sequelize');
const { identityDb } = require('../db'); // Use the identity database

class Group extends Model {}

// Deferred initialization - will be called when sequelize is ready
const initializeGroup = () => {
  Group.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
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
    is_public: {
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
    },
    members_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    sequelize: identityDb, // Use the identityDb connection
    modelName: 'Group',
    tableName: 'groups',
    timestamps: true
  });
};

module.exports = {
  Group,
  initializeGroup
};
