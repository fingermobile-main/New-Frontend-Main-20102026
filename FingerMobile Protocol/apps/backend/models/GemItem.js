const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const GemItem = sequelize.define('GemItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'gems',
  timestamps: false,
  underscored: true
});

module.exports = GemItem;
