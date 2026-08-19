const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GroupMember = sequelize.define(
  "GroupMember",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
groupId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "Groups",
  key: "id"
      }
    },
memberId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "Members",
  key: "id"
      }
    },
role: {type: DataTypes.ENUM("member", "admin", "moderator"),
  defaultValue: "member",
  allowNull: false
    },
status: {type: DataTypes.ENUM("active", "pending", "blocked"),
  defaultValue: "active",
  allowNull: false
    }
  },
  {timestamps: true
  },
);

module.exports = GroupMember;
