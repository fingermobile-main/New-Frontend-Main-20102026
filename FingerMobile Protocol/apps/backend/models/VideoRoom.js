const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const VideoRoom = sequelize.define('VideoRoom', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  hostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'host_id'
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('video', 'audio'),
    allowNull: false,
    defaultValue: 'video'
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    field: 'max_participants'
  },
  status: {
    type: DataTypes.ENUM('active', 'ended', 'cancelled'),
    allowNull: false,
    defaultValue: 'active'
  },
  participantCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'participant_count'
  },
  endedAt: {
    type: DataTypes.DATE,
    field: 'ended_at'
  }
}, {
  tableName: 'video_rooms',
  timestamps: true,
  underscored: true
});

// Associations
const User = require('./User');
VideoRoom.belongsTo(User, { as: 'host', foreignKey: 'hostId' });

module.exports = VideoRoom;
