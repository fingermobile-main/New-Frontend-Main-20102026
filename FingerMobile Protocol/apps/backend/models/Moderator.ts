import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ModeratorAttributes {
  id: string;
  userId: string;
  forumId?: string;
  createdAt: Date;
  updatedAt: Date;
}

type ModeratorCreationAttributes = Optional<ModeratorAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Moderator extends Model<ModeratorAttributes, ModeratorCreationAttributes> implements ModeratorAttributes {
  public id!: string;
  public userId!: string;
  public forumId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Moderator.init({
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
  forumId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'forum_categories',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
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
  tableName: 'moderators',
  sequelize,
});

export default Moderator;