import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumReportAttributes {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
  description?: string;
  status: string;
  moderatorId?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

type ForumReportCreationAttributes = Optional<ForumReportAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

class ForumReport extends Model<ForumReportAttributes, ForumReportCreationAttributes> implements ForumReportAttributes {
  public id!: string;
  public reporterId!: string;
  public targetType!: string;
  public targetId!: string;
  public reason!: string;
  public description!: string;
  public status!: string;
  public moderatorId!: string;
  public reviewNotes!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ForumReport.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  reporterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  targetType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['forum_post', 'forum_thread']],
    },
  },
  targetId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'reviewed', 'resolved', 'dismissed']],
    },
  },
  moderatorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  reviewNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'forum_reports',
  sequelize,
});

export default ForumReport;