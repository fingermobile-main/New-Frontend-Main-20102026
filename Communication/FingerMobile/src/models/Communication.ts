import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CommunicationAttributes {
  id: string;
  title: string;
  content: string;
  type: string; // 'announcement', 'alert', 'news', 'maintenance', 'blog', 'gem', 'hallmark', 'seishe', 'mii', 'community', 'group', 'direct', 'broadcast', 'automated'
  subtype?: string; // Additional classification like 'text', 'image', 'video', 'audio', 'document', 'rich_text'
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: string; // 'all', 'premium', 'verified', 'individual:user_id', 'group:group_id', 'role:role_name', 'segment:segment_id'
  targetEntities?: string[]; // Specific targets like user IDs, group IDs, blog IDs, gem IDs, etc.
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled' | 'delivered' | 'read';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  mediaAttachments?: string[]; // URLs or paths to media attachments
  richContent?: JSON; // Rich text content with formatting
  metadata?: JSON; // Additional metadata for different content types
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CommunicationCreationAttributes = Optional<CommunicationAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Communication extends Model<CommunicationAttributes, CommunicationCreationAttributes> implements CommunicationAttributes {
  public id!: string;
  public title!: string;
  public content!: string;
  public type!: string;
  public subtype?: string;
  public priority!: 'low' | 'medium' | 'high' | 'critical';
  public targetAudience!: string;
  public targetEntities?: string[];
  public status!: 'draft' | 'scheduled' | 'sent' | 'cancelled' | 'delivered' | 'read';
  public scheduledAt?: Date;
  public sentAt?: Date;
  public deliveredAt?: Date;
  public readAt?: Date;
  public mediaAttachments?: string[];
  public richContent?: JSON;
  public metadata?: JSON;
  public createdBy!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Communication.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtype: {
    type: DataTypes.STRING
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false
  },
  targetAudience: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetEntities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'sent', 'cancelled', 'delivered', 'read'),
    allowNull: false,
    defaultValue: 'draft'
  },
  scheduledAt: {
    type: DataTypes.DATE
  },
  sentAt: {
    type: DataTypes.DATE
  },
  deliveredAt: {
    type: DataTypes.DATE
  },
  readAt: {
    type: DataTypes.DATE
  },
  mediaAttachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  richContent: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'communications',
  sequelize,
  timestamps: true,
  underscored: true
});