const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const EnhancedOrderItem = sequelize.define('EnhancedOrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    field: 'order_id',
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  productId: {
    type: DataTypes.INTEGER,
    field: 'product_id',
    allowNull: true,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  variantId: {
    type: DataTypes.INTEGER,
    field: 'variant_id',
    allowNull: true,
    references: {
      model: 'product_variants',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'total_price',
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'order_items',
  timestamps: false, // No updatedAt in this table
  underscored: true,
  indexes: [
    {
      fields: ['order_id']
    },
    {
      fields: ['product_id']
    }
  ]
});

// Association method
EnhancedOrderItem.associate = function(models) {
  EnhancedOrderItem.belongsTo(models.EnhancedOrder, { foreignKey: 'orderId', as: 'order' });
  EnhancedOrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  EnhancedOrderItem.belongsTo(models.ProductVariant, { foreignKey: 'variantId', as: 'variant' });
};

module.exports = EnhancedOrderItem;
