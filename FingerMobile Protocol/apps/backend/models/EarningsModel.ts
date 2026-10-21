import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface EarningsAttributes {
id: string;
userId: string;
source: string;
amount: number;
currency: string;
status: string;
  description?: string;
  period?: string;
  metadata?: any;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EarningsCreationAttributes extends Optional<EarningsAttributes, 'id' | 'createdAt' | 'updatedAt' | 'paidAt'> {}

class Earnings extends Model<EarningsAttributes, EarningsCreationAttributes> implements EarningsAttributes {
  public id!: string;
  public userId!: string;
  public source!: string;
  public amount!: number;
  public currency!: string;
  public status!: string;
  public description?: string;
  public period?: string;
  public metadata?: any;
  public paidAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


// Deferred initialization - will be called when sequelize is ready
export const initializeEarnings = () => {
  Earnings.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      source: {
        type: DataTypes.ENUM(
          'views',
          'subscriptions',
          'gems',
          'ads',
          'donations',
          'tips',
          'affiliate',
          'merchandise',
          'other'
        ),
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
      },
      status: {
        type: DataTypes.ENUM('pending', 'available', 'paid', 'cancelled'),
        defaultValue: 'pending'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      period: {
        type: DataTypes.STRING,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'Earnings',
      tableName: 'earnings',
      timestamps: true
    }
  );
};

export default Earnings;
