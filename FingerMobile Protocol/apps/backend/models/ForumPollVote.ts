import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumPollVoteAttributes {
  id: string;
  userId: string;
  threadId: string;
  optionIndex: number;
  createdAt: Date;
}

type ForumPollVoteCreationAttributes = Optional<ForumPollVoteAttributes, 'id' | 'createdAt'>;

class ForumPollVote extends Model<ForumPollVoteAttributes, ForumPollVoteCreationAttributes> implements ForumPollVoteAttributes {
  public id!: string;
  public userId!: string;
  public threadId!: string;
  public optionIndex!: number;
  public createdAt!: Date;
}

ForumPollVote.init({
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
  optionIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'forum_poll_votes',
  sequelize,
});

export default ForumPollVote;