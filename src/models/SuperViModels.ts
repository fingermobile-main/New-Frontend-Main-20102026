/*
 * NOTE: This file contains Sequelize models, which are intended for the backend Node.js application.
 * They should not be present in the frontend React/TypeScript project.
 * This file has been commented out to prevent compilation errors.
 */

// import React from 'react';
// import { Model, DataTypes } from "sequelize";
// import sequelize from '../database/connection'; // Assuming Sequelize connection
//
// // Define the Optional utility type locally
// type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
//
// // Game Session Model
// interface SuperViGameSessionAttributes {
//   id: string;
//   memberId: string;
//   score: number;
//   level: number;
//   timePlayed: number;
//   startTime: Date;
//   endTime?: Date;
//   isActive: boolean;
// }
//
// type SuperViGameSessionCreationAttributes = Optional<
//   SuperViGameSessionAttributes,
//   "id" | "score" | "level" | "timePlayed" | "startTime" | "isActive"
// >;
//
// class SuperViGameSession
//   extends Model<
//     SuperViGameSessionAttributes,
//     SuperViGameSessionCreationAttributes
//   >
//   implements SuperViGameSessionAttributes
// {
//   declare id: string;
//   declare memberId: string;
//   declare score: number;
//   declare level: number;
//   declare timePlayed: number;
//   declare startTime: Date;
//   declare endTime?: Date;
//   declare isActive: boolean;
//
//   // timestamps!
//   declare readonly createdAt: Date;
//   declare readonly updatedAt: Date;
//
//   // Define associations if any
//   static associate() {
//     // Define associations here if needed
//   }
// }
//
// SuperViGameSession.init(
//   {id: {
//   type: DataTypes.UUID,
//   defaultValue: DataTypes.UUIDV4,
//   primaryKey: true
//     },
//     memberId: {type: DataTypes.UUID,
//   allowNull: false,
//   field: "member_id"
//     },
//     score: {type: DataTypes.INTEGER,
//   defaultValue: 0
//     },
//     level: {type: DataTypes.INTEGER,
//   defaultValue: 1
//     },
//     timePlayed: {type: DataTypes.INTEGER,
//   defaultValue: 0,
//   field: "time_played"
//     },
//     startTime: {type: DataTypes.DATE,
//   defaultValue: DataTypes.NOW,
//   field: "start_time"
//     },
//     endTime: {type: DataTypes.DATE,
//   field: "end_time"
//     },
//     isActive: {type: DataTypes.BOOLEAN,
//   defaultValue: true,
//   field: "is_active"
//     }
//   },
//   {
//     tableName: "supervi_game_sessions",
//     modelName: "SuperViGameSession",
//     sequelize, // Pass the sequelize connection
//   }
// );
//
// // High Score Model
// interface SuperViHighScoreAttributes {
//   id: string;
//   memberId: string;
//   membername: string;
//   score: number;
//   level: number;
//   sessionId: string;
//   createdAt: Date;
// }
//
// type SuperViHighScoreCreationAttributes = Optional<
//   SuperViHighScoreAttributes,
//   "id"
// >;
//
// class SuperViHighScore
//   extends Model<SuperViHighScoreAttributes, SuperViHighScoreCreationAttributes>
//   implements SuperViHighScoreAttributes
// {
//   public id!: string;
//   public memberId!: string;
//   public membername!: string;
//   public score!: number;
//   public level!: number;
//   public sessionId!: string;
//   public createdAt!: Date;
//
//   static associate() {
//     // Define associations here if needed
//   }
// }
//
// SuperViHighScore.init(
//   {id: {
//   type: DataTypes.UUID,
//   defaultValue: DataTypes.UUIDV4,
//   primaryKey: true
//     },
//     memberId: {type: DataTypes.UUID,
//   allowNull: false,
//   field: "member_id"
//     },
//     membername: {type: DataTypes.STRING,
//   allowNull: false
//     },
//     score: {type: DataTypes.INTEGER,
//   allowNull: false
//     },
//     level: {type: DataTypes.INTEGER,
//   allowNull: false
//     },
//     sessionId: {type: DataTypes.UUID,
//   allowNull: false,
//   field: "session_id",
//   references: {
//   model: "supervi_game_sessions",
//   key: "id"
//       }
//     }
//   },
//   {
//     tableName: "supervi_high_scores",
//     modelName: "SuperViHighScore",
//     sequelize, // Pass the sequelize connection
//   }
// );
//
// // Achievement Model
// interface SuperViAchievementAttributes {
//   id: string;
//   name: string;
//   description?: string;
//   icon?: string;
//   achievementType: string;
//   targetValue?: number;
//   rarity: string;
//   createdAt: Date;
// }
//
// type SuperViAchievementCreationAttributes = Optional<
//   SuperViAchievementAttributes,
//   "id"
// >;
//
// class SuperViAchievement
//   extends Model<
//     SuperViAchievementAttributes,
//     SuperViAchievementCreationAttributes
//   >
//   implements SuperViAchievementAttributes
// {
//   public id!: string;
//   public name!: string;
//   public description?: string;
//   public icon?: string;
//   public achievementType!: string;
//   public targetValue?: number;
//   public rarity!: string;
//   public createdAt!: Date;
//
//   static associate() {
//     // Define associations here if needed
//   }
// }
//
// SuperViAchievement.init(
//   {id: {
//   type: DataTypes.UUID,
//   defaultValue: DataTypes.UUIDV4,
//   primaryKey: true
//     },
//     name: {type: DataTypes.STRING,
//   allowNull: false
//     },
//     description: {type: DataTypes.TEXT
//     },
//     icon: {type: DataTypes.STRING
//     },
//     achievementType: {type: DataTypes.STRING,
//   allowNull: false,
//   field: "achievement_type"
//     },
//     targetValue: {type: DataTypes.INTEGER,
//   field: "target_value"
//     },
//     rarity: {type: DataTypes.STRING,
//   defaultValue: "common"
//     }
//   },
//   {
//     tableName: "supervi_achievements",
//     modelName: "SuperViAchievement",
//     sequelize, // Pass the sequelize connection
//   }
// );
//
// // Member Achievement Model
// interface SuperViMemberAchievementAttributes {
//   id: string;
//   memberId: string;
//   achievementId: string;
//   unlockedAt: Date;
//   progress: number;
//   isUnlocked: boolean;
// }
//
// type SuperViMemberAchievementCreationAttributes = Optional<
//   SuperViMemberAchievementAttributes,
//   "id" | "unlockedAt" | "progress" | "isUnlocked"
// >;
//
// class SuperViMemberAchievement
//   extends Model<
//     SuperViMemberAchievementAttributes,
//     SuperViMemberAchievementCreationAttributes
//   >
//   implements SuperViMemberAchievementAttributes
// {
//   public id!: string;
//   public memberId!: string;
//   public achievementId!: string;
//   public unlockedAt!: Date;
//   public progress!: number;
//   public isUnlocked!: boolean;
//
//   static associate() {
//     // Define associations here if needed
//   }
// }
//
// SuperViMemberAchievement.init(
//   {id: {
//   type: DataTypes.UUID,
//   defaultValue: DataTypes.UUIDV4,
//   primaryKey: true
//     },
//     memberId: {type: DataTypes.UUID,
//   allowNull: false,
//   field: "member_id"
//     },
//     achievementId: {type: DataTypes.UUID,
//   allowNull: false,
//   field: "achievement_id",
//   references: {
//   model: "supervi_achievements",
//   key: "id"
//       }
//     },
//     unlockedAt: {type: DataTypes.DATE,
//   defaultValue: DataTypes.NOW,
//   field: "unlocked_at"
//     },
//     progress: {type: DataTypes.INTEGER,
//   defaultValue: 0
//     },
//     isUnlocked: {type: DataTypes.BOOLEAN,
//   defaultValue: false,
//   field: "is_unlocked"
//     }
//   },
//   {
//     tableName: "supervi_member_achievements",
//     modelName: "SuperViMemberAchievement",
//     sequelize, // Pass the sequelize connection
//   }
// );
//
// // Game Item Model
// interface SuperViGameItemAttributes {
//   id: string;
//   name: string;
//   description?: string;
//   itemType: string;
//   effectType?: string;
//   effectValue?: number;
//   cost: number;
//   rarity: string;
//   isActive: boolean;
//   createdAt: Date;
// }
//
// type SuperViGameItemCreationAttributes = Optional<
//   SuperViGameItemAttributes,
//   "id" | "isActive"
// >;
//
// class SuperViGameItem
//   extends Model<SuperViGameItemAttributes, SuperViGameItemCreationAttributes>
//   implements SuperViGameItemAttributes
// {
//   public id!: string;
//   public name!: string;
//   public description?: string;
//   public itemType!: string;
//   public effectType?: string;
//   public effectValue?: number;
//   public cost!: number;
//   public rarity!: string;
//   public isActive!: boolean;
//   public createdAt!: Date;
//
//   static associate() {
//     // Define associations here if needed
//   }
// }
//
// SuperViGameItem.init(
//   {id: {
//   type: DataTypes.UUID,
//   defaultValue: DataTypes.UUIDV4,
//   primaryKey: true
//     },
//     name: {type: DataTypes.STRING,
//   allowNull: false
//     },
//     description: {type: DataTypes.TEXT
//     },
//     itemType: {type: DataTypes.STRING,
//   allowNull: false,
//   field: "item_type"
//     },
//     effectType: {type: DataTypes.STRING,
//   field: "effect_type"
//     },
//     effectValue: {type: DataTypes.DECIMAL(10, 2),
//   field: "effect_value"
//     },
//     cost: {type: DataTypes.INTEGER,
//   defaultValue: 0
//     },
//     rarity: {type: DataTypes.STRING,
//   defaultValue: "common"
//     },
//     isActive: {type: DataTypes.BOOLEAN,
//   defaultValue: true,
//   field: "is_active"
//     }
//   },
//   {
//     tableName: "supervi_game_items",
//     modelName: "SuperViGameItem",
//     sequelize, // Pass the sequelize connection
//   }
// );
//
// // Member Item Model
// interface SuperViMemberItemAttributes {
//   id: string;
//   memberId: string;
//   itemId: string;
//   quantity: number;
//   acquiredAt: Date;
//   isEquipped: boolean;
//   expiresAt?: Date;
// }
//
// type SuperViMemberItemCreationAttributes = Optional<
//   SuperViMemberItemAttributes,
//   "id" | "acquiredAt" | "isEquipped" | "quantity"
// >;
//
// class SuperViMemberItem
//   extends Model<
//     SuperViMemberItemAttributes,
//     SuperViMemberItemCreationAttributes
//   >
//   implements SuperViMemberItemAttributes
// {
//   public id!: string;
//   public memberId!: string;
//   public itemId!: string;
//   public quantity!: number;
//   public acquiredAt!: Date;
//   public isEquipped!: boolean;
//   public expiresAt?: Date;
//
//   static associate() {
//     // Define associations here if needed
//   }
// }
//
// SuperViMemberItem.init(
//   {id: {
//   type: DataTypes.UUID,
//   defaultValue: DataTypes.UUIDV4,
//   primaryKey: true
//     },
//     memberId: {type: DataTypes.UUID,
//   allowNull: false,
//   field: "member_id"
//     },
//     itemId: {type: DataTypes.UUID,
//   allowNull: false,
//   field: "item_id",
//   references: {
//   model: "supervi_game_items",
//   key: "id"
//       }
//     },
//     quantity: {type: DataTypes.INTEGER,
//   defaultValue: 1
//     },
//     acquiredAt: {type: DataTypes.DATE,
//   defaultValue: DataTypes.NOW,
//   field: "acquired_at"
//     },
//     isEquipped: {type: DataTypes.BOOLEAN,
//   defaultValue: false,
//   field: "is_equipped"
//     },
//     expiresAt: {type: DataTypes.DATE,
//   field: "expires_at"
//     }
//   },
//   {
//     tableName: "supervi_member_items",
//     modelName: "SuperViMemberItem",
//     sequelize, // Pass the sequelize connection
//   }
// );
//
// // Export all models
// export {
//   SuperViGameSession,
//   SuperViHighScore,
//   SuperViAchievement,
//   SuperViMemberAchievement,
//   SuperViGameItem,
//   SuperViMemberItem
// };
//
// // Export a function to initialize all models
// export const initializeSuperViModels = async () => {
//   // Model associations can be defined here if needed
//   //,
//   Example: SuperViGameSession.hasMany(SuperViHighScore, {foreignKey: 'session_id' });
//
//   // Sync the models with the database
//   await SuperViGameSession.sync();
//   await SuperViHighScore.sync();
//   await SuperViAchievement.sync();
//   await SuperViMemberAchievement.sync();
//   await SuperViGameItem.sync();
//   await SuperViMemberItem.sync();
//
//   console.info("SuperVi models initialized successfully");
// };
//
// export default {
//   SuperViGameSession,
//   SuperViHighScore,
//   SuperViAchievement,
//   SuperViMemberAchievement,
//   SuperViGameItem,
//   SuperViMemberItem,
//   initializeSuperViModels
// };
