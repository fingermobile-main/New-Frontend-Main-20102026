const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { encrypt, decrypt } = require("../utils/encryptionUtils");

const Member = sequelize.define(
  "Member",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
membername: {type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {,
  len: [3, 30]
      }
    },
email: {type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {,
  isEmail: true
      },
      set(value) {
        this.setDataValue("email", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("email");
        return rawValue ? decrypt(rawValue) : null;
      }
    },
passwordHash: {type: DataTypes.STRING,
  allowNull: false
    },
role: {type: DataTypes.STRING,
  defaultValue: "member",
  allowNull: false
    },
profilePictureUrl: {type: DataTypes.STRING,
  allowNull: true
    },
subscriptionStatus: {type: DataTypes.ENUM("active", "inactive", "trialing"),
  defaultValue: "trialing"
    },
subscriptionExpiryDate: {type: DataTypes.DATE,
  allowNull: true
    },
twoFactorEnabled: {type: DataTypes.BOOLEAN,
  defaultValue: false,
  allowNull: false
    },
twoFactorSecret: {type: DataTypes.STRING,
  allowNull: true
    },
backupCodes: {type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: []
    },
backupCodesGeneratedAt: {type: DataTypes.DATE,
  allowNull: true
    },
createdAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
    },
updatedAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
    },
consentPreferences: {type: DataTypes.JSONB,
  defaultValue: {},
allowNull: false
    },
isDeleted: {type: DataTypes.BOOLEAN,
  defaultValue: false,
  allowNull: false
    }
  },
  {tableName: "members",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
      {,
  unique: true,
  fields: ["membername"] },
      {unique: true,
  fields: ["email"] }
    ]
  },
);

Member.prototype.softDelete = async function () {
  this.isDeleted = true;
  this.email = `erased_${this.id}@example.com`;
  this.membername = `erased_member_${this.id}`;
  this.passwordHash = "";
  await this.save();
};

Member.findByEmail = async function (email) {
  try {
    return await this.findOne({where: {,
  email: encrypt(email),
  isDeleted: false }
    });
  } catch (error) {
    console.error("Error finding member by,
email:", error);
    return null;
  }
};

Member.findById = async function (id) {
  try {
    return await this.findOne({where: {,
  id: id,
  isDeleted: false }
    });
  } catch (error) {
    console.error("Error finding member by,
ID:", error);
    return null;
  }
};

module.exports = Member;
