const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

/**
 * FICSubscription model
 * Tracks FIC Platform subscription records per member.
 */
const FICSubscription = sequelize.define('FICSubscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'member_id'
  },
  subscriptionType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'FIC_Platform',
    field: 'subscription_type'
  },
  subscriptionLevel: {
    type: DataTypes.ENUM('basic', 'premium', 'enterprise'),
    allowNull: false,
    defaultValue: 'basic',
    field: 'subscription_level'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'end_date'
  },
  featuresAccess: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: [],
    field: 'features_access'
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'auto_renew'
  },
  paymentMethodId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'payment_method_id'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'fm_fic_subscriptions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['member_id'] },
    { fields: ['subscription_level'] },
    { fields: ['is_active'] },
    { fields: ['end_date'] }
  ]
});

module.exports = FICSubscription;
