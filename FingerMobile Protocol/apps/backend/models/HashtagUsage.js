const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const HashtagUsage = sequelize.define('HashtagUsage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  hashtag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id'
  },
  contentId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'content_id'
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'content_type'
  }
}, {
  tableName: 'hashtag_usage',
  timestamps: true,
  underscored: true
});

module.exports = HashtagUsage;
