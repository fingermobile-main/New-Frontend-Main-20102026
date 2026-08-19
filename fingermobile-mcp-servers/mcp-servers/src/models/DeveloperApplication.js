const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DeveloperApplication = sequelize.define(
  "DeveloperApplication",
  {id: {,
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true
    },
memberId: {type: DataTypes.INTEGER,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      },
onDelete: "CASCADE"
    },
name: {type: DataTypes.STRING(255),
  allowNull: false
    },
description: {type: DataTypes.TEXT,
  allowNull: true
    },
apiKeyPrefix: {type: DataTypes.STRING(255),
  allowNull: true,
  unique: true
    }
  },
  {tableName: "developer_applications",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
  },
);

module.exports = DeveloperApplication;
