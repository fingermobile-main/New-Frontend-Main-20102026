const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    field: 'customer_id',
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.ENUM('billing', 'shipping', 'both'),
    defaultValue: 'shipping',
    allowNull: false
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
  company: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  addressLine1: {
    type: DataTypes.STRING(255),
    field: 'address_line_1',
    allowNull: false
  },
  addressLine2: {
    type: DataTypes.STRING(255),
    field: 'address_line_2',
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING(20),
    field: 'postal_code',
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default',
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
  tableName: 'addresses',
  timestamps: true,
  underscored: true
});

// Association method
Address.associate = function(models) {
  Address.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
};

module.exports = Address;

