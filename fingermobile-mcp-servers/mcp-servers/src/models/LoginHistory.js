const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LoginHistory = sequelize.define(
  "LoginHistory",
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
ipAddress: {type: DataTypes.STRING,
  allowNull: true
    },
memberAgent: {type: DataTypes.TEXT,
  allowNull: true
    },
location: {type: DataTypes.STRING,
  allowNull: true
    },
device: {type: DataTypes.STRING,
  allowNull: true
    },
browser: {type: DataTypes.STRING,
  allowNull: true
    },
status: {type: DataTypes.ENUM("success", "failed"),
  allowNull: false
    },
failureReason: {type: DataTypes.STRING,
  allowNull: true
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["memberId"]
      },
      {fields: ["ipAddress"]
      },
      {fields: ["status"]
      },
      {fields: ["createdAt"]
      }
    ]
  },
);

module.exports = LoginHistory;
