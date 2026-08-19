const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Connection = sequelize.define(
  "Connection",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
requesterId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
recipientId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
status: {type: DataTypes.ENUM("pending", "accepted", "blocked", "rejected"),
  defaultValue: "pending",
  allowNull: false
    },
relationshipType: {type: DataTypes.ENUM("friend", "follower", "contact"),
  defaultValue: "friend",
  allowNull: false
    },
blockedBy: {type: DataTypes.UUID,
  allowNull: true,
  references: {,
  model: "members",
  key: "id"
      }
    }
  },
  {timestamps: true,
  indexes: [
      {,
  unique: true,
  fields: ["requesterId", "recipientId"]
      },
      {fields: ["requesterId"]
      },
      {fields: ["recipientId"]
      },
      {fields: ["status"]
      }
    ]
  },
);

module.exports = Connection;
