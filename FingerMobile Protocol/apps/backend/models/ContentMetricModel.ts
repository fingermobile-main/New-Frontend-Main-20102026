import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface ContentMetricAttributes {
  id: number;
  uuid: string;
  contentId: string;
  creatorId: string;
  type: string;
  views: number;
  engagementRate: number;
  shares: number;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContentMetricCreationAttributes extends Optional<ContentMetricAttributes, 'id' | 'uuid' | 'createdAt' | 'updatedAt'> {}

class ContentMetric extends Model<ContentMetricAttributes, ContentMetricCreationAttributes> implements ContentMetricAttributes {
  public id!: number;
  public uuid!: string;
  public contentId!: string;
  public creatorId!: string;
  public type!: string;
  public views!: number;
  public engagementRate!: number;
  public shares!: number;
  public timestamp!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeContentMetric = () => {
  ContentMetric.init(
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
      contentId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      creatorId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('post', 'video', 'comment'),
        allowNull: false,
        defaultValue: 'post'
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      engagementRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      shares: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'ContentMetric',
      tableName: 'content_metrics',
      timestamps: true,
    }
  );
};

export default ContentMetric;
