const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const P2PMatch = sequelize.define('P2PMatch', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
requesterId: {
type: DataTypes.UUID,
allowNull: false }
matcherId: {
type: DataTypes.UUID,
allowNull: true }
gameType: {
type: DataTypes.STRING(100),
allowNull: false }
stake: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
defaultValue: 0 }
currency: {
type: DataTypes.STRING(3),
allowNull: false,
defaultValue: 'NGN' }
status: {
type: DataTypes.ENUM('waiting', 'matched', 'in_progress', 'completed', 'cancelled'),
allowNull: false,
defaultValue: 'waiting' }
winnerId: {
type: DataTypes.UUID,
allowNull: true }
startTime: {
type: DataTypes.DATE,
allowNull: true }
endTime: {
type: DataTypes.DATE,
allowNull: true }
rules: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {} }
result: {
type: DataTypes.JSONB,
allowNull: true }
} {
tableName: 'p2p_matches',
timestamps: true,
indexes: [{
fields: ['requesterId'] } {
fields: ['matcherId'] } {
fields: ['status'] } {
fields: ['gameType'] }] });

module.exports = P2PMatch;
