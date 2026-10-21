import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface SystemHealthLogAttributes {
  id: number;
  uuid: string;
  serviceName: string;
  status: string;
  severity: string;
  message: string;
  timestamp: Date;
  owner?: string;
  resolution?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SystemHealthLogCreationAttributes extends Optional<SystemHealthLogAttributes, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'owner' | 'resolution'> {}

class SystemHealthLog extends Model<SystemHealthLogAttributes, SystemHealthLogCreationAttributes> implements SystemHealthLogAttributes {
  public id!: number;
  public uuid!: string;
  public serviceName!: string;
  public status!: string;
  public severity!: string;
  public message!: string;
  public timestamp!: Date;
  public owner?: string;
  public resolution?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeSystemHealthLog = () => {
  SystemHealthLog.init(
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
      serviceName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('healthy', 'degraded', 'offline'),
        allowNull: false,
        defaultValue: 'healthy'
      },
      severity: {
        type: DataTypes.ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'),
        allowNull: false,
        defaultValue: 'INFO'
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      owner: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resolution: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'SystemHealthLog',
      tableName: 'system_health_logs',
      timestamps: true,
    }
  );
};

export default SystemHealthLog;
