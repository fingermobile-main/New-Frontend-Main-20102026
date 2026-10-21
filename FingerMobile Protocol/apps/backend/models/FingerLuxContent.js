const { DataTypes } = require('sequelize');
const db = require('../database/connection');

const FingerLuxContent = db.sequelize.define('FingerLuxContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'FingerLuxCategory',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  creator_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content_type: {
    type: DataTypes.ENUM('video', 'image', 'audio', 'document', 'exclusive_article', 'experience'),
    allowNull: false
  },
  content_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  thumbnail_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration_seconds: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  file_size_mb: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  access_level: {
    type: DataTypes.ENUM('premium', 'vip', 'exclusive', 'limited_edition'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
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
  download_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  published_at: {
    type: DataTypes.DATE
  },
  is_exclusive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  exclusive_until: {
    type: DataTypes.DATE
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
  tableName: 'fingerlux_contents',
  timestamps: false,
  underscored: true
});

module.exports = FingerLuxContent;
