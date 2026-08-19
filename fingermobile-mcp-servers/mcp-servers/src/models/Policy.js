const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Policy = sequelize.define(
  "Policy",
  {id: {,
  type: DataTypes.UUID, // Use UUID for policy IDs,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
name: {type: DataTypes.STRING,
  allowNull: false,
  unique: true
    },
description: {type: DataTypes.TEXT,
  allowNull: true
    },
rules: {type: DataTypes.JSONB, // Store policy rules as JSONB,
  allowNull: false
    }
  },
  {timestamps: true
  },
);

module.exports = Policy;
