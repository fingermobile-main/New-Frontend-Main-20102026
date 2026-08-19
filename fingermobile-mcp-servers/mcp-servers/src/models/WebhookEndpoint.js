const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WebhookEndpoint = sequelize.define(
  "WebhookEndpoint",
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
eventType: {type: DataTypes.STRING(255),
  allowNull: false
    },
url: {type: DataTypes.TEXT,
  allowNull: false
    },
secret: {type: DataTypes.STRING(255),
  allowNull: true
    },
isActive: {type: DataTypes.BOOLEAN,
  defaultValue: true
    }
  },
  {tableName: "webhook_endpoints",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
  },
);

module.exports = WebhookEndpoint;
