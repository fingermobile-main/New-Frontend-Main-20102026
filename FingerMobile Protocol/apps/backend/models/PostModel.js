const { DataTypes, Model } = require('sequelize');
const { identityDb } = require('../db'); // Use the identity database

class Post extends Model {}

// Deferred initialization - will be called when sequelize is ready
const initializePost = () => {
  Post.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    forum_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forums',
        key: 'id'
      }
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    replies_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    shares_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize: identityDb, // Use the identityDb connection
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true
  });
};

module.exports = {
  Post,
  initializePost
};
