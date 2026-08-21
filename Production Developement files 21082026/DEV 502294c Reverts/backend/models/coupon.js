const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Coupon = sequelize.define('Coupon', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
code: {
type: DataTypes.STRING(50),
allowNull: false,
unique: true,
validate: {
len: [4, 50] } }
discountType: {
type: DataTypes.ENUM('percentage', 'fixed'),
allowNull: false }
discountValue: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
validate: {
min: 0 } }
minPurchaseAmount: {
type: DataTypes.DECIMAL(10, 2),
allowNull: true,
defaultValue: 0 }
maxDiscountAmount: {
type: DataTypes.DECIMAL(10, 2),
allowNull: true }
usageLimit: {
type: DataTypes.INTEGER,
allowNull: true,
validate: {
min: 1 } }
usedCount: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
status: {
type: DataTypes.ENUM('active', 'inactive', 'expired'),
allowNull: false,
defaultValue: 'active' }
startDate: {
type: DataTypes.DATE,
allowNull: false }
endDate: {
type: DataTypes.DATE,
allowNull: false }
applicableProducts: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: [] }
description: {
type: DataTypes.TEXT,
allowNull: true }
} {
tableName: 'coupons',
timestamps: true,
indexes: [{
fields: ['code'],
unique: true } {
fields: ['status'] }] });

Coupon.prototype.isValid = function() {
  const now = new Date();
  return this.status === 'active' && now >= new Date(this.startDate) && now <= new Date(this.endDate) && (!this.usageLimit || this.usedCount < this.usageLimit);
};

module.exports = Coupon;
