const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FAQ = sequelize.define(
  "FAQ",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
question: {type: DataTypes.TEXT,
  allowNull: false
    },
answer: {type: DataTypes.TEXT,
  allowNull: false
    },
category: {type: DataTypes.STRING,
  allowNull: true
    },
keywords: {type: DataTypes.ARRAY(DataTypes.STRING),
  allowNull: true
    }
  },
  {timestamps: true
  },
);

module.exports = FAQ;
