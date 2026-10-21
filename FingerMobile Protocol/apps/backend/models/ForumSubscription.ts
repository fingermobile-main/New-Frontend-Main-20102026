import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumSubscriptionAttributes {
  id: string;
  userId: string;
  threadId: string;
  createdAt: Date;
}

type ForumSubscriptionCreationAttributes = Optional<ForumSubscriptionAttributes, 'id' | 'createdAt'>;

class ForumSubscription extends Model<ForumSubscriptionAttributes, ForumSubscriptionCreationAttributes> implements ForumSubscriptionAttributes {
  public id!: string;
  public userId!: string;
  public threadId!: string;
  public createdAt!: Date;
}

ForumSubscription.init({
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'forum_subscriptions',
  sequelize,
});

export default ForumSubscription;