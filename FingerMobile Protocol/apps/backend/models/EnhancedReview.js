const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const EnhancedReview = sequelize.define('EnhancedReview', {
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
  customerId: {
    type: DataTypes.INTEGER,
    field: 'customer_id',
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  orderId: {
    type: DataTypes.INTEGER,
    field: 'order_id',
    allowNull: true,
    references: {
      model: 'orders',
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  verifiedPurchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'verified_purchase',
    allowNull: true
  },
  helpfulCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'helpful_count',
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
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
  tableName: 'reviews',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['product_id']
    },
    {
      fields: ['customer_id']
    }
  ]
});

// Association method
EnhancedReview.associate = function(models) {
  EnhancedReview.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  EnhancedReview.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
  EnhancedReview.belongsTo(models.EnhancedOrder, { foreignKey: 'orderId', as: 'order' });
};

module.exports = EnhancedReview;
