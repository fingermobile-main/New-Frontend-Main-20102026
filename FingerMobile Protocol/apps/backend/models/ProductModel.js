const { DataTypes, Model } = require('sequelize');
const { identityDb } = require('../db'); // Use the identity database

class Product extends Model {}

// Deferred initialization - will be called when sequelize is ready
const initializeProduct = () => {
  Product.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
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
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    platform_type: {
      type: DataTypes.ENUM('marketplace', 'ownit', 'flamingo', 'storefront'),
      defaultValue: 'marketplace'
    }
  }, {
    sequelize: identityDb, // Use the identityDb connection
    modelName: 'Product',
    tableName: 'products',
    timestamps: true
  });
};

module.exports = {
  Product,
  initializeProduct
};
