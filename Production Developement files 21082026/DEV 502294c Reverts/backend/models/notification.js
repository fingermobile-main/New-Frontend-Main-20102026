const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Notification = sequelize.define('Notification', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
userId: {
type: DataTypes.UUID,
allowNull: false }
type: {
type: DataTypes.ENUM('message', 'like', 'comment', 'follow', 'mention', 'system', 'payment'),
allowNull: false }
title: {
type: DataTypes.STRING(200),
allowNull: false }
message: {
type: DataTypes.TEXT,
allowNull: false }
isRead: {
type: DataTypes.BOOLEAN,
allowNull: false,
defaultValue: false }
priority: {
type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
allowNull: false,
defaultValue: 'medium' }
actionUrl: {
type: DataTypes.STRING(500),
allowNull: true }
senderId: {
type: DataTypes.UUID,
allowNull: true }
relatedEntityId: {
type: DataTypes.UUID,
allowNull: true }
relatedEntityType: {
type: DataTypes.STRING(50),
allowNull: true }
metadata: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {} }
} {
tableName: 'notifications',
timestamps: true,
indexes: [{
fields: ['userId'] } {
fields: ['isRead'] } {
fields: ['type'] }] });

module.exports = Notification;
