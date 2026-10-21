const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

/**
 * FICTransaction model
 * Tracks all FIC coin transactions (deposits, withdrawals, exchanges, subscriptions, etc.)
 */
const FICTransaction = sequelize.define('FICTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  walletId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'wallet_id'
  },
  amount: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false
  },
  transactionType: {
    type: DataTypes.ENUM(
      'deposit', 'withdrawal', 'transfer_in', 'transfer_out',
      'exchange_in', 'exchange_out', 'reward', 'gift', 'paylink',
      'subscription_payment', 'subscription_upgrade', 'subscription_renewal'
    ),
    allowNull: false,
    field: 'transaction_type'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fromAccount: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'from_account'
  },
  toAccount: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'to_account'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'fics_transactions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['wallet_id'] },
    { fields: ['transaction_type'] },
    { fields: ['status'] },
    { fields: ['created_at'] }
  ]
});

module.exports = FICTransaction;
