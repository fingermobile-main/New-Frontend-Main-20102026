import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface WorkspaceAttributes {
  id: number;
  uuid: string;
  name: string;
  type: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorkspaceCreationAttributes extends Optional<WorkspaceAttributes, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'tags'> {}

class Workspace extends Model<WorkspaceAttributes, WorkspaceCreationAttributes> implements WorkspaceAttributes {
  public id!: number;
  public uuid!: string;
  public name!: string;
  public type!: string;
  public tags?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeWorkspace = () => {
  Workspace.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('global', 'regional', 'creator_network', 'enterprise', 'government'),
        defaultValue: 'global',
        allowNull: false
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'Workspace',
      tableName: 'workspaces',
      timestamps: true,
    }
  );
};

export default Workspace;
