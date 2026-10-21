const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const ProductImage = sequelize.define('ProductImage', {
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
  imageUrl: {
    type: DataTypes.TEXT,
    field: 'image_url',
    allowNull: false
  },
  altText: {
    type: DataTypes.STRING(255),
    field: 'alt_text',
    allowNull: true
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'display_order',
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'product_images',
  timestamps: false, // No updatedAt in this table
  underscored: true
});

// Association method
ProductImage.associate = function(models) {
  ProductImage.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
};

module.exports = ProductImage;
