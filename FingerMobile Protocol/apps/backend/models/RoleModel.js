'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: 'CUSTOM',
      },
      isSystemDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_system_default',
      },
      assignedUsersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'assigned_users_count',
      },
    },
    {
      tableName: 'roles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Role.associate = (models) => {
    if (models.Permission) {
      Role.belongsToMany(models.Permission, {
        through: 'role_permissions',
        foreignKey: 'role_id',
        otherKey: 'permission_id',
        as: 'permissions',
      });
    }
    if (models.Collaborator) {
      Role.belongsToMany(models.Collaborator, {
        through: 'collaborator_roles',
        foreignKey: 'role_id',
        otherKey: 'collaborator_id',
        as: 'collaborators',
      });
    }
  };

  return Role;
};
