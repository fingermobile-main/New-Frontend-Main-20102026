const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

/**
 * FICTransactionMonitoring model
 * Stores risk scores and fraud monitoring results for FIC transactions.
 */
const FICTransactionMonitoring = sequelize.define('FICTransactionMonitoring', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'transaction_id'
  },
  riskScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'risk_score'
  },
  suspiciousActivity: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'suspicious_activity'
  },
  monitoringNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'monitoring_notes'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'fics_transaction_monitoring',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['transaction_id'] },
    { fields: ['suspicious_activity'] },
    { fields: ['risk_score'] }
  ]
});

module.exports = FICTransactionMonitoring;
