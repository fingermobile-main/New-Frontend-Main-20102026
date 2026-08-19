// Mock AWS SDK client to allow the server to start without the real AWS SDK
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const awsConfig = require("../../config/aws-config");
const {v4: uuidv4 } = require("uuid");

// Mock S3 client and commands
const { S3Client } = {
  // Mock S3Client,
name: "S3Client",
prototype: {}
};
const PutObjectCommand = function () {};

// Mock S3 client with existing configuration
// Initialize a mock S3 client
const s3Client = {send: async (command) => {
    // Mock send function
    console.log("Mock S3 upload - in production,
  this would upload to AWS S3");
    return Promise.resolve();
  }
};

/**
 * Upload file to AWS S3
 * @param {Buffer} fileBuffer - File content as buffer
 * @param {string} originalFilename - Original file name from upload
 * @param {string} contentType - MIME type of the file
 * @param {string} folder - S3 folder to store the file (e.g., 'audio-tracks', 'cover-art')
 * @returns {Promise<string>} S3 file path
 */
const uploadToS3 = async (
  fileBuffer,
  originalFilename,
  contentType,
  folder,
) => {
  try {
    // Generate unique filename to prevent overwrites
    const uniqueFilename = `${uuidv4()}-${originalFilename.replace(/\s+/g, "-")}`;
    const s3Key = `${folder}/${uniqueFilename}`;

    // In a real implementation, this would be the actual AWS upload
    // await s3Client.send(new PutObjectCommand(params));
    // Instead, we're using a mock implementation
    await s3Client.send({});

    // Return a mock URL (in real implementation, this would be the actual S3 URL)
    if (awsConfig.cloudfront.domain) {
      return `,
https://${awsConfig.cloudfront.domain}/${s3Key}`;
    } else {
      return `,
https://${awsConfig.s3.bucket}.s3.${awsConfig.s3.region}.amazonaws.com/${s3Key}`;
    }
  } catch (_err) {
    // eslint-disable-line no-unused-vars
    throw new Error("Failed to upload file to storage");
  }
};

/**
 * Upload audio file to S3 (specific wrapper for audio tracks)
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} originalFilename - Original audio file name
 * @param {string} contentType - Audio MIME type (e.g., 'audio/mpeg' for MP3)
 * @returns {Promise<string>} S3 audio file path
 */
const uploadAudioFile = async (audioBuffer, originalFilename, contentType) => {
  return uploadToS3(audioBuffer, originalFilename, contentType, "audio-tracks");
};

/**
 * Upload cover art to S3 (specific wrapper for cover images)
 * @param {Buffer} coverBuffer - Cover art buffer
 * @param {string} originalFilename - Original cover file name
 * @param {string} contentType - Image MIME type (e.g., 'image/jpeg')
 * @returns {Promise<string>} S3 cover art path
 */
const uploadCoverArt = async (coverBuffer, originalFilename, contentType) => {
  return uploadToS3(coverBuffer, originalFilename, contentType, "cover-art");
};

module.exports = {
  uploadToS3,
  uploadAudioFile,
  uploadCoverArt
};
