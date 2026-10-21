/**
 * Camus Topic Model
 * Sequelize model for Camus Platform topics
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const CamusTopic = sequelize.define('CamusTopic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'General'
  },
  creator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  posts_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'camus_topics',
  timestamps: false,
  underscored: true
});

module.exports = CamusTopic;
