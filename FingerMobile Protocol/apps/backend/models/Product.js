const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'stock_quantity',
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    field: 'category_id',
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
    field: 'created_by',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
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
  tableName: 'products',
  timestamps: true,
  underscored: true
});

// Association method
Product.associate = function(models) {
  Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
  Product.belongsTo(models.User, { foreignKey: 'createdBy', as: 'user' });
  Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
  Product.hasMany(models.Review, { foreignKey: 'productId', as: 'reviews' });
  Product.hasMany(models.Cart, { foreignKey: 'productId', as: 'cartItems' });
};

module.exports = Product;
