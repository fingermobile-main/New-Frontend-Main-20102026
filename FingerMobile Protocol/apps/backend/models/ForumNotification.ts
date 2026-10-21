import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumNotificationAttributes {
  id: string;
  userId: string;
  message: string;
  type: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

type ForumNotificationCreationAttributes = Optional<ForumNotificationAttributes, 'id' | 'isRead' | 'createdAt'>;

class ForumNotification extends Model<ForumNotificationAttributes, ForumNotificationCreationAttributes> implements ForumNotificationAttributes {
  public id!: string;
  public userId!: string;
  public message!: string;
  public type!: string;
  public isRead!: boolean;
  public data!: any;
  public createdAt!: Date;
}

ForumNotification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'forum_notifications',
  sequelize,
});

export default ForumNotification;