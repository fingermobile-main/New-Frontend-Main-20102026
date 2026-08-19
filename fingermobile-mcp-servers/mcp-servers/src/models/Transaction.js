/* global require, module */
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { encrypt, decrypt } = require("../utils/encryptionUtils");

const Transaction = sequelize.define(
  "Transaction",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
senderId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
receiverId: {type: DataTypes.UUID,
  allowNull: true,
  references: {,
  model: "members",
  key: "id"
      }
    },
amount: {type: DataTypes.DECIMAL(10, 2),
  allowNull: false
    },
type: {type: DataTypes.ENUM(
        "deposit",
  "withdrawal",
  "purchase",
  "refund",
  "transfer",
  "signup_bonus",
  "post_monetization",
  "subscription_purchase",
  "gift_received",
  "gift_sent",
  "content_purchase",
  ),
  allowNull: false
    },
status: {type: DataTypes.ENUM("pending", "completed", "failed", "reversed"),
  defaultValue: "pending"
    },
description: {type: DataTypes.STRING,
  allowNull: true,
  set(value) {
        this.setDataValue("description",
  encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("description");
        return rawValue ? decrypt(rawValue) : null;
      }
    },
referenceId: {type: DataTypes.STRING,
  allowNull: true,
  unique: true
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["senderId"] },
      {fields: ["receiverId"] },
      {fields: ["type"] }
    ]
  },
);

module.exports = Transaction;
