import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ForumCategoryAttributes {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  parentCategoryId?: string;
  threadsCount: number;
  postsCount: number;
  latestPostId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

type ForumCategoryCreationAttributes = Optional<ForumCategoryAttributes, 'id' | 'threadsCount' | 'postsCount' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt'>;

class ForumCategory extends Model<ForumCategoryAttributes, ForumCategoryCreationAttributes> implements ForumCategoryAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public icon!: string;
  public color!: string;
  public parentCategoryId!: string;
  public threadsCount!: number;
  public postsCount!: number;
  public latestPostId!: string;
  public isActive!: boolean;
  public sortOrder!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ForumCategory.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
  parentCategoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'forum_categories',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  threadsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  postsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  latestPostId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'forum_posts',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'forum_categories',
  sequelize,
});

export default ForumCategory;