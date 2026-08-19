const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Game = sequelize.define(
  "Game",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
name: {type: DataTypes.STRING,
  allowNull: false,
  unique: true
    },
description: {type: DataTypes.TEXT,
  allowNull: true
    },
genre: {type: DataTypes.STRING,
  allowNull: true
    },
platform: {type: DataTypes.ARRAY(DataTypes.STRING),
  allowNull: true,
  defaultValue: []
    },
releaseDate: {type: DataTypes.DATEONLY,
  allowNull: true
    },
developer: {type: DataTypes.STRING,
  allowNull: true
    },
publisher: {type: DataTypes.STRING,
  allowNull: true
    },
imageUrl: {type: DataTypes.STRING,
  allowNull: true
    },
rating: {type: DataTypes.FLOAT,
  defaultValue: 0.0
    },
price: {type: DataTypes.DECIMAL(10, 2),
  defaultValue: 0.0
    }
  },
  {timestamps: true,
  indexes: [
      {,
  fields: ["genre"] },
      {fields: ["platform"] },
      {fields: ["releaseDate"] }
    ]
  },
);

module.exports = Game;
