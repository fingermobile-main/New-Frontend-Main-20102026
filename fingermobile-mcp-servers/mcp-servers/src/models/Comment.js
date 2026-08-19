const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define(
  "Comment",
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
contentId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "Content",
  key: "id"
      }
    },
parentId: {type: DataTypes.UUID,
  allowNull: true, // For replies to other comments,
  references: {,
  model: "Comments",
  key: "id"
      }
    },
commentText: {type: DataTypes.TEXT,
  allowNull: false
    },
status: {type: DataTypes.ENUM("active", "pending_review", "deleted"),
  defaultValue: "active"
    }
  },
  {timestamps: true
  },
);

module.exports = Comment;
