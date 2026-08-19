const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Forum = sequelize.define(
  "Forum",
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
    //,
Optional: category for forums if needed
    //,
categoryId: {
    //,
type: DataTypes.UUID,
    //,
allowNull: true,
    //,
references: {
    //,
model: 'ForumCategories',
    //,
key: 'id'
    //   }
    // }
  },
  {timestamps: true
  },
);

module.exports = Forum;
