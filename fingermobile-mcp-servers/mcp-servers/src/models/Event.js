const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define(
  "Event",
  {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
    },
title: {type: DataTypes.STRING,
  allowNull: false
    },
description: {type: DataTypes.TEXT,
  allowNull: true
    },
startTime: {type: DataTypes.DATE,
  allowNull: false
    },
endTime: {type: DataTypes.DATE,
  allowNull: false
    },
location: {type: DataTypes.STRING,
  allowNull: true
    },
creatorId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: "members",
  key: "id"
      }
    },
    //,
Optional: group association if events can be tied to groups,
groupId: {type: DataTypes.UUID,
  allowNull: true,
  references: {,
  model: "Groups",
  key: "id"
      }
    }
  },
  {timestamps: true
  },
);

module.exports = Event;
