const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

const Hallmark = sequelize.define('Hallmark', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  importanceLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    },
    field: 'importance_level'
  },
  imageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'image_url'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
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
  tableName: 'milestones',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['date']
    }
  ]
});

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  badgeUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'badge_url'
  },
  awardedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'awarded_date'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  pointsValue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'points_value'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
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
  tableName: 'achievements',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    }
  ]
});

const TimelineEntry = sequelize.define('TimelineEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  entryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'entry_date'
  },
  entryType: {
    type: DataTypes.ENUM('milestone', 'achievement', 'event'),
    allowNull: false,
    field: 'entry_type'
  },
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'related_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
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
  tableName: 'timeline_entries',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['entry_date']
    }
  ]
});

// Define associations
Hallmark.associate = function(models) {
  Hallmark.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

Achievement.associate = function(models) {
  Achievement.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

TimelineEntry.associate = function(models) {
  TimelineEntry.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Hallmark;
