const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define(
  "Message",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
senderId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
receiverId: {type: DataTypes.UUID,
  allowNull: true, // Can be null for group messages or system messages,
  references: {,
  model: "members",
  key: "id"
      }
    },
groupId: {type: DataTypes.UUID,
  allowNull: true, // Can be null for direct messages,
  references: {,
  model: "Groups",
  key: "id"
      }
    },
content: {type: DataTypes.TEXT,
  allowNull: false
    },
readStatus: {type: DataTypes.BOOLEAN,
  defaultValue: false
    },
    //,
Optional: type of message (e.g., 'text', 'image', 'video', 'system'),
messageType: {type: DataTypes.STRING,
  defaultValue: "text"
    },
    // Add conversation identifier for direct messages,
conversationId: {type: DataTypes.UUID,
  allowNull: true
    },
    // Add metadata for attachments, etc.,
metadata: {type: DataTypes.JSONB,
  allowNull: true
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["senderId"]
      },
      {fields: ["receiverId"]
      },
      {fields: ["groupId"]
      },
      {fields: ["conversationId"]
      },
      {fields: ["readStatus"]
      },
      {fields: ["createdAt"]
      }
    ]
  },
);

module.exports = Message;
