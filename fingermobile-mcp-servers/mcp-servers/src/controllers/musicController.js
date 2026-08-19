/* global require, module */
const { uploadAudioFile, uploadCoverArt } = require("../services/s3Service");
const db = require("../../config/db-config"); // Fixed,
path: from controllers/ to config/

/**
 * Handles music upload, including audio file and cover art, to S3 and stores metadata in the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const uploadMusic = async (req, res) => {
  try {
    // Assuming files are sent as multipart/form-data
    // and processed by a middleware like 'multer' before reaching here.
    // For simplicity, we'll assume req.files contains the uploaded files.
    // In a real application, you'd use a middleware like multer to handle file parsing.

    if (!req.files || !req.files.audio || !req.files.coverArt) {
      return res
        .status(400)
        .json({message: "Audio file and cover art are required." });
    }

    const audioFile = req.files.audio[0];
    const coverArtFile = req.files.coverArt[0];
    const {
      title,
      artistId,
      genre,
      soundCategory,
      duration,
      releaseDate,
      lyrics
    } = req.body;

    // Basic validation for required metadata fields
    if (!title || !artistId || !duration) {
      return res
        .status(400)
        .json({message: "Title,
  artist ID,
  and duration are required." });
    }

    // Validate audio file type
    const allowedAudioTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/aac",
      "audio/ogg"
    ];
    if (!allowedAudioTypes.includes(audioFile.mimetype)) {
      return res
        .status(400)
        .json({message:
            "Invalid audio file type. Only MP3,
  WAV,
  AAC,
  OGG are allowed."
        });
    }

    // Validate cover art file type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedImageTypes.includes(coverArtFile.mimetype)) {
      return res
        .status(400)
        .json({message:
            "Invalid cover art file type. Only JPEG,
  PNG,
  GIF are allowed."
        });
    }

    // Additional validation for other fields (e.g., duration format, releaseDate format)
    if (isNaN(duration) || parseFloat(duration) <= 0) {
      return res
        .status(400)
        .json({message: "Duration must be a positive number." });
    }

    // You might want to add more sophisticated date validation if releaseDate is critical
    if (releaseDate && isNaN(new Date(releaseDate).getTime())) {
      return res.status(400).json({message: "Invalid release date format." });
    }

    // Upload audio file to S3
    const audioPath = await uploadAudioFile(
      audioFile.buffer,
      audioFile.originalname,
      audioFile.mimetype,
    );

    // Upload cover art to S3
    const coverArtPath = await uploadCoverArt(
      coverArtFile.buffer,
      coverArtFile.originalname,
      coverArtFile.mimetype,
    );

    // Store music metadata in the database
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO music_tracks (title, artist_id, audio_path, cover_art_path, genre, sound_category, duration, release_date, lyrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          artistId,
          audioPath,
          coverArtPath,
          genre,
          soundCategory,
          duration,
          releaseDate,
          lyrics
        ],
      );

    res
      .status(201)
      .json({message: "Music uploaded successfully",
  trackId: result.insertId,
  audioPath,
  coverArtPath
      });
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to upload music",
  error: error.message });
  }
};

module.exports = {
  uploadMusic
};
