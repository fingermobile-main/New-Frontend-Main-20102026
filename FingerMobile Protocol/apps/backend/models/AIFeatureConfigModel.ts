import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface AIFeatureConfigAttributes {
id: string;
featureName: string;
  description?: string;
creditsPerUse: number;
  maxRequestsPerDay?: number;
allowedTiers: string[];
isActive: boolean;
rateLimitPerMinute: number;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AIFeatureConfigCreationAttributes extends Optional<AIFeatureConfigAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'maxRequestsPerDay' | 'isActive' | 'rateLimitPerMinute' | 'metadata'> {}

class AIFeatureConfig extends Model<AIFeatureConfigAttributes, AIFeatureConfigCreationAttributes> implements AIFeatureConfigAttributes {
  public id!: string;
  public featureName!: string;
  public description?: string;
  public creditsPerUse!: number;
  public maxRequestsPerDay?: number;
  public allowedTiers!: string[];
  public isActive!: boolean;
  public rateLimitPerMinute!: number;
  public metadata?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Check if tier is allowed for this feature
  isTierAllowed(
    tier: string): boolean {
    return this.allowedTiers.includes(tier);
  }

  // Check if feature is active
  isFeatureActive(): boolean {
    return this.isActive;
  }
}

// Deferred initialization - will be called when sequelize is ready
export const initializeAIFeatureConfig = () => {
  AIFeatureConfig.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      featureName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      creditsPerUse: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      maxRequestsPerDay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1
        }
      },
      allowedTiers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      rateLimitPerMinute: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        validate: {
          min: 1
        }
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'AIFeatureConfig',
      tableName: 'ai_feature_config',
      timestamps: true
    }
  );
};

export default AIFeatureConfig;
