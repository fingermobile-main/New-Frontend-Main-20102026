/* eslint-disable no-unused-vars */
const { DataTypes, Op, Transaction } = require('sequelize');
const crypto = require('crypto');
const connection = require('../database/connection');

const sequelize = connection.sequelize;

const GiftCard = sequelize.define('GiftCard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [8, 50]
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 1
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'NGN',
    validate: {
      isIn: [['NGN', 'USD', 'EUR', 'GBP']]
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'redeemed', 'expired', 'cancelled'),
    allowNull: false,
    defaultValue: 'active'
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expiry_date'
  },
  redeemedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'redeemed_by'
  },
  redeemedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'redeemed_at'
  },
  purchasedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'purchased_by'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'gift_cards',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['code'] },
    { fields: ['status'] },
    { fields: ['purchased_by'] },
    { fields: ['expiry_date'] }
  ]
});

/**
 * Atomically redeems a gift card inside a managed transaction.
 * @param {string} userId - UUID of user redeeming the card
 * @param {Transaction} [existingTransaction] - Optional active transaction
 */
GiftCard.prototype.redeem = async function (userId, existingTransaction = null) {
  const executeRedemption = async (transaction) => {
    // Re-query with an UPDATE row lock to block concurrent redemption attempts
    const card = await GiftCard.findByPk(this.id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!card) {
      throw new Error('Gift card not found');
    }

    if (card.status !== 'active') {
      throw new Error(`Gift card cannot be redeemed (Status: ${card.status})`);
    }

    if (card.expiryDate && new Date(card.expiryDate) < new Date()) {
      await card.update({ status: 'expired' }, { transaction });
      throw new Error('Gift card has expired');
    }

    return await card.update({
      status: 'redeemed',
      redeemedBy: userId,
      redeemedAt: new Date()
    }, { transaction });
  };

  if (existingTransaction) {
    return await executeRedemption(existingTransaction);
  }

  return await sequelize.transaction(async (t) => {
    return await executeRedemption(t);
  });
};

/**
 * Generates a cryptographically secure, unguessable gift card code.
 * @param {number} [length=16] - Code length
 * @returns {string} Formatted code (e.g., GC-XXXX-XXXX-XXXX)
 */
GiftCard.generateCode = (length = 16) => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes ambiguous characters (0, O, 1, I)
  const bytes = crypto.randomBytes(length);
  let code = '';

  for (let i = 0; i < length; i++) {
    code += chars[bytes[i] % chars.length];
  }

  return code;
};

module.exports = GiftCard;
