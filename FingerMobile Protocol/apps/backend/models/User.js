const { DataTypes } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30]
    },
    set(value) {
      this.setDataValue('username', value.trim().toLowerCase());
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    set(value) {
      this.setDataValue('email', value.trim().toLowerCase());
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING,
    field: 'last_name'
  },
  displayName: {
    type: DataTypes.VIRTUAL,
    get() {
      const first = this.getDataValue('firstName');
      const last = this.getDataValue('lastName');
      if (first || last) {
        return `${first || ''} ${last || ''}`.trim();
      }
      return this.getDataValue('username');
    }
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    field: 'email_verified'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    field: 'is_verified'
  },
  bio: {
    type: DataTypes.TEXT
  },
  avatarUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
    field: 'avatar_url'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'offline',
    field: 'online_status'
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
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_seen'
  }
}, {
  // Table configuration options
  tableName: 'users', // Reverted back to lowercase to match the actual DB table name created by the migration.
  timestamps: true,
  indexes: [
    {
      fields: ['email', 'username']
    },
    {
      fields: ['role']
    },
    {
      fields: ['createdAt']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }

});

// Compare password method
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Association method
User.associate = function(models) {
  // Define associations here
  User.hasMany(models.Group, { foreignKey: 'creatorId', as: 'createdGroups' });
  User.hasMany(models.GroupMembership, { foreignKey: 'userId', as: 'groupMemberships' });
};

module.exports = User;
