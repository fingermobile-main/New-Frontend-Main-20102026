import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface PlatformMetricAttributes {
  id: number;
  uuid: string;
  timestamp: Date;
  dau: number;
  mau: number;
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  returningMembers: number;
  revenue: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PlatformMetricCreationAttributes extends Optional<PlatformMetricAttributes, 'id' | 'uuid' | 'createdAt' | 'updatedAt'> {}

class PlatformMetric extends Model<PlatformMetricAttributes, PlatformMetricCreationAttributes> implements PlatformMetricAttributes {
  public id!: number;
  public uuid!: string;
  public timestamp!: Date;
  public dau!: number;
  public mau!: number;
  public totalMembers!: number;
  public activeMembers!: number;
  public newMembers!: number;
  public returningMembers!: number;
  public revenue!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializePlatformMetric = () => {
  PlatformMetric.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      dau: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      mau: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalMembers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      activeMembers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      newMembers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      returningMembers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      revenue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'PlatformMetric',
      tableName: 'platform_metrics',
      timestamps: true,
    }
  );
};

export default PlatformMetric;
