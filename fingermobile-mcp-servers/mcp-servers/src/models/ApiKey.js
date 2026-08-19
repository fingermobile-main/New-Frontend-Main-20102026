const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ApiKey = sequelize.define(
  "ApiKey",
  {id: {,
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true
    },
applicationId: {type: DataTypes.INTEGER,
  allowNull: false,
  references: {,
  model: "developer_applications",
  key: "id"
      },
onDelete: "CASCADE"
    },
keySecret: {type: DataTypes.STRING(255),
  allowNull: false
    },
permissions: {type: DataTypes.JSONB,
  allowNull: true
    },
rateLimitPerMinute: {type: DataTypes.INTEGER,
  defaultValue: 60
    },
expiresAt: {type: DataTypes.DATE,
  allowNull: true
    }
  },
  {tableName: "api_keys",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
  },
);

module.exports = ApiKey;
