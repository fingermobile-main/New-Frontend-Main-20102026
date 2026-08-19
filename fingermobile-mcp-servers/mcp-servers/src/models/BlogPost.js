const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BlogPost = sequelize.define(
  "BlogPost",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
title: {type: DataTypes.STRING,
  allowNull: false,
  unique: true
    },
content: {type: DataTypes.TEXT,
  allowNull: false
    },
authorId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members", // Refers to the member model,
  key: "id"
      }
    },
categoryId: {type: DataTypes.UUID,
  allowNull: true, // Can be null if no category is assigned,
  references: {,
  model: "BlogCategories", // Refers to the BlogCategory model,
  key: "id"
      }
    },
status: {type: DataTypes.ENUM("draft", "published", "archived"),
  defaultValue: "draft"
    },
publishedAt: {type: DataTypes.DATE,
  allowNull: true
    },
imageUrl: {type: DataTypes.STRING,
  allowNull: true
    },
tags: {type: DataTypes.ARRAY(DataTypes.STRING),
  defaultValue: []
    }
  },
  {timestamps: true
  },
);

module.exports = BlogPost;
