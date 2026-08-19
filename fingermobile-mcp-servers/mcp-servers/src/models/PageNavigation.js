const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PageNavigation = sequelize.define(
  "PageNavigation",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
memberId: {type: DataTypes.UUID,
  allowNull: true, // Allow null for anonymous members,
  references: {,
  model: "members",
  key: "id"
      }
    },
sessionId: {type: DataTypes.UUID,
  allowNull: true,
  references: {,
  model: "Sessions",
  key: "id"
      }
    },
pageUrl: {type: DataTypes.STRING,
  allowNull: false
    },
pageTitle: {type: DataTypes.STRING,
  allowNull: true
    },
referrerUrl: {type: DataTypes.STRING,
  allowNull: true
    },
memberAgent: {type: DataTypes.TEXT,
  allowNull: true
    },
ipAddress: {type: DataTypes.STRING,
  allowNull: true
    },
screenWidth: {type: DataTypes.INTEGER,
  allowNull: true
    },
screenHeight: {type: DataTypes.INTEGER,
  allowNull: true
    },
viewportWidth: {type: DataTypes.INTEGER,
  allowNull: true
    },
viewportHeight: {type: DataTypes.INTEGER,
  allowNull: true
    },
scrollDepth: {type: DataTypes.INTEGER,
  allowNull: true,
  defaultValue: 0
    },
timeOnPage: {type: DataTypes.INTEGER, // Time in milliseconds,
  allowNull: true,
  defaultValue: 0
    },
eventType: {type: DataTypes.ENUM("page_view", "page_exit", "scroll", "click"),
  defaultValue: "page_view",
  allowNull: false
    },
metadata: {type: DataTypes.JSONB,
  allowNull: true
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["memberId"]
      },
      {fields: ["sessionId"]
      },
      {fields: ["pageUrl"]
      },
      {fields: ["eventType"]
      },
      {fields: ["createdAt"]
      },
      {fields: ["referrerUrl"]
      }
    ]
  },
);

module.exports = PageNavigation;
