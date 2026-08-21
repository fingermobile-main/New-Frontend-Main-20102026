const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Message = sequelize.define('Message', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
conversationId: {
type: DataTypes.UUID,
allowNull: false }
senderId: {
type: DataTypes.UUID,
allowNull: false }
content: {
type: DataTypes.TEXT,
allowNull: false }
type: {
type: DataTypes.ENUM('text', 'image', 'video', 'file', 'system'),
allowNull: false,
defaultValue: 'text' }
status: {
type: DataTypes.ENUM('sent', 'delivered', 'read', 'deleted'),
allowNull: false,
defaultValue: 'sent' }
mediaUrl: {
type: DataTypes.STRING(500),
allowNull: true }
replyToId: {
type: DataTypes.UUID,
allowNull: true }
metadata: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {} }
} {
tableName: 'messages',
timestamps: true,
indexes: [{
fields: ['conversationId'] } {
fields: ['senderId'] } {
fields: ['status'] }] });

const Conversation = sequelize.define('Conversation', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
type: {
type: DataTypes.ENUM('direct', 'group'),
allowNull: false,
defaultValue: 'direct' }
name: {
type: DataTypes.STRING(200),
allowNull: true }
participants: {
type: DataTypes.JSONB,
allowNull: false,
defaultValue: [] }
lastMessageId: {
type: DataTypes.UUID,
allowNull: true }
unreadCount: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
} {
tableName: 'conversations',
timestamps: true });

Group.hasMany(Message, {
foreignKey: 'conversationId' });
Conversation.hasMany(Message, {
foreignKey: 'conversationId',
as: 'messages' });

module.exports = { Message, Conversation };
