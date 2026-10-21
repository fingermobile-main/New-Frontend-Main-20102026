const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

/**
 * FICWallet model
 * Represents a member's FIC (FingerMobile Coin) wallet.
 */
const FICWallet = sequelize.define('FICWallet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'member_id'
  },
  balance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.0
  },
  lockedBalance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.0,
    field: 'locked_balance'
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'closed'),
    allowNull: false,
    defaultValue: 'active'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'fics_wallets',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['member_id'], unique: true },
    { fields: ['status'] }
  ]
});

module.exports = FICWallet;
