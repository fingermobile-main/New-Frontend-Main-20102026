const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const SupportTicket = sequelize.define('SupportTicket', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true
  }
ticketNumber: {
type: DataTypes.STRING(20),
allowNull: false,
unique: true
  }
subject: {
type: DataTypes.STRING(200),
allowNull: false,
validate: {
len: [5, 200] }
  }
description: {
type: DataTypes.TEXT,
allowNull: false,
validate: {
len: [10, 5000] }
  }
category: {
type: DataTypes.ENUM(
      'account',
      'payment',
      'technical',
      'feature_request',
      'bug_report',
      'billing',
      'general'
    ),
allowNull: false
  }
priority: {
type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
allowNull: false,
defaultValue: 'medium'
  }
status: {
type: DataTypes.ENUM('open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed'),
allowNull: false,
defaultValue: 'open'
  }
submittedBy: {
type: DataTypes.UUID,
allowNull: false
  }
assignedTo: {
type: DataTypes.UUID,
allowNull: true
  }
resolvedAt: {
type: DataTypes.DATE,
allowNull: true
  }
closedAt: {
type: DataTypes.DATE,
allowNull: true
  }
resolution: {
type: DataTypes.TEXT,
allowNull: true
  }
metadata: {
type: DataTypes.JSONB,
allowNull: true,
defaultValue: {}
  }
} {
tableName: 'support_tickets',
timestamps: true,
indexes: [
    {
fields: ['ticketNumber'],
unique: true }
    {
fields: ['status'] }
    {
fields: ['category'] }
    {
fields: ['priority'] }
    {
fields: ['submittedBy'] }
    {
fields: ['assignedTo'] }
    {
fields: ['createdAt'] }
  ]
});

// Generate unique ticket number
SupportTicket.generateTicketNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${timestamp}-${random}`;
};

// Calculate SLA breach
SupportTicket.prototype.isSLABreached = function() {
  const slaHours = {
critical: 4,
high: 24,
medium: 72,
low: 168
  };
  
  const hoursElapsed = (new Date() - new Date(this.createdAt)) / (1000 * 60 * 60);
  return hoursElapsed > slaHours[this.priority];
};

module.exports = SupportTicket;
