const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  privacy: {
    type: DataTypes.ENUM('public', 'private', 'unlisted'),
    defaultValue: 'public',
    allowNull: false
  },
  memberCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    field: 'member_count'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'members',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  locationPoint: {
    type: DataTypes.GEOMETRY('POINT', 4326),
    allowNull: true,
    field: 'location_point'
  },
  locationAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'location_address'
  },
  locationHeatmap: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'location_heatmap'
  },
  locationUpdatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'location_updated_at'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'groups',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['created_by']
    }
  ]
});

const GroupMember = sequelize.define('GroupMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'group_id',
    references: {
      model: 'groups',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'member_id',
    references: {
      model: 'members',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  role: {
    type: DataTypes.ENUM('member', 'moderator', 'admin', 'owner'),
    defaultValue: 'member',
    allowNull: false
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'joined_at'
  }
}, {
  tableName: 'group_members',
  timestamps: false, // No updatedAt in this table
  underscored: true,
  indexes: [
    {
      fields: ['group_id']
    },
    {
      fields: ['member_id']
    }
  ],
  uniqueKeys: {
    unique_group_member: {
      fields: ['group_id', 'member_id']
    }
  }
});

const GroupInvitation = sequelize.define('GroupInvitation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'group_id',
    references: {
      model: 'groups',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  inviterId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'inviter_id',
    references: {
      model: 'members',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  inviteeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'invitee_id',
    references: {
      model: 'members',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined'),
    defaultValue: 'pending',
    allowNull: false
  },
  invitedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'invited_at'
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'responded_at'
  }
}, {
  tableName: 'group_invitations',
  timestamps: false, // No createdAt/updatedAt in this table
  underscored: true,
  indexes: [
    {
      fields: ['group_id']
    },
    {
      fields: ['inviter_id']
    },
    {
      fields: ['invitee_id']
    }
  ]
});

const GroupRequest = sequelize.define('GroupRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'group_id',
    references: {
      model: 'groups',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'requester_id',
    references: {
      model: 'members',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  requestedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'requested_at'
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'responded_at'
  }
}, {
  tableName: 'group_requests',
  timestamps: false, // No createdAt/updatedAt in this table
  underscored: true,
  indexes: [
    {
      fields: ['group_id']
    },
    {
      fields: ['requester_id']
    }
  ]
});

// Define associations
Group.associate = function(models) {
  Group.belongsTo(models.Member, { foreignKey: 'createdBy', as: 'creator' });
  Group.hasMany(GroupMember, { foreignKey: 'groupId', as: 'memberships' });
  Group.hasMany(GroupInvitation, { foreignKey: 'groupId', as: 'invitations' });
  Group.hasMany(GroupRequest, { foreignKey: 'groupId', as: 'requests' });
};

GroupMember.associate = function(models) {
  GroupMember.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
  GroupMember.belongsTo(models.Member, { foreignKey: 'memberId', as: 'member' });
};

GroupInvitation.associate = function(models) {
  GroupInvitation.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
  GroupInvitation.belongsTo(models.Member, { foreignKey: 'inviterId', as: 'inviter' });
  GroupInvitation.belongsTo(models.Member, { foreignKey: 'inviteeId', as: 'invitee' });
};

GroupRequest.associate = function(models) {
  GroupRequest.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
  GroupRequest.belongsTo(models.Member, { foreignKey: 'requesterId', as: 'requester' });
};

module.exports = Group;
