// Message model for the application
// Represents messages exchanged between users in the system
// Updated on 2025-05-13

const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

/**
 * Define the Message model
 * @type {Sequelize.Model}
 */
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,  // Changed from UUID to INTEGER to match actual DB
    autoIncrement: true,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'conversation_id'  // Maps to actual DB column
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sender_id'  // Maps to actual DB column
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'receiver_id'  // Maps to actual DB column
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.STRING(20),
    defaultValue: 'text',
    field: 'message_type'  // Maps to actual DB column
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read'  // Maps to actual DB column
  },
  isDeletedBySender: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_deleted_by_sender'  // Maps to actual DB column
  },
  isDeletedByReceiver: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_deleted_by_receiver'  // Maps to actual DB column
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'sent_at'  // Maps to actual DB column
  },
  readAt: {
    type: DataTypes.DATE,
    field: 'read_at'  // Maps to actual DB column
  }
}, {
  tableName: 'messages',
  timestamps: false, // The table doesn't have createdAt/updatedAt columns
  underscored: true  // Sequelize will map camelCase to snake_case automatically
});

/**
 * Define associations for the Message model
 * @param {Object} models - All Sequelize models
 */
Message.associate = (models) => {
  Message.belongsTo(models.User, {
    foreignKey: 'senderId',
    as: 'sender'
  });

  Message.belongsTo(models.User, {
    foreignKey: 'receiverId',
    as: 'receiver'
  });

  // Add association to Conversation if the model exists
  if (models.Conversation) {
    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation'
    });
  }
};

module.exports = { Message };
