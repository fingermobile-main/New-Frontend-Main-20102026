const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Category = sequelize.define('Category', {
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
  parentId: {
    type: DataTypes.INTEGER,
    field: 'parent_category_id',
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.TEXT,
    field: 'image_url',
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'categories',
  timestamps: false, // No updatedAt in this table
  underscored: true
});

// Association method
Category.associate = function(models) {
  Category.hasMany(models.Category, { foreignKey: 'parentId', as: 'subcategories' });
  Category.belongsTo(models.Category, { foreignKey: 'parentId', as: 'parent' });
  Category.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
};

module.exports = Category;
