'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    static associate(_models) {
      // Define associations here if needed
    }
  }
  Coupon.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('percentage', 'fixed_amount', 'free_shipping'),
      allowNull: false,
      defaultValue: 'percentage'
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    minimumOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    maximumDiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    usageLimitPerUser: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true
  });
  return Coupon;
};
