const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const ForumThread = sequelize.define('ForumThread', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(300),
    allowNull: false,
    validate: {
      len: [5, 300]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'category_id'
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  replyCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isSticky: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'deleted'),
    allowNull: false,
    defaultValue: 'active'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  activityType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'activity_type',
    comment: 'Feeling/Activity tag, e.g. "😊 Happy", "🎵 Listening to music"'
  }
}, {
  tableName: 'forum_threads',
  timestamps: true,
  underscored: true
});

const User = require('./User');
const ForumCategory = require('./ForumCategory');

// Associations
ForumThread.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
ForumThread.belongsTo(ForumCategory, { as: 'category', foreignKey: 'categoryId' });
ForumCategory.hasMany(ForumThread, { as: 'threads', foreignKey: 'categoryId' });

module.exports = ForumThread;