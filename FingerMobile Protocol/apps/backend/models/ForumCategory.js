const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const ForumCategory = sequelize.define('ForumCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: '#FFFFFF'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  rules: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  moderationState: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'active',
    field: 'moderation_state'
  },
  accessType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'free',
    field: 'access_type'
  },
  allowedRoles: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: [],
    field: 'allowed_roles'
  },
  subscriptionTierRequired: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'subscription_tier_required'
  },
  styleColor: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '#2563EB',
    field: 'style_color'
  },
  headerImageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'header_image_url'
  },
  coverImageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'cover_image_url'
  },
  isFrozen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_frozen'
  },
  isCommentingPaused: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_commenting_paused'
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_suspended'
  }
}, {
  tableName: 'forum_categories',
  timestamps: true,
  underscored: true
});

module.exports = ForumCategory;
