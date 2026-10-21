const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const GroupMembership = sequelize.define('GroupMembership', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  role: {
    type: DataTypes.ENUM('admin', 'moderator', 'member'),
    allowNull: false,
    defaultValue: 'member'
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'banned'),
    allowNull: false,
    defaultValue: 'pending'
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'group_memberships',
  timestamps: true,
  indexes: [{
    fields: ['groupId']
  }, {
    fields: ['userId']
  }, {
    fields: ['role']
  }, {
    fields: ['status']
  }, {
    fields: ['groupId', 'userId'] // Composite index for unique membership lookups
  }]
});

// Association method
GroupMembership.associate = function(models) {
  // Define associations here
  GroupMembership.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
  GroupMembership.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = GroupMembership;
