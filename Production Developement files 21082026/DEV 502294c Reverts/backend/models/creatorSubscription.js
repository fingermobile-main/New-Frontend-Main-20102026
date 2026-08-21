const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const CreatorSubscription = sequelize.define('CreatorSubscription', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
subscriberId: {
type: DataTypes.UUID,
allowNull: false }
creatorId: {
type: DataTypes.UUID,
allowNull: false }
tier: {
type: DataTypes.ENUM('basic', 'premium', 'vip'),
allowNull: false,
defaultValue: 'basic' }
price: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false }
currency: {
type: DataTypes.STRING(3),
allowNull: false,
defaultValue: 'NGN' }
status: {
type: DataTypes.ENUM('active', 'cancelled', 'expired'),
allowNull: false,
defaultValue: 'active' }
startDate: {
type: DataTypes.DATE,
allowNull: false }
endDate: {
type: DataTypes.DATE,
allowNull: false }
autoRenew: {
type: DataTypes.BOOLEAN,
allowNull: false,
defaultValue: true }
benefits: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: [] }
} {
tableName: 'creator_subscriptions',
timestamps: true,
indexes: [{
fields: ['subscriberId'] } {
fields: ['creatorId'] } {
fields: ['status'] }] });

module.exports = CreatorSubscription;
