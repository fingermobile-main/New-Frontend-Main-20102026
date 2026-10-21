import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../database/connection';
import logger from '../utils/logger';

export class AffiliateMetric extends Model {
  public id!: string;
  public affiliateId!: string;
  public clicks!: number;
  public signups!: number;
  public conversions!: number;
  public revenue!: number;
  public period!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeAffiliateMetric = () => {
  const sequelize = getSequelize();
  if (!sequelize) {
    logger.warn('Sequelize not initialized, skipping AffiliateMetric model initialization');
    return;
  }

  AffiliateMetric.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      affiliateId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'affiliate_id'
      },
      clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      signups: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      conversions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      revenue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      period: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'affiliate_metrics',
      underscored: true,
      timestamps: true,
    }
  );
};

export default AffiliateMetric;
