import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../database/connection';
import logger from '../utils/logger';

export class Application extends Model {
  public id!: string;
  public programId!: string;
  public applicantId!: string;
  public status!: string;
  public details!: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeApplication = () => {
  const sequelize = getSequelize();
  if (!sequelize) {
    logger.warn('Sequelize not initialized, skipping Application model initialization');
    return;
  }

  Application.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'program_id'
      },
      applicantId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'applicant_id'
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      details: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'applications',
      underscored: true,
      timestamps: true,
    }
  );
};

export default Application;
