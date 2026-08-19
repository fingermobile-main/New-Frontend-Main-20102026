const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DataSubjectRequest = sequelize.define(
  "DataSubjectRequest",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
memberId: {type: DataTypes.UUID,
  allowNull: false
    },
requestType: {type: DataTypes.ENUM(
        "access",
  "rectification",
  "erasure",
  "restriction",
  "portability",
  "objection",
  ),
  allowNull: false
    },
description: {type: DataTypes.TEXT,
  allowNull: true
    },
status: {type: DataTypes.ENUM("pending", "in_progress", "completed", "rejected"),
  defaultValue: "pending",
  allowNull: false
    }
  },
  {timestamps: true
  },
);

module.exports = DataSubjectRequest;
