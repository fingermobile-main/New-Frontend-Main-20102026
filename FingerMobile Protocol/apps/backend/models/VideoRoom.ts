import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface VideoRoomAttributes {
  id: string;
  title: string;
  type: string;
  creatorId: string;
  maxParticipants: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type VideoRoomCreationAttributes = Optional<VideoRoomAttributes, 'id' | 'type' | 'maxParticipants' | 'isActive' | 'createdAt' | 'updatedAt'>;

class VideoRoom extends Model<VideoRoomAttributes, VideoRoomCreationAttributes> implements VideoRoomAttributes {
  public id!: string;
  public title!: string;
  public type!: string;
  public creatorId!: string;
  public maxParticipants!: number;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

VideoRoom.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(10),
    defaultValue: 'video',
    validate: {
      isIn: [['video', 'audio']],
    },
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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
  tableName: 'video_rooms',
  sequelize,
});

export default VideoRoom;