'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    static associate(models) {
      if (models.User) {
        Loan.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      }
      if (models.Repayment) {
        Loan.hasMany(models.Repayment, { foreignKey: 'loanId', as: 'repayments' });
      }
    }
  }

  Loan.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    principalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    interestRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    tenureMonths: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'disbursed', 'active', 'repaid', 'defaulted'),
      defaultValue: 'pending'
    },
    disbursedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    repaidAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Loan',
    tableName: 'loans',
    timestamps: true
  });

  return Loan;
};
