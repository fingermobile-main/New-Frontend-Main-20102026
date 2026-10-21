const { DataTypes, Model } = require('sequelize');
const { getSequelize } = require('../utils/modelInitializer');
const connection = require('../database/connection');

class FingerMobileEmoji extends Model {}

const initializeFingerMobileEmoji = (seqInstance) => {
  const sequelize = seqInstance || connection.sequelize || getSequelize();
  if (!sequelize) return FingerMobileEmoji;

  // Don't re-init if already initialized
  if (FingerMobileEmoji.sequelize) {
    return FingerMobileEmoji;
  }

  FingerMobileEmoji.init(
    {
      id: {
        type: DataTypes.STRING(100),
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      category: {
        type: DataTypes.STRING(100),
        defaultValue: 'reactions'
      },
      toast_type: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      asset_filename: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      color_hex: {
        type: DataTypes.STRING(50),
        defaultValue: '#defaf2'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      brand_identity: {
        type: DataTypes.JSONB,
        defaultValue: {
          monochromatic: true,
          tone: 'ice-green',
          hex: '#defaf2',
          material: 'glossy_glass',
          glasses_engraved: 'FingerMobile',
          yellow_lip: true,
          red_tongue: true
        }
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: 'fingermobile_emojis',
      timestamps: true,
      underscored: true
    }
  );

  return FingerMobileEmoji;
};

// Auto-initialize if sequelize is available on import
try {
  initializeFingerMobileEmoji();
} catch (_e) {
  // Gracefully handle pre-connection import
}

FingerMobileEmoji.initializeFingerMobileEmoji = initializeFingerMobileEmoji;
FingerMobileEmoji.FingerMobileEmoji = FingerMobileEmoji;

module.exports = FingerMobileEmoji;

