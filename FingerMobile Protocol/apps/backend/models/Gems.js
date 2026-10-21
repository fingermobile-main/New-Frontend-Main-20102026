const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Gems = sequelize.define('Gems', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'user_gem_balances',
      key: 'user_id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  transactionType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'transaction_type'
  },
  referenceId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'reference_id'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'gem_transactions',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['transaction_type']
    },
    {
      fields: ['created_at']
    }
  ]
});

// Additional model for user gem balances
const UserGemBalance = sequelize.define('UserGemBalance', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    field: 'user_id'
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
  tableName: 'user_gem_balances',
  timestamps: true,
  underscored: true
});

// Model for gem catalog
const GemCatalog = sequelize.define('GemCatalog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'gems',
  timestamps: true,
  underscored: true
});

// Association method
Gems.associate = function(models) {
  Gems.belongsTo(models.UserGemBalance, { foreignKey: 'userId', as: 'userGemBalance' });
};

UserGemBalance.associate = function(models) {
  UserGemBalance.hasMany(models.Gems, { foreignKey: 'userId', as: 'transactions' });
};

module.exports = { Gems, UserGemBalance, GemCatalog };
