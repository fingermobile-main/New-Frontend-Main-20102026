const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Profile = sequelize.define(
  "Profile",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
memberId: {type: DataTypes.UUID,
  allowNull: false,
  unique: true,
  references: {,
  model: "members",
  key: "id"
      }
    },
bio: {type: DataTypes.TEXT,
  allowNull: true
    },
avatarUrl: {type: DataTypes.STRING,
  allowNull: true
    },
location: {type: DataTypes.STRING,
  allowNull: true
    },
website: {type: DataTypes.STRING,
  allowNull: true
    },
socialLinks: {type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: {}
    },
interests: {type: DataTypes.ARRAY(DataTypes.STRING),
  allowNull: true,
  defaultValue: []
    },
    // Add other profile-specific fields as needed
  },
  {timestamps: true
  },
);

module.exports = Profile;
