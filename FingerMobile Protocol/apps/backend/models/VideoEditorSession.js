const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const VideoEditorSession = sequelize.define('VideoEditorSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true },
  userId: {
    type: DataTypes.UUID,
    allowNull: false },
  projectId: {
    type: DataTypes.STRING(100),
    allowNull: false },
  projectName: {
    type: DataTypes.STRING(200),
    allowNull: false },
  status: {
    type: DataTypes.ENUM('active', 'saved', 'exported', 'deleted'),
    allowNull: false,
    defaultValue: 'active' },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true },
  resolution: {
    type: DataTypes.STRING(20),
    allowNull: true },
  format: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'mp4' },
  timeline: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {} },
  assets: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [] },
  effects: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [] },
  lastSavedAt: {
    type: DataTypes.DATE,
    allowNull: true },
  exportedUrl: {
    type: DataTypes.STRING(500),
    allowNull: true }
}, {
  tableName: 'video_editor_sessions',
  timestamps: true,
  indexes: [{
    fields: ['userId'] }, {
    fields: ['status'] }, {
    fields: ['projectId'] }] });

module.exports = VideoEditorSession;
