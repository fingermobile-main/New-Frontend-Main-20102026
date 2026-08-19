const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WebhookDelivery = sequelize.define(
  "WebhookDelivery",
  {id: {,
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true
    },
webhookEndpointId: {type: DataTypes.INTEGER,
  allowNull: false,
  references: {,
  model: "webhook_endpoints",
  key: "id"
      },
onDelete: "CASCADE"
    },
eventType: {type: DataTypes.STRING(255),
  allowNull: false
    },
payload: {type: DataTypes.JSONB,
  allowNull: false
    },
responseStatus: {type: DataTypes.INTEGER,
  allowNull: true
    },
responseBody: {type: DataTypes.TEXT,
  allowNull: true
    },
deliveredAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
    }
  },
  {tableName: "webhook_deliveries",
  timestamps: false
  },
);

module.exports = WebhookDelivery;
