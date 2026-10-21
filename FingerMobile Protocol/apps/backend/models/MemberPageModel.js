'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MemberPage = sequelize.define(
    'MemberPage',
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
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      isRestricted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_restricted',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'member_pages',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  MemberPage.associate = (models) => {
    if (models.MemberRole) {
      MemberPage.belongsToMany(models.MemberRole, {
        through: 'member_role_page_access',
        foreignKey: 'page_id',
        otherKey: 'member_role_id',
        as: 'allowedRoles',
      });
    }
    if (models.MemberBadge) {
      MemberPage.belongsToMany(models.MemberBadge, {
        through: 'member_badge_page_access',
        foreignKey: 'page_id',
        otherKey: 'badge_id',
        as: 'allowedBadges',
      });
    }
  };

  return MemberPage;
};
