const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const BlockMute = sequelize.define('BlockMute', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  blockerId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  blockedUserId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  blockType: {
    type: DataTypes.ENUM('block', 'mute'),
    allowNull: false,
    defaultValue: 'block'
  },
  muteType: {
    type: DataTypes.ENUM('notification', 'ugc', 'all'),
    allowNull: true
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'block_mutes',
  timestamps: true
});

module.exports = { BlockMute };
