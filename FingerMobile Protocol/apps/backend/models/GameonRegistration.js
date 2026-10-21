const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const GameonRegistration = sequelize.define('GameonRegistration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'event_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  status: {
    type: DataTypes.ENUM('registered', 'attended', 'cancelled'),
    defaultValue: 'registered'
  },
  registeredAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'registered_at'
  }
}, {
  tableName: 'gameon_registrations',
  timestamps: false,
  underscored: true
});

module.exports = GameonRegistration;
