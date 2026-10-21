const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const SavedPost = sequelize.define('SavedPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'post_id'
  }
}, {
  tableName: 'saved_posts',
  timestamps: true,
  underscored: true
});

// Associations will be defined here
const User = require('./User');
const ForumPost = require('./ForumPost');

SavedPost.belongsTo(User, { as: 'user', foreignKey: 'userId' });
SavedPost.belongsTo(ForumPost, { as: 'post', foreignKey: 'postId' });

module.exports = SavedPost;
