'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MemberRole = sequelize.define(
    'MemberRole',
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assignedMembersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'assigned_members_count',
      },
      accessiblePagesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'accessible_pages_count',
      },
    },
    {
      tableName: 'member_roles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  MemberRole.associate = (models) => {
    if (models.MemberPage) {
      MemberRole.belongsToMany(models.MemberPage, {
        through: 'member_role_page_access',
        foreignKey: 'member_role_id',
        otherKey: 'page_id',
        as: 'accessiblePages',
      });
    }
  };

  return MemberRole;
};
