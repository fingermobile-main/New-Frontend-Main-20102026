import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumThreadAttributes {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  authorId: string;
  viewsCount: number;
  repliesCount: number;
  isSticky: boolean;
  isLocked: boolean;
  isPinned: boolean;
  isArchived: boolean;
  hasPoll: boolean;
  pollData?: any;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  lastPostId?: string;
  subscribersCount: number;
  isSubscribed: boolean;
  attachments?: string[];
  location?: string;
  privacy: string;
}

type ForumThreadCreationAttributes = Optional<ForumThreadAttributes, 'id' | 'viewsCount' | 'repliesCount' | 'isSticky' | 'isLocked' | 'isPinned' | 'isArchived' | 'hasPoll' | 'subscribersCount' | 'isSubscribed' | 'privacy' | 'createdAt' | 'updatedAt' | 'lastActivityAt'>;

class ForumThread extends Model<ForumThreadAttributes, ForumThreadCreationAttributes> implements ForumThreadAttributes {
  public id!: string;
  public categoryId!: string;
  public title!: string;
  public content!: string;
  public authorId!: string;
  public viewsCount!: number;
  public repliesCount!: number;
  public isSticky!: boolean;
  public isLocked!: boolean;
  public isPinned!: boolean;
  public isArchived!: boolean;
  public hasPoll!: boolean;
  public pollData!: any;
  public createdAt!: Date;
  public updatedAt!: Date;
  public lastActivityAt!: Date;
  public lastPostId!: string;
  public subscribersCount!: number;
  public isSubscribed!: boolean;
  public attachments!: string[];
  public location!: string;
  public privacy!: string;
}

ForumThread.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'forum_categories',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  repliesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isSticky: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasPoll: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  pollData: {
    type: DataTypes.JSONB,
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
  lastActivityAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  lastPostId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'forum_posts',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  subscribersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isSubscribed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  privacy: {
    type: DataTypes.STRING(20),
    defaultValue: 'public',
    validate: {
      isIn: [['public', 'members', 'moderators']],
    },
  },
}, {
  tableName: 'forum_threads',
  sequelize,
});

export default ForumThread;