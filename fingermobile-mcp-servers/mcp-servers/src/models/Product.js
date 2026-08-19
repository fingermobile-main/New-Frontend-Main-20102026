const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
name: {type: DataTypes.STRING,
  allowNull: false
    },
description: {type: DataTypes.TEXT,
  allowNull: false
    },
price: {type: DataTypes.DECIMAL(10, 2),
  allowNull: false
    },
sellerId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
category: {type: DataTypes.STRING,
  allowNull: true
    },
imageUrl: {type: DataTypes.STRING,
  allowNull: true
    },
stock: {type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 0
    },
status: {type: DataTypes.ENUM("available", "out_of_stock", "discontinued"),
  defaultValue: "available",
  allowNull: false
    }
  },
  {timestamps: true,
  indexes: [{,
  fields: ["sellerId"] }, {fields: ["category"] }]
  },
);

module.exports = Product;
