'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.BlockMute = exports.initializeBlockMute = void 0;
const sequelize_1 = require('sequelize');
const modelInitializer_1 = require('../utils/modelInitializer');
// Define the model class extending Sequelize's Model
class BlockMute extends sequelize_1.Model {
}
exports.BlockMute = BlockMute;
// Deferred initialization - will be called when sequelize is ready
const initializeBlockMute = () => {
  BlockMute.init({
    id: {
      type: sequelize_1.DataTypes.UUID,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
      primaryKey: true
    },
    blockerId: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false
    },
    blockedUserId: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false
    }, muteType: {
      type: sequelize_1.DataTypes.ENUM('notification', 'ugc', 'all'),
      allowNull: false
    },
    reason: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true
    } }, {
    tableName: 'block_mutes',
    sequelize: (0, modelInitializer_1.getSequelize)()
  });
};
exports.initializeBlockMute = initializeBlockMute;
