import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface AIUsageLogAttributes {
id: string;
userId: string;
  subscriptionId?: string;
featureType: string; // 'chat', 'image', 'translation', etc.
  modelUsed?: string; // 'gpt-4o', 'dall-e-3', etc.
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
creditsCharged: number;
  requestMetadata?: any;
responseStatus: string;
  errorMessage?: string;
  ipAddress?: string;
  createdAt?: Date;
}

interface AIUsageLogCreationAttributes extends Optional<AIUsageLogAttributes, 'id' | 'createdAt' | 'subscriptionId' | 'modelUsed' | 'promptTokens' | 'completionTokens' | 'totalTokens' | 'requestMetadata' | 'responseStatus' | 'errorMessage' | 'ipAddress'> {}

class AIUsageLog extends Model<AIUsageLogAttributes, AIUsageLogCreationAttributes> implements AIUsageLogAttributes {
  public id!: string;
  public userId!: string;
  public subscriptionId?: string;
  public featureType!: string;
  public modelUsed?: string;
  public promptTokens?: number;
  public completionTokens?: number;
  public totalTokens?: number;
  public creditsCharged!: number;
  public requestMetadata?: any;
  public responseStatus!: string;
  public errorMessage?: string;
  public ipAddress?: string;
  public readonly createdAt!: Date;
}


// Deferred initialization - will be called when sequelize is ready
export const initializeAIUsageLog = () => {
  AIUsageLog.init(
    {
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
      featureType: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      modelUsed: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      promptTokens: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      completionTokens: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      totalTokens: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      creditsCharged: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      requestMetadata: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      responseStatus: {
        type: DataTypes.STRING(20),
        defaultValue: 'success'
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ipAddress: {
        type: DataTypes.INET,
        allowNull: true
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'AIUsageLog',
      tableName: 'ai_usage_logs',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [
        {
          fields: ['user_id']
        },
        {
          fields: ['created_at']
        },
        {
          fields: ['featureType']
        }
      ]
    }
  );
};

export default AIUsageLog;
