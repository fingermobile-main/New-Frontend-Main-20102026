const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wallet_balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  role: {
    type: DataTypes.ENUM('user', 'creator', 'admin', 'merchant'),
    defaultValue: 'user',
  },
  biometricId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Links to the FMBF vector database for face authentication',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = User;
