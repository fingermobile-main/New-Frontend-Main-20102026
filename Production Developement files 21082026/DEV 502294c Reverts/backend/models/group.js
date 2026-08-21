const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Group = sequelize.define('Group', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
name: {
type: DataTypes.STRING(200),
allowNull: false }
description: {
type: DataTypes.TEXT,
allowNull: true }
category: {
type: DataTypes.STRING(100),
allowNull: false }
isPrivate: {
type: DataTypes.BOOLEAN,
allowNull: false,
defaultValue: false }
memberCount: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
createdBy: {
type: DataTypes.UUID,
allowNull: false }
status: {
type: DataTypes.ENUM('active', 'archived', 'deleted'),
allowNull: false,
defaultValue: 'active' }
rules: {
type: DataTypes.TEXT,
allowNull: true }
coverImage: {
type: DataTypes.STRING(500),
allowNull: true }
metadata: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {} }
} {
tableName: 'groups',
timestamps: true,
indexes: [{
fields: ['category'] } {
fields: ['status'] } {
fields: ['createdBy'] }] });

module.exports = Group;
