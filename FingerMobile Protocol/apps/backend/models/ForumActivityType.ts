import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumActivityTypeAttributes {
  id: string;
  threadId: string;
  activityType?: string;
  createdAt: Date;
}

type ForumActivityTypeCreationAttributes = Optional<ForumActivityTypeAttributes, 'id' | 'createdAt'>;

class ForumActivityType extends Model<ForumActivityTypeAttributes, ForumActivityTypeCreationAttributes> implements ForumActivityTypeAttributes {
  public id!: string;
  public threadId!: string;
  public activityType!: string;
  public createdAt!: Date;
}

ForumActivityType.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  threadId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'forum_threads',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  activityType: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'forum_activity_types',
  sequelize,
});

export default ForumActivityType;