const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ApiRateLimit = sequelize.define(
  "ApiRateLimit",
  {id: {,
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true
    },
apiKeyId: {type: DataTypes.INTEGER,
  allowNull: false,
  references: {,
  model: "api_keys",
  key: "id"
      },
onDelete: "CASCADE"
    },
endpoint: {type: DataTypes.STRING(255),
  allowNull: false
    },
requestsPerMinute: {type: DataTypes.INTEGER,
  allowNull: false
    }
  },
  {tableName: "api_rate_limits",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
  },
);

module.exports = ApiRateLimit;
