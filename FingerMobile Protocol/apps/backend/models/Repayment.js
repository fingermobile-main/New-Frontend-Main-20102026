'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Repayment extends Model {
    static associate(models) {
      if (models.Loan) {
        Repayment.belongsTo(models.Loan, { foreignKey: 'loanId', as: 'loan' });
      }
      if (models.User) {
        Repayment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      }
    }
  }

  Repayment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: 'wallet'
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    paidAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Repayment',
    tableName: 'repayments',
    timestamps: true
  });

  return Repayment;
};
