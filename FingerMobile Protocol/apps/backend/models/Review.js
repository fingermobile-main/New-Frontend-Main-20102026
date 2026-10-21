const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Review = sequelize.define('Review', {
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
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'reviews',
  timestamps: false, // No updatedAt in this table
  underscored: true,
  indexes: [
    {
      fields: ['product_id']
    },
    {
      fields: ['user_id']
    }
  ]
});

// Association method
Review.associate = function(models) {
  Review.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Review;
