const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const ForumPost = sequelize.define('ForumPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  threadId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parentId: {
    type: DataTypes.UUID, // For nested replies
    allowNull: true
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  editReason: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  isReported: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reportReason: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'edited', 'deleted', 'reported'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'forum_posts',
  timestamps: true,
  underscored: true
});

const User = require('./User');
const ForumThread = require('./ForumThread');
ForumPost.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
ForumPost.belongsTo(ForumThread, { as: 'thread', foreignKey: 'threadId' });

module.exports = ForumPost;
