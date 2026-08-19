const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Session = sequelize.define(
  "Session",
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
refreshToken: {type: DataTypes.STRING,
  allowNull: false,
  unique: true
    },
memberAgent: {type: DataTypes.TEXT,
  allowNull: true
    },
ipAddress: {type: DataTypes.STRING,
  allowNull: true
    },
expiresAt: {type: DataTypes.DATE,
  allowNull: false
    },
isActive: {type: DataTypes.BOOLEAN,
  defaultValue: true,
  allowNull: false
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["memberId"]
      },
      {fields: ["refreshToken"]
      },
      {fields: ["expiresAt"]
      },
      {fields: ["isActive"]
      }
    ]
  },
);

module.exports = Session;
