import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface BroadcastRecipientAttributes {
  id: string;
  broadcastId: string;
  userId: string;
  recipientType: string; // 'user', 'group', 'role', 'segment'
  status: 'pending' | 'delivered' | 'read' | 'failed';
  deliveredAt?: Date;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BroadcastRecipientCreationAttributes = Optional<BroadcastRecipientAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class BroadcastRecipient extends Model<BroadcastRecipientAttributes, BroadcastRecipientCreationAttributes> implements BroadcastRecipientAttributes {
  public id!: string;
  public broadcastId!: string;
  public userId!: string;
  public recipientType!: string;
  public status!: 'pending' | 'delivered' | 'read' | 'failed';
  public deliveredAt?: Date;
  public readAt?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

BroadcastRecipient.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  broadcastId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'communications',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipientType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'delivered', 'read', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  deliveredAt: {
    type: DataTypes.DATE
  },
  readAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'broadcast_recipients',
  sequelize,
  timestamps: true,
  underscored: true
});