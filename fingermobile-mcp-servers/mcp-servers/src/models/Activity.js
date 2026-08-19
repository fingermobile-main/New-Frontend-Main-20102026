const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Activity = sequelize.define(
  "Activity",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
memberId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
targetType: {type: DataTypes.ENUM(
        "post",
  "comment",
  "like",
  "follow",
  "share",
  "profile_update",
  "content_upload",
  ),
  allowNull: false
    },
targetId: {type: DataTypes.UUID,
  allowNull: true
    },
action: {type: DataTypes.STRING,
  allowNull: false
    },
metadata: {type: DataTypes.JSONB,
  allowNull: true
    },
visibility: {type: DataTypes.ENUM("public", "friends", "private"),
  defaultValue: "public",
  allowNull: false
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["memberId"]
      },
      {fields: ["targetType"]
      },
      {fields: ["visibility"]
      },
      {fields: ["createdAt"]
      }
    ]
  },
);

module.exports = Activity;
