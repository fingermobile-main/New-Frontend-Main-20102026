import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserLikeAttributes {
  id: string;
  userId: string;
  targetType: string;
  targetId: string;
  createdAt: Date;
}

type UserLikeCreationAttributes = Optional<UserLikeAttributes, 'id' | 'createdAt'>;

class UserLike extends Model<UserLikeAttributes, UserLikeCreationAttributes> implements UserLikeAttributes {
  public id!: string;
  public userId!: string;
  public targetType!: string;
  public targetId!: string;
  public createdAt!: Date;
}

UserLike.init({
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_likes',
  sequelize,
});

export default UserLike;