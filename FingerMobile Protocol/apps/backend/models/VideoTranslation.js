const { DataTypes, Model } = require('sequelize');
const connection = require('../database/connection');
const sequelize = connection.sequelize;

class VideoTranslation extends Model {}
// Initialize the model
VideoTranslation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // This refers to the users table,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalFileSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    originalFileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    targetLanguages: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    processingId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    outputFiles: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    transcription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    translations: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    processingStartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    processingEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedCompletionTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    totalProcessingTime: {
      type: DataTypes.INTEGER, // in milliseconds,
      allowNull: true
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize: sequelize,
    modelName: 'VideoTranslation',
    tableName: 'video_translations',
    timestamps: true
  }
);

module.exports = VideoTranslation;
