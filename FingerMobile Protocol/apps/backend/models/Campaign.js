const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false },
  description: {
    type: DataTypes.TEXT,
    allowNull: true },
  type: {
    type: DataTypes.ENUM('email', 'push', 'in_app', 'sms', 'social'),
    allowNull: false },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'active', 'paused', 'completed'),
    allowNull: false,
    defaultValue: 'draft' },
  targetAudience: {
    type: DataTypes.JSONB,
    allowNull: true },
  content: {
    type: DataTypes.JSONB,
    allowNull: false },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true },
  spent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0 },
  metrics: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      impressions: 0,
      clicks: 0,
      conversions: 0 } },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false }
}, {
  tableName: 'campaigns',
  timestamps: true,
  indexes: [{
    fields: ['type'] }, {
    fields: ['status'] }, {
    fields: ['createdBy'] }] });

module.exports = Campaign;
