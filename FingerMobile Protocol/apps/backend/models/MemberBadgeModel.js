'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MemberBadge = sequelize.define(
    'MemberBadge',
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      iconSvg: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'icon_svg',
      },
      iconUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'icon_url',
      },
      bgColor: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: '#1E293B',
        field: 'bg_color',
      },
      textColor: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: '#FFFFFF',
        field: 'text_color',
      },
      badgeAccessEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'badge_access_enabled',
      },
      assignedMembersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'assigned_members_count',
      },
    },
    {
      tableName: 'member_badges',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  MemberBadge.associate = (models) => {
    if (models.MemberPage) {
      MemberBadge.belongsToMany(models.MemberPage, {
        through: 'member_badge_page_access',
        foreignKey: 'badge_id',
        otherKey: 'page_id',
        as: 'accessiblePages',
      });
    }
  };

  return MemberBadge;
};
