const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ForumPost = sequelize.define(
  "ForumPost",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
threadId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "ForumThreads",
  key: "id"
      }
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
    //,
Optional: parentPostId for replies,
parentPostId: {type: DataTypes.UUID,
  allowNull: true,
  references: {,
  model: "ForumPosts",
  key: "id"
      }
    }
  },
  {timestamps: true
  },
);

module.exports = ForumPost;
