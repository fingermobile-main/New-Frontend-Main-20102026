import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../database/connection';
import logger from '../utils/logger';

export class Program extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public status!: string;
  public metadata!: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeProgram = () => {
  const sequelize = getSequelize();
  if (!sequelize) {
    logger.warn('Sequelize not initialized, skipping Program model initialization');
    return;
  }

  Program.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'programs',
      underscored: true,
      timestamps: true,
    }
  );
};

export default Program;
