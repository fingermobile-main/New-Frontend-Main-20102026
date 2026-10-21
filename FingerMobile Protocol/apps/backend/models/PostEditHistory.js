const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const PostEditHistory = sequelize.define('PostEditHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'post_id'
  },
  editorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'editor_id'
  },
  oldContent: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'old_content'
  },
  newContent: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'new_content'
  }
}, {
  tableName: 'post_edit_history',
  timestamps: true,
  underscored: true
});

// Associations with circular dependency protection
try {
  const ForumPost = require('./ForumPost');
  const User = require('./User');

  if (ForumPost && typeof ForumPost.belongsTo === 'function') {
    PostEditHistory.belongsTo(ForumPost, { as: 'post', foreignKey: 'postId' });
  }
  if (User && typeof User.belongsTo === 'function') {
    PostEditHistory.belongsTo(User, { as: 'editor', foreignKey: 'editorId' });
  }
} catch (_assocErr) {
  // Guard against circular dependency during module evaluation
}

module.exports = PostEditHistory;
