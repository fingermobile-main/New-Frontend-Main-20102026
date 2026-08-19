const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Analytics = sequelize.define(
  "Analytics",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
eventType: {type: DataTypes.STRING,
  allowNull: false
    },
eventData: {type: DataTypes.JSONB,
  allowNull: true
    },
memberId: {type: DataTypes.UUID,
  allowNull: true, // Allow null for events not tied to a specific member,
  references: {,
  model: "members",
  key: "id"
      }
    },
timestamp: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
    }
  },
  {timestamps: false, // We have a custom timestamp field,
  indexes: [
      {,
  fields: ["memberId"] },
      {fields: ["eventType"] },
      {fields: ["timestamp"] }
    ]
  },
);

module.exports = Analytics;
