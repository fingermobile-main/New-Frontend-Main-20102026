const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ForumThread = sequelize.define(
  "ForumThread",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
forumId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "Forums",
  key: "id"
      }
    },
title: {type: DataTypes.STRING,
  allowNull: false
    },
memberId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
content: {type: DataTypes.TEXT,
  allowNull: false
    },
status: {type: DataTypes.ENUM("open", "closed", "locked"),
  defaultValue: "open"
    },
isPinned: {type: DataTypes.BOOLEAN,
  defaultValue: false
    }
  },
  {timestamps: true
  },
);

module.exports = ForumThread;
