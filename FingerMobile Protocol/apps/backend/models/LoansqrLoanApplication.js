const { DataTypes } = require('sequelize');
const db = require('../database/connection');

const LoansqrLoanApplication = db.sequelize.define('LoansqrLoanApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  loan_product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'LoansqrLoanProduct',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  amount_requested: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  tenure_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'active', 'completed', 'defaulted', 'cancelled'),
    allowNull: false,
    defaultValue: 'submitted'
  },
  application_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  approved_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approved_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  monthly_payment: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  total_repayment: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  processing_fee: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  collateral_details: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  guarantor_details: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  credit_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 1000
    }
  },
  debt_to_income_ratio: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  employment_status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  annual_income: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  repayment_method: {
    type: DataTypes.ENUM('auto_debit', 'manual', 'mobile_money', 'bank_transfer'),
    allowNull: false,
    defaultValue: 'auto_debit'
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  review_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'loansqr_applications',
  timestamps: false,
  underscored: true
});

module.exports = LoansqrLoanApplication;
