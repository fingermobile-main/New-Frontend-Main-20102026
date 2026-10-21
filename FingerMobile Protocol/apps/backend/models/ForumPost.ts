import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumPostAttributes {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  parentPostId?: string;
  likesCount: number;
  dislikesCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  isBookmarked: boolean;
  isReported: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  editReason?: string;
  replyCount: number;
  tags: string[];
  attachments?: string[];
  location?: string;
  ipHash?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  deletedAt?: Date;
  reportedAt?: Date;
  reportedReason?: string;
  reportedById?: string;
  isApproved: boolean;
  approvedById?: string;
  approvedAt?: Date;
  spamScore?: number;
  moderationStatus: string;
}

type ForumPostCreationAttributes = Optional<ForumPostAttributes, 'id' | 'likesCount' | 'dislikesCount' | 'isLiked' | 'isDisliked' | 'isBookmarked' | 'isReported' | 'isDeleted' | 'isEdited' | 'replyCount' | 'isApproved' | 'moderationStatus' | 'createdAt' | 'updatedAt'>;

class ForumPost extends Model<ForumPostAttributes, ForumPostCreationAttributes> implements ForumPostAttributes {
  public id!: string;
  public threadId!: string;
  public authorId!: string;
  public content!: string;
  public parentPostId!: string;
  public likesCount!: number;
  public dislikesCount!: number;
  public isLiked!: boolean;
  public isDisliked!: boolean;
  public isBookmarked!: boolean;
  public isReported!: boolean;
  public isDeleted!: boolean;
  public isEdited!: boolean;
  public editReason!: string;
  public replyCount!: number;
  public tags!: string[];
  public attachments!: string[];
  public location!: string;
  public ipHash!: string;
  public userAgent!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public editedAt!: Date;
  public deletedAt!: Date;
  public reportedAt!: Date;
  public reportedReason!: string;
  public reportedById!: string;
  public isApproved!: boolean;
  public approvedById!: string;
  public approvedAt!: Date;
  public spamScore!: number;
  public moderationStatus!: string;
}

ForumPost.init({
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parentPostId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'forum_posts',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dislikesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isLiked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isDisliked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isBookmarked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isReported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  editReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  replyCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ipHash: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  userAgent: {
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
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reportedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reportedReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reportedById: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  approvedById: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  spamScore: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
  },
  moderationStatus: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected', 'flagged']],
    },
  },
}, {
  tableName: 'forum_posts',
  sequelize,
});

export default ForumPost;

