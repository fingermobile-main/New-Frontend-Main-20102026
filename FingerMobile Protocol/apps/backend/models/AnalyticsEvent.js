const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const AnalyticsEvent = sequelize.define('AnalyticsEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true },
  userId: {
    type: DataTypes.UUID,
    allowNull: true },
  eventType: {
    type: DataTypes.STRING(100),
    allowNull: false },
  category: {
    type: DataTypes.ENUM('page_view', 'user_action', 'conversion', 'error', 'performance'),
    allowNull: false },
  eventName: {
    type: DataTypes.STRING(200),
    allowNull: false },
  properties: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {} },
  sessionId: {
    type: DataTypes.STRING(100),
    allowNull: true },
  deviceInfo: {
    type: DataTypes.JSONB,
    allowNull: true },
  location: {
    type: DataTypes.JSONB,
    allowNull: true },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW }
}, {
  tableName: 'analytics_events',
  timestamps: true,
  indexes: [{
    fields: ['userId'] }, {
    fields: ['eventType'] }, {
    fields: ['category'] }, {
    fields: ['timestamp'] }] });

module.exports = AnalyticsEvent;
