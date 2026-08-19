const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GameProgress = sequelize.define(
  "GameProgress",
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
gameId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "Games",
  key: "id"
      }
    },
score: {type: DataTypes.INTEGER,
  defaultValue: 0
    },
level: {type: DataTypes.INTEGER,
  defaultValue: 1
    },
achievements: {type: DataTypes.JSONB,
  defaultValue: []
    },
lastPlayed: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
    }
  },
  {timestamps: true
  },
);

module.exports = GameProgress;
