import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer';

interface UserActivityAttributes {
  id: number;
  userId: number;
  action: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserActivityCreationAttributes extends Optional<UserActivityAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class UserActivity extends Model<UserActivityAttributes, UserActivityCreationAttributes> implements UserActivityAttributes {
  public id!: number;
  public userId!: number;
  public action!: string;
  public details!: any;
  public ipAddress?: string;
  public userAgent?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeUserActivity = () => {
  UserActivity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      details: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'UserActivity',
      tableName: 'user_activities',
      timestamps: true
    }
  );
};

export class UserActivityService {
  static async logActivity(userId: number, action: string, details: any, req?: any): Promise<void> {
    try {
      await UserActivity.create({
        userId,
        action,
        details,
        ipAddress: req?.ip || req?.connection?.remoteAddress || null,
        userAgent: req?.headers?.['user-agent'] || null
      });
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
  }

  static async getUserActivities(userId: number, limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      const activities = await UserActivity.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });
      return activities;
    } catch (error) {
      console.error('Error retrieving user activities:', error);
      throw error;
    }
  }

  static async getRecentActivities(limit: number = 100): Promise<any[]> {
    try {
      const activities = await UserActivity.findAll({
        order: [['createdAt', 'DESC']],
        limit
      });
      return activities;
    } catch (error) {
      console.error('Error retrieving recent activities:', error);
      throw error;
    }
  }
}