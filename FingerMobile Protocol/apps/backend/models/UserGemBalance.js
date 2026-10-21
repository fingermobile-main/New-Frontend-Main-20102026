const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const UserGemBalance = sequelize.define('UserGemBalance', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    field: 'user_id'
  },
  balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'user_gem_balances',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = UserGemBalance;
