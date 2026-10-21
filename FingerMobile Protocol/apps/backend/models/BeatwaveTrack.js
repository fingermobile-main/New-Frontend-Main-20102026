const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // assuming db exports sequelize instance

module.exports = sequelize.define('beatwave_tracks', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  artist: { type: DataTypes.STRING, allowNull: false },
  album: DataTypes.STRING,
  genre: DataTypes.STRING,
  duration_seconds: DataTypes.INTEGER,
  audio_url: { type: DataTypes.TEXT, allowNull: false },
  cover_url: DataTypes.TEXT,
  bitrate: DataTypes.INTEGER,
  plays_count: { type: DataTypes.BIGINT, defaultValue: 0 },
  likes_count: { type: DataTypes.BIGINT, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'beatwave_tracks',
});
