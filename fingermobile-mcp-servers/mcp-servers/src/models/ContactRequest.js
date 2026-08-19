const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ContactRequest = sequelize.define(
  "ContactRequest",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
name: {type: DataTypes.STRING,
  allowNull: false
    },
email: {type: DataTypes.STRING,
  allowNull: false,
  validate: {,
  isEmail: true
      }
    },
subject: {type: DataTypes.STRING,
  allowNull: false
    },
message: {type: DataTypes.TEXT,
  allowNull: false
    },
status: {type: DataTypes.ENUM("pending", "in_progress", "resolved", "closed"),
  defaultValue: "pending",
  allowNull: false
    }
  },
  {timestamps: true
  },
);

module.exports = ContactRequest;
