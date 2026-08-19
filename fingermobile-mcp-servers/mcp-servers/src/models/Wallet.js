/* global require, module */
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Wallet = sequelize.define("Wallet", {id: {,
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
balance: {type: DataTypes.DECIMAL(10, 2),
  defaultValue: 0.0,
  allowNull: false
  },
createdAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
  },
updatedAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
  }
});

Wallet.findBymemberId = async function (memberId) {
  try {
    return await this.findOne({where: {,
  memberId: memberId }
    });
  } catch (error) {
    console.error("Error finding wallet by member,
ID:", error);
    return null;
  }
};

module.exports = Wallet;
