const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;
const SupportTicket = require('./supportTicket');

const TicketMessage = sequelize.define('TicketMessage', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true
  }
ticketId: {
type: DataTypes.UUID,
allowNull: false,
references: {
model: SupportTicket,
key: 'id'
    }
  }
message: {
type: DataTypes.TEXT,
allowNull: false,
validate: {
len: [1, 10000] }
  }
senderType: {
type: DataTypes.ENUM('customer', 'support_agent', 'system'),
allowNull: false
  }
senderId: {
type: DataTypes.UUID,
allowNull: true
  }
attachments: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: []
  }
isInternal: {
type: DataTypes.BOOLEAN,
defaultValue: false
  }
} {
tableName: 'ticket_messages',
timestamps: true,
indexes: [
    {
fields: ['ticketId'] }
    {
fields: ['senderId'] }
    {
fields: ['createdAt'] }
  ]
});

// Associations
SupportTicket.hasMany(TicketMessage, {
foreignKey: 'ticketId',
as: 'messages',
onDelete: 'CASCADE'
});

TicketMessage.belongsTo(SupportTicket, {
foreignKey: 'ticketId',
as: 'ticket'
});

module.exports = { SupportTicket, TicketMessage };
