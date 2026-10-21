const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING(20),
    defaultValue: 'direct',
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'conversations',
  timestamps: false, // Using custom field names
  underscored: true
});

Conversation.associate = (models) => {
  if (models.Message) {
    Conversation.hasMany(models.Message, {
      foreignKey: 'conversationId',
      as: 'messages'
    });
  }
};

module.exports = { Conversation };
