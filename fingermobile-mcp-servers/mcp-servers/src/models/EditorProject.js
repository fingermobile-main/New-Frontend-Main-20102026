const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Member = require("./Member");

const EditorProject = sequelize.define("EditorProject", {id: {,
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
  },
memberId: {type: DataTypes.UUID,
  allowNull: false,
  references: {,
  model: Member, // This is a reference to the Member model,
  key: "id"
    }
  },
name: {type: DataTypes.STRING,
  allowNull: false
  },
description: {type: DataTypes.TEXT,
  allowNull: true
  },
  // Store project configuration as JSONB for flexibility,
configuration: {type: DataTypes.JSONB,
  allowNull: false,
  defaultValue: {}
  },
  // Store the path to the project's root directory within the repository,
projectPath: {type: DataTypes.STRING,
  allowNull: false
  },
createdAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
  },
updatedAt: {type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
  }
});

// Establish the association
Member.hasMany(EditorProject, {foreignKey: "memberId",
  as: "editorProjects" });
EditorProject.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

module.exports = EditorProject;
