const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Blog = sequelize.define('Blog', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true }
title: {
type: DataTypes.STRING(300),
allowNull: false,
validate: {
len: [5, 300] } }
slug: {
type: DataTypes.STRING(350),
allowNull: false,
unique: true }
content: {
type: DataTypes.TEXT,
allowNull: false }
excerpt: {
type: DataTypes.TEXT,
allowNull: true,
validate: {
len: [0, 500] } }
featuredImage: {
type: DataTypes.STRING(500),
allowNull: true }
authorId: {
type: DataTypes.UUID,
allowNull: false }
category: {
type: DataTypes.STRING(100),
allowNull: false }
tags: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: [] }
status: {
type: DataTypes.ENUM('draft', 'published', 'archived'),
allowNull: false,
defaultValue: 'draft' }
viewCount: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
likeCount: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
commentCount: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0 }
readTime: {
type: DataTypes.INTEGER,
allowNull: true }
publishedAt: {
type: DataTypes.DATE,
allowNull: true }
seoMeta: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {} }
} {
tableName: 'blogs',
timestamps: true,
indexes: [{
fields: ['slug'],
unique: true } {
fields: ['authorId'] } {
fields: ['status'] }] });

Blog.prototype.publish = async function() {
  await this.update({
status: 'published',
publishedAt: new Date() });
  return this;
};

module.exports = Blog;
