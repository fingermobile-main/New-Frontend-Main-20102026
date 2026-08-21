import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../utils/modelInitializer";

interface AISubscriptionAttributes {
id: string;
userId: string;
tier: string; // 'free', 'starter', 'plus', 'creator', 'pro', 'enterprise',
status: string; // 'active', 'cancelled', 'expired', 'paused',
creditsRemaining: number;
creditsTotal: number;
  monthlyPrice?: number;
currency: string;
startDate: Date;
endDate: Date;
autoRenew: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AISubscriptionCreationAttributes extends Optional<AISubscriptionAttributes, "id" | "createdAt" | "updatedAt" | "status" | "creditsRemaining" | "autoRenew" | "currency"> {}

class AISubscription extends Model<AISubscriptionAttributes, AISubscriptionCreationAttributes> implements AISubscriptionAttributes {
  public id!: string;
  public userId!: string;
  public tier!: string;
  public status!: string;
  public creditsRemaining!: number;
  public creditsTotal!: number;
  public monthlyPrice?: number;
  public currency!: string;
  public startDate!: Date;
  public endDate!: Date;
  public autoRenew!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Check if subscription is active
  isActive(): boolean {
    return this.status === 'active' && new Date() <= this.endDate;
  }

  // Check if user has enough credits
  hasEnoughCredits(
requiredCredits: number): boolean {
    return this.creditsRemaining >= requiredCredits;
  }

  // Deduct credits
  async deductCredits(
amount: number): Promise<void> {
    if (!this.hasEnoughCredits(amount)) {
      throw new Error('Insufficient credits');
    }
    await this.decrement('creditsRemaining', {
by: amount });
  }

  // Add credits (for top-up or refund)
  async addCredits(
amount: number): Promise<void> {
    await this.increment('creditsRemaining', {
by: amount });
  }

  // Renew subscription
  async renew(
newEndDate: Date,
newCredits: number): Promise<void> {
    await this.update({
endDate: newEndDate,
creditsRemaining: newCredits,
status: 'active'
    });
  }

  // Cancel subscription
  async cancel(): Promise<void> {
    await this.update({
status: 'cancelled',
autoRenew: false
    });
  }
}


// Deferred initialization - will be called when sequelize is ready
export const initializeAISubscription = () => {
  AISubscription.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tier: {
        type: DataTypes.ENUM('free', 'starter', 'plus', 'creator', 'pro', 'enterprise'),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('active', 'cancelled', 'expired', 'paused'),
        defaultValue: 'active'
      },
      creditsRemaining: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      creditsTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      monthlyPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'NGN'
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      autoRenew: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'AISubscription',
      tableName: 'ai_subscriptions',
      timestamps: true,
      indexes: [
        {
          fields: ['userId']
        },
        {
          fields: ['status']
        }
      ]
    }
  );
};

export default AISubscription;
