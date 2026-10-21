const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

/**
 * ExchangeRate model
 * Tracks FIC <-> fiat currency exchange rates with expiry support.
 */
const ExchangeRate = sequelize.define('ExchangeRate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  baseCurrency: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'USD',
    field: 'base_currency'
  },
  targetCurrency: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'FIC',
    field: 'target_currency'
  },
  rate: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false
  },
  rateExpiry: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'rate_expiry'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'fics_exchange_rates',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['target_currency'] },
    { fields: ['rate_expiry'] },
    { fields: ['base_currency', 'target_currency'] }
  ]
});

module.exports = ExchangeRate;
