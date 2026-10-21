const { DataTypes } = require('sequelize');
const db = require('../database/connection');

const FingerWarsGame = db.sequelize.define('FingerWarsGame', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'FingerWarsGameCategory',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  developer_id: {
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
  banner_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trailer_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  release_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  published_at: {
    type: DataTypes.DATE
  },
  player_count_min: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  player_count_max: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: 1
    }
  },
  age_rating: {
    type: DataTypes.ENUM('Everyone', 'Teen', 'Mature', 'Adult'),
    allowNull: false,
    defaultValue: 'Everyone'
  },
  genre_tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  average_rating: {
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
  total_plays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_multiplayer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_free_to_play: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  tableName: 'fingerwars_games',
  timestamps: false,
  underscored: true
});

module.exports = FingerWarsGame;
