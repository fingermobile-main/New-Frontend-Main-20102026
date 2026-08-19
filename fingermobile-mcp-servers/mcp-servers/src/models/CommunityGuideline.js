const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityGuideline = sequelize.define(
  "CommunityGuideline",
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
category: {type: DataTypes.STRING,
  allowNull: true
    }
  },
  {timestamps: true
  },
);

module.exports = CommunityGuideline;
