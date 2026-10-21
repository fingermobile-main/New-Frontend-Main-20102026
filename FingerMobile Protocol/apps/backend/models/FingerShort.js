const { DataTypes } = require('sequelize');
const { getSequelize } = require('../utils/modelInitializer');
const sequelize = getSequelize();

const FingerShort = sequelize.define('FingerShort', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    field: 'video_url'
  },
  thumbnailUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'thumbnail_url'
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'author_id'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'view_count'
  },
  likeCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'like_count'
  },
  commentCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'comment_count'
  },
  shareCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'share_count'
  },
  status: {
    type: DataTypes.ENUM('processing', 'published', 'archived', 'deleted'),
    allowNull: false,
    defaultValue: 'processing'
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'finger_shorts',
  timestamps: true,
  underscored: true,
  indexes: [{
    fields: ['author_id']
  }, {
    fields: ['status']
  }]
});

module.exports = FingerShort;
