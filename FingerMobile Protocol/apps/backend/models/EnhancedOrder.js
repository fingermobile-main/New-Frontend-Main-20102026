const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const EnhancedOrder = sequelize.define('EnhancedOrder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING(50),
    field: 'order_number',
    allowNull: false,
    unique: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    field: 'customer_id',
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'tax_amount',
    allowNull: true
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'shipping_cost',
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'discount_amount',
    allowNull: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount'
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending',
    field: 'payment_status',
    allowNull: false
  },
  fulfillmentStatus: {
    type: DataTypes.ENUM('unfulfilled', 'partial', 'fulfilled', 'cancelled'),
    defaultValue: 'unfulfilled',
    field: 'fulfillment_status',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shippedAt: {
    type: DataTypes.DATE,
    field: 'shipped_at',
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    field: 'delivered_at',
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
  tableName: 'orders',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['customer_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['order_number']
    }
  ]
});

// Association method
EnhancedOrder.associate = function(models) {
  EnhancedOrder.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
  EnhancedOrder.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
};

module.exports = EnhancedOrder;
