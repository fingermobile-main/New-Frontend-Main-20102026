const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const SEADSInitiative = sequelize.define('SEADSInitiative', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false },
  description: {
    type: DataTypes.TEXT,
    allowNull: false },
  category: {
    type: DataTypes.ENUM('reforestation', 'renewable_energy', 'carbon_capture', 'ocean_conservation', 'wildlife_protection'),
    allowNull: false },
  targetCarbonOffset: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0 } },
  currentCarbonOffset: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0 },
  fundingGoal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false },
  currentFunding: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0 },
  status: {
    type: DataTypes.ENUM('planning', 'active', 'completed', 'paused'),
    allowNull: false,
    defaultValue: 'planning' },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true },
  location: {
    type: DataTypes.JSONB,
    allowNull: true },
  impactMetrics: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {} },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false }
}, {
  tableName: 'seads_initiatives',
  timestamps: true,
  indexes: [{
    fields: ['category'] }, {
    fields: ['status'] }] });

module.exports = SEADSInitiative;
