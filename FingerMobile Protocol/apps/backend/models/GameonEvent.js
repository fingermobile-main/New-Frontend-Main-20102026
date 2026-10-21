const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const GameonEvent = sequelize.define('GameonEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  organizerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'organizer_id'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'end_date'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'max_participants'
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  coverImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'cover_image'
  }
}, {
  tableName: 'gameon_events',
  timestamps: true,
  underscored: true
});

module.exports = GameonEvent;
