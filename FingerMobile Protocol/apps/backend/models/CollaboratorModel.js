'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Collaborator = sequelize.define(
    'Collaborator',
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'user_id',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      avatarUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'avatar_url',
      },
      status: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'Active',
      },
      statusDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'status_date',
      },
      locationType: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'ALL',
        field: 'location_type',
      },
    },
    {
      tableName: 'collaborators',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Collaborator.associate = (models) => {
    if (models.Role) {
      Collaborator.belongsToMany(models.Role, {
        through: 'collaborator_roles',
        foreignKey: 'collaborator_id',
        otherKey: 'role_id',
        as: 'roles',
      });
    }
  };

  return Collaborator;
};
