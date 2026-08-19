const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HelpArticle = sequelize.define(
  "HelpArticle",
  {id: {,
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true
    },
title: {type: DataTypes.STRING,
  allowNull: false
    },
content: {type: DataTypes.TEXT,
  allowNull: false
    },
category: {type: DataTypes.STRING,
  allowNull: true
    },
keywords: {type: DataTypes.STRING,
  allowNull: true
    }
  },
  {timestamps: true
  },
);

module.exports = HelpArticle;
