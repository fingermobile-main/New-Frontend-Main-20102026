const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const TrendingCache = sequelize.define('TrendingCache', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'content_type'
  },
  contentId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'content_id'
  },
  score: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  calculatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'calculated_at'
  }
}, {
  tableName: 'trending_cache',
  timestamps: false,
  underscored: true
});

module.exports = TrendingCache;
