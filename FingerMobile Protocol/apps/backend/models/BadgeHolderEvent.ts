import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface BadgeHolderEventAttributes {
  id: string;
  eventName: string;
  date?: Date;
  time?: string;
  location?: string;
  description?: string;
  attendees?: number;
  organizer?: string;
  createdAt: Date;
  updatedAt: Date;
}

type BadgeHolderEventCreationAttributes = Optional<BadgeHolderEventAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class BadgeHolderEvent extends Model<BadgeHolderEventAttributes, BadgeHolderEventCreationAttributes> implements BadgeHolderEventAttributes {
  public id!: string;
  public eventName!: string;
  public date!: Date;
  public time!: string;
  public location!: string;
  public description!: string;
  public attendees!: number;
  public organizer!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

BadgeHolderEvent.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attendees: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  organizer: {
    type: DataTypes.STRING(255),
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
  tableName: 'badge_holder_events',
  sequelize,
});

export default BadgeHolderEvent;