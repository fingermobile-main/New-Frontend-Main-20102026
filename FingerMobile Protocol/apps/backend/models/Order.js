const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    field: 'shipping_address',
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'orders',
  timestamps: false, // No updatedAt in this table
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    }
  ]
});

// Association method
Order.associate = function(models) {
  Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
};

module.exports = Order;

