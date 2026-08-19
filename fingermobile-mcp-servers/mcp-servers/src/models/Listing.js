const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Listing = sequelize.define(
  "Listing",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
sellerId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
productId: {type: DataTypes.UUID,
  allowNull: true, // Can be null if it's a service or non-product listing,
  references: {,
  model: "Products",
  key: "id"
      }
    },
title: {type: DataTypes.STRING,
  allowNull: false
    },
description: {type: DataTypes.TEXT,
  allowNull: true
    },
price: {type: DataTypes.DECIMAL(10, 2),
  allowNull: false
    },
currency: {type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "USD"
    },
quantity: {type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 1
    },
status: {type: DataTypes.ENUM("active", "inactive", "sold", "pending", "archived"),
  defaultValue: "active"
    },
category: {type: DataTypes.STRING,
  allowNull: true
    },
imageUrl: {type: DataTypes.ARRAY(DataTypes.STRING),
  allowNull: true,
  defaultValue: []
    }
  },
  {timestamps: true
  },
);

module.exports = Listing;
