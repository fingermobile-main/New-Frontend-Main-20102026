const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Content = sequelize.define(
  "Content",
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
title: {type: DataTypes.STRING,
  allowNull: false
    },
description: {type: DataTypes.TEXT,
  allowNull: true
    },
contentType: {type: DataTypes.ENUM("video", "image", "text", "audio"),
  allowNull: false
    },
contentUrl: {type: DataTypes.STRING,
  allowNull: true
    },
thumbnailUrl: {type: DataTypes.STRING,
  allowNull: true
    },
tags: {type: DataTypes.ARRAY(DataTypes.STRING),
  allowNull: true,
  defaultValue: []
    },
status: {type: DataTypes.ENUM("draft", "published", "archived", "pending_review"),
  defaultValue: "draft"
    },
views: {type: DataTypes.INTEGER,
  defaultValue: 0
    },
likes: {type: DataTypes.INTEGER,
  defaultValue: 0
    },
dislikes: {type: DataTypes.INTEGER,
  defaultValue: 0
    },
commentsCount: {type: DataTypes.INTEGER,
  defaultValue: 0
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["memberId"] },
      {fields: ["contentType"] },
      {fields: ["status"] }
    ]
  },
);

module.exports = Content;
