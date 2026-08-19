const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Group = sequelize.define(
  "Group",
  {id: {,
  type: DataTypes.UUID,
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
creatorId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
privacySettings: {type: DataTypes.ENUM("public", "private", "hidden"),
  defaultValue: "public",
  allowNull: false
    }
  },
  {timestamps: true
  },
);

module.exports = Group;
