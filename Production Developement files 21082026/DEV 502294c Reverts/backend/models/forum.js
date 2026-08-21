const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Forum = sequelize.define('Forum', {
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
postCount: {
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
} {
tableName: 'forums',
timestamps: true });

const Topic = sequelize.define('Topic', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
title: {
type: DataTypes.STRING(300),
allowNull: false,
validate: {
len: [5, 300] } }
content: {
type: DataTypes.TEXT,
allowNull: false }
forumId: {
type: DataTypes.UUID,
allowNull: false }
authorId: {
type: DataTypes.UUID,
allowNull: false }
viewCount: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
replyCount: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
isPinned: {
type: DataTypes.BOOLEAN,
allowNull: false,
defaultValue: false }
status: {
type: DataTypes.ENUM('active', 'closed', 'deleted'),
allowNull: false,
defaultValue: 'active' }
tags: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: [] }
} {
tableName: 'topics',
timestamps: true });

Forum.hasMany(Topic, {
foreignKey: 'forumId',
as: 'topics' });
Topic.belongsTo(Forum, {
foreignKey: 'forumId' });

module.exports = { Forum, Topic };
