const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Publication = sequelize.define(
  "Publication",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
title: {type: DataTypes.STRING,
  allowNull: false
    },
content: {type: DataTypes.TEXT,
  allowNull: false
    },
authorId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
status: {type: DataTypes.ENUM("draft", "pending_review", "published", "archived"),
  defaultValue: "draft",
  allowNull: false
    },
publishedAt: {type: DataTypes.DATE,
  allowNull: true
    },
contentType: {type: DataTypes.STRING,
  allowNull: false
    }, // e.g., 'blogPost', 'event', 'forumPost'
    // You can add more fields like tags, categories, etc.
  },
  {timestamps: true
  },
);

module.exports = Publication;
