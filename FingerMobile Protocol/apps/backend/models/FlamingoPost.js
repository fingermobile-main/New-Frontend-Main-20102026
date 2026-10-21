const { DataTypes } = require('sequelize');
const db = require('../database/connection');

const FlamingoPost = db.sequelize.define('FlamingoPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'FlamingoCategory',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  post_type: {
    type: DataTypes.ENUM('text', 'image', 'video', 'carousel', 'link', 'product', 'story'),
    allowNull: false,
    defaultValue: 'text'
  },
  content_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content_urls: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  is_sponsored: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  sponsored_details: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  view_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  like_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  comment_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  share_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  save_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  engagement_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'flamingo_posts',
  timestamps: false,
  underscored: true
});

module.exports = FlamingoPost;
