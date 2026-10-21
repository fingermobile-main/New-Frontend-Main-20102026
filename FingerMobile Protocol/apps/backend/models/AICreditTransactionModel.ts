import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface AICreditTransactionAttributes {
id: string;
userId: string;
  subscriptionId?: string;
transactionType: string; // 'purchase', 'usage', 'refund', 'bonus', 'expiry',
creditsAmount: number;
balanceBefore: number;
balanceAfter: number;
  description?: string;
  referenceId?: string;
  metadata?: any;
  createdAt?: Date;
}

interface AICreditTransactionCreationAttributes extends Optional<AICreditTransactionAttributes, 'id' | 'createdAt' | 'subscriptionId' | 'description' | 'referenceId' | 'metadata'> {}

class AICreditTransaction extends Model<AICreditTransactionAttributes, AICreditTransactionCreationAttributes> implements AICreditTransactionAttributes {
  public id!: string;
  public userId!: string;
  public subscriptionId?: string;
  public transactionType!: string;
  public creditsAmount!: number;
  public balanceBefore!: number;
  public balanceAfter!: number;
  public description?: string;
  public referenceId?: string;
  public metadata?: any;
  public readonly createdAt!: Date;
}

// Deferred initialization - will be called when sequelize is ready
export const initializeAICreditTransaction = () => {
  AICreditTransaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      subscriptionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'ai_subscriptions',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      transactionType: {
        type: DataTypes.ENUM('purchase', 'usage', 'refund', 'bonus', 'expiry'),
        allowNull: false
      },
      creditsAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      balanceBefore: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      balanceAfter: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      referenceId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'AICreditTransaction',
      tableName: 'ai_credit_transactions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [
        {
          fields: ['userId']
        },
        {
          fields: ['transactionType']
        }
      ]
    }
  );
};

export default AICreditTransaction;
