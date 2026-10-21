import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SavedPostAttributes {
  id: string;
  userId: string;
  postId: string;
  savedAt: Date;
}

type SavedPostCreationAttributes = Optional<SavedPostAttributes, 'id' | 'savedAt'>;

class SavedPost extends Model<SavedPostAttributes, SavedPostCreationAttributes> implements SavedPostAttributes {
  public id!: string;
  public userId!: string;
  public postId!: string;
  public savedAt!: Date;
}

SavedPost.init({
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
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'forum_posts',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  savedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'saved_posts',
  sequelize,
});

export default SavedPost;