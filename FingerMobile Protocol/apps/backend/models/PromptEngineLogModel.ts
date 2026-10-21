import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface PromptEngineLogAttributes {
  id: number;
  uuid: string;
  prompt: string;
  response: string;
  actionExecuted: boolean;
  status: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PromptEngineLogCreationAttributes extends Optional<PromptEngineLogAttributes, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'response' | 'actionExecuted'> {}

class PromptEngineLog extends Model<PromptEngineLogAttributes, PromptEngineLogCreationAttributes> implements PromptEngineLogAttributes {
  public id!: number;
  public uuid!: string;
  public prompt!: string;
  public response!: string;
  public actionExecuted!: boolean;
  public status!: string;
  public timestamp!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializePromptEngineLog = () => {
  PromptEngineLog.init(
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
      prompt: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      actionExecuted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'PromptEngineLog',
      tableName: 'prompt_engine_logs',
      timestamps: true,
    }
  );
};

export default PromptEngineLog;
