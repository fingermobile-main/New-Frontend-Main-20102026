const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const logger = require('../utils/logger');
const sequelize = connection.sequelize;

let AISubscription;

if (sequelize) {
  try {
    AISubscription = sequelize.define('AISubscription', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tier: {
        type: DataTypes.ENUM('free', 'starter', 'plus', 'creator', 'pro', 'enterprise'),
        allowNull: false,
        defaultValue: 'free'
      },
      status: {
        type: DataTypes.ENUM('active', 'cancelled', 'expired', 'paused'),
        defaultValue: 'active'
      },
      creditsRemaining: {
        type: DataTypes.INTEGER,
        defaultValue: 20
      },
      creditsTotal: {
        type: DataTypes.INTEGER,
        defaultValue: 20
      },
      monthlyPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'NGN'
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      autoRenew: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'ai_subscriptions',
      timestamps: true
    });
  } catch (err) {
    if (logger && typeof logger.warn === 'function') {
      logger.warn('AISubscription define warning:', err.message);
    }
  }
}

module.exports = AISubscription || {};
module.exports.default = AISubscription || {};
