const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Leaderboard = sequelize.define('Leaderboard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false },
  category: {
    type: DataTypes.ENUM('weekly', 'monthly', 'all_time', 'seasonal'),
    allowNull: false },
  metric: {
    type: DataTypes.STRING(100),
    allowNull: false },
  period: {
    type: DataTypes.JSONB,
    allowNull: true },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true },
  resetSchedule: {
    type: DataTypes.STRING(50),
    allowNull: true }
}, {
  tableName: 'leaderboards',
  timestamps: true });

const LeaderboardEntry = sequelize.define('LeaderboardEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true },
  leaderboardId: {
    type: DataTypes.UUID,
    allowNull: false },
  userId: {
    type: DataTypes.UUID,
    allowNull: false },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: false },
  score: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {} }
}, {
  tableName: 'leaderboard_entries',
  timestamps: true,
  indexes: [{
    fields: ['leaderboardId'] }, {
    fields: ['userId'] }, {
    fields: ['rank'] }] });

module.exports = { Leaderboard, LeaderboardEntry };
