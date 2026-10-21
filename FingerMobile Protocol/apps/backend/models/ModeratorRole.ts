import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ModeratorRoleAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

type ModeratorRoleCreationAttributes = Optional<ModeratorRoleAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

class ModeratorRole extends Model<ModeratorRoleAttributes, ModeratorRoleCreationAttributes> implements ModeratorRoleAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ModeratorRole.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'user',
    validate: {
      isIn: [['admin', 'moderator', 'user']],
    },
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
  tableName: 'moderator_roles',
  sequelize,
});

export default ModeratorRole;