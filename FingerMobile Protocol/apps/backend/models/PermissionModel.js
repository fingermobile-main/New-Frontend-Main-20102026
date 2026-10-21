'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      module: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'permissions',
      timestamps: false,
    }
  );

  Permission.associate = (models) => {
    if (models.Role) {
      Permission.belongsToMany(models.Role, {
        through: 'role_permissions',
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles',
      });
    }
  };

  return Permission;
};
