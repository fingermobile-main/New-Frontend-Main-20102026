const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Advertisement = sequelize.define('Advertisement', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
title: {
type: DataTypes.STRING(200),
allowNull: false }
description: {
type: DataTypes.TEXT,
allowNull: true }
type: {
type: DataTypes.ENUM('banner', 'video', 'native', 'interstitial', 'rewarded'),
allowNull: false }
placement: {
type: DataTypes.STRING(100),
allowNull: false }
imageUrl: {
type: DataTypes.STRING(500),
allowNull: true }
videoUrl: {
type: DataTypes.STRING(500),
allowNull: true }
targetUrl: {
type: DataTypes.STRING(500),
allowNull: false }
status: {
type: DataTypes.ENUM('draft', 'active', 'paused', 'expired'),
allowNull: false,
defaultValue: 'draft' }
budget: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false }
spent: {
type: DataTypes.DECIMAL(10, 2),
allowNull: false,
defaultValue: 0 }
impressions: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
clicks: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
targeting: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {} }
startDate: {
type: DataTypes.DATE,
allowNull: true }
endDate: {
type: DataTypes.DATE,
allowNull: true }
createdBy: {
type: DataTypes.UUID,
allowNull: false }
} {
tableName: 'advertisements',
timestamps: true,
indexes: [{
fields: ['type'] } {
fields: ['status'] } {
fields: ['placement'] }] });

module.exports = Advertisement;
