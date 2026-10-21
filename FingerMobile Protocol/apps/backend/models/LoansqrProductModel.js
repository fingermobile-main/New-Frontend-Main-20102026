const { DataTypes, Model } = require('sequelize');
const { identityDb } = require('../db');

class LoansqrProduct extends Model {}

const initializeLoansqrProduct = () => {
  LoansqrProduct.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    max_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    loan_term_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eligibility_criteria: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize: identityDb,
    modelName: 'LoansqrProduct',
    tableName: 'loansqr_products',
    timestamps: true
  });
};

module.exports = {
  LoansqrProduct,
  initializeLoansqrProduct
};
