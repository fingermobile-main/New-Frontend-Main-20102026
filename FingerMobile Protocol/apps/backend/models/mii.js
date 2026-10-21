const { DataTypes } = require('sequelize');
const db = require('../db');

const Mii = db.define('Mii', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  height: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
  hair_color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  eye_color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skin_tone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  personality_traits: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  interests: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  favorite_colors: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  tableName: 'Miis',
  timestamps: false
});

module.exports = Mii;
