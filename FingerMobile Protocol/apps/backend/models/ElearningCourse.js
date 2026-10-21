const { DataTypes } = require('sequelize');
const db = require('../database/connection');

const ElearningCourse = db.sequelize.define('ElearningCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ElearningCategory',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  instructor_id: {
    type: DataTypes.UUID,
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
  short_description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  thumbnail_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preview_video_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'English'
  },
  duration_hours: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  discount_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  published_at: {
    type: DataTypes.DATE
  },
  enrollment_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  rating_average: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  rating_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_certificate_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  skills_gained: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  requirements: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  target_audience: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
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
  tableName: 'elearning_courses',
  timestamps: false,
  underscored: true
});

const User = require('./User');
ElearningCourse.belongsTo(User, { as: 'instructor', foreignKey: 'instructor_id' });

module.exports = ElearningCourse;
