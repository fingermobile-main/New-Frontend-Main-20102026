const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TermsAndConditions = sequelize.define(
  "TermsAndConditions",
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
effectiveDate: {type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW
    }
  },
  {timestamps: true
  },
);

module.exports = TermsAndConditions;
