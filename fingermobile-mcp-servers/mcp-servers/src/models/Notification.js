const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
  "Notification",
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
type: {type: DataTypes.ENUM(
        "like",
  "comment",
  "follow",
  "mention",
  "message",
  "system",
  ),
  allowNull: false
    },
title: {type: DataTypes.STRING,
  allowNull: false
    },
message: {type: DataTypes.TEXT,
  allowNull: false
    },
relatedEntityType: {type: DataTypes.STRING,
  allowNull: true
    },
relatedEntityId: {type: DataTypes.UUID,
  allowNull: true
    },
isRead: {type: DataTypes.BOOLEAN,
  defaultValue: false,
  allowNull: false
    },
isArchived: {type: DataTypes.BOOLEAN,
  defaultValue: false,
  allowNull: false
    },
priority: {type: DataTypes.ENUM("low", "medium", "high"),
  defaultValue: "medium",
  allowNull: false
    },
metadata: {type: DataTypes.JSONB,
  allowNull: true
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["memberId"]
      },
      {fields: ["type"]
      },
      {fields: ["isRead"]
      },
      {fields: ["isArchived"]
      },
      {fields: ["priority"]
      },
      {fields: ["createdAt"]
      }
    ]
  },
);

module.exports = Notification;
