import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumSearchHistoryAttributes {
  id: string;
  userId: string;
  query: string;
  filters?: any;
  resultsCount: number;
  createdAt: Date;
}

type ForumSearchHistoryCreationAttributes = Optional<ForumSearchHistoryAttributes, 'id' | 'resultsCount' | 'createdAt'>;

class ForumSearchHistory extends Model<ForumSearchHistoryAttributes, ForumSearchHistoryCreationAttributes> implements ForumSearchHistoryAttributes {
  public id!: string;
  public userId!: string;
  public query!: string;
  public filters!: any;
  public resultsCount!: number;
  public createdAt!: Date;
}

ForumSearchHistory.init({
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
  query: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  filters: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  resultsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'forum_search_history',
  sequelize,
});

export default ForumSearchHistory;