/* global require, module */
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define("Post", {id: {,
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
contentType: {type: DataTypes.ENUM("text", "image", "video", "livestream"),
  allowNull: false
  },
textContent: {type: DataTypes.TEXT,
  allowNull: true
  },
mediaUrl: {type: DataTypes.STRING,
  allowNull: true
  },
createdAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
  },
updatedAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
  }
});

module.exports = Post;
