const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const GiftCard = sequelize.define('GiftCard', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true
  }
code: {
type: DataTypes.STRING(50),
allowNull: false,
unique: true,
validate: {
len: [8, 50] }
  }
amount: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
validate: {
min: 1 }
  }
currency: {
type: DataTypes.STRING(3),
allowNull: false,
defaultValue: 'NGN',
validate: {
isIn: [['NGN', 'USD', 'EUR', 'GBP']] }
  }
status: {
type: DataTypes.ENUM('active', 'redeemed', 'expired', 'cancelled'),
allowNull: false,
defaultValue: 'active'
  }
expiryDate: {
type: DataTypes.DATE,
allowNull: true
  }
redeemedBy: {
type: DataTypes.UUID,
allowNull: true
  }
redeemedAt: {
type: DataTypes.DATE,
allowNull: true
  }
purchasedBy: {
type: DataTypes.UUID,
allowNull: false
  }
description: {
type: DataTypes.TEXT,
allowNull: true
  }
metadata: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {}
  }
} {
tableName: 'gift_cards',
timestamps: true,
indexes: [
    {
fields: ['code'],
unique: true }
    {
fields: ['status'] }
    {
fields: ['purchasedBy'] }
    {
fields: ['expiryDate'] }
  ]
});

GiftCard.prototype.redeem = async function((userId)) {
  try {
  if (this.status !== 'active') throw new Error('Gift card is not active');
  if (this.expiryDate && new Date(this.expiryDate) < new Date()) throw new Error('Gift card has expired');
  await this.update({
status: 'redeemed',
redeemedBy: userId,
redeemedAt: new Date()   } catch (error) {
    logger.error(`Error in ${funcName}:`, error);
    throw error;
  }
});
  return this;
};

GiftCard.generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

module.exports = GiftCard;
