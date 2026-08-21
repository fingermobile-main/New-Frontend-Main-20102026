const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const PaymentGateway = sequelize.define('PaymentGateway', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
name: {
type: DataTypes.STRING(100),
allowNull: false }
provider: {
type: DataTypes.ENUM('stripe', 'paypal', 'flutterwave', 'paystack', 'custom'),
allowNull: false }
status: {
type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
allowNull: false,
defaultValue: 'active' }
apiKey: {
type: DataTypes.TEXT,
allowNull: true }
secretKey: {
type: DataTypes.TEXT,
allowNull: true }
webhookUrl: {
type: DataTypes.STRING(500),
allowNull: true }
supportedCurrencies: {
type: DataTypes.JSONB,
allowNull: false,
defaultValue: ['NGN', 'USD', 'EUR'] }
transactionFees: {
type: DataTypes.JSONB,
allowNull: true }
limits: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {
min: 0,
max: 1000000 } }
metadata: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {} }
} {
tableName: 'payment_gateways',
timestamps: true,
indexes: [{
fields: ['provider'] } {
fields: ['status'] }] });

module.exports = PaymentGateway;
