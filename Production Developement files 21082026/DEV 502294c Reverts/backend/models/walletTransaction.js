const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const WalletTransaction = sequelize.define('WalletTransaction', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
userId: {
type: DataTypes.UUID,
allowNull: false }
type: {
type: DataTypes.ENUM('credit', 'debit'),
allowNull: false }
amount: {
type: DataTypes.DECIMAL(12, 2),
allowNull: false }
currency: {
type: DataTypes.STRING(3),
allowNull: false,
defaultValue: 'NGN' }
category: {
type: DataTypes.ENUM('deposit', 'withdrawal', 'purchase', 'refund', 'reward', 'transfer'),
allowNull: false }
status: {
type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
allowNull: false,
defaultValue: 'pending' }
description: {
type: DataTypes.TEXT,
allowNull: true }
reference: {
type: DataTypes.STRING(100),
allowNull: true,
unique: true }
balanceBefore: {
type: DataTypes.DECIMAL(12, 2),
allowNull: false }
balanceAfter: {
type: DataTypes.DECIMAL(12, 2),
allowNull: false }
metadata: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {} }
} {
tableName: 'wallet_transactions',
timestamps: true,
indexes: [{
fields: ['userId'] } {
fields: ['type'] } {
fields: ['status'] } {
fields: ['category'] }] });

module.exports = WalletTransaction;
