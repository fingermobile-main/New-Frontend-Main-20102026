'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaxRate extends Model {
    static associate(_models) {
      // Define associations here
      // Example: this.belongsTo(_models.Country, { foreignKey: 'countryId' });
    }
  }
  TaxRate.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zipCodePattern: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    appliesToPhysicalGoods: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    appliesToDigitalGoods: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'TaxRate',
    tableName: 'tax_rates',
    timestamps: true
  });
  return TaxRate;
};
