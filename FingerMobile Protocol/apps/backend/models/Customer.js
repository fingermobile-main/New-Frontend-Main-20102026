const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    field: 'first_name',
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING(100),
    field: 'last_name',
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    field: 'date_of_birth',
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
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
  tableName: 'customers',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['email']
    }
  ]
});

// Association method
Customer.associate = function(models) {
  Customer.hasMany(models.Address, { foreignKey: 'customerId', as: 'addresses' });
  Customer.hasMany(models.Order, { foreignKey: 'customerId', as: 'orders' });
  Customer.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
  Customer.hasMany(models.Cart, { foreignKey: 'customerId', as: 'cartItems' });
};

module.exports = Customer;
