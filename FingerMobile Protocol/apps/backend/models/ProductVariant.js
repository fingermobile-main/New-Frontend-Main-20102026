const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    field: 'product_id',
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'compare_price',
    allowNull: true
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'cost_price',
    allowNull: true
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'stock_quantity',
    allowNull: true
  },
  reservedStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'reserved_stock',
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
  tableName: 'product_variants',
  timestamps: true,
  underscored: true
});

// Association method
ProductVariant.associate = function(models) {
  ProductVariant.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  ProductVariant.hasMany(models.OrderItem, { foreignKey: 'variantId', as: 'orderItems' });
};

module.exports = ProductVariant;
