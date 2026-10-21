import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumModerationActionAttributes {
  id: string;
  moderatorId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  reason?: string;
  createdAt: Date;
}

type ForumModerationActionCreationAttributes = Optional<ForumModerationActionAttributes, 'id' | 'createdAt'>;

class ForumModerationAction extends Model<ForumModerationActionAttributes, ForumModerationActionCreationAttributes> implements ForumModerationActionAttributes {
  public id!: string;
  public moderatorId!: string;
  public actionType!: string;
  public targetType!: string;
  public targetId!: string;
  public reason!: string;
  public createdAt!: Date;
}

ForumModerationAction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  moderatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  actionType: {
    type: DataTypes.STRING(50),
    allowNull: false,
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
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'forum_moderation_actions',
  sequelize,
});

export default ForumModerationAction;