/* global require, module */
const db = require("../../config/db-config");

/**
 * Get all music tracks for admin view.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllMusicTracks = async (req, res) => {
  try {
    const [tracks] = await db.promise().query("SELECT * FROM music_tracks");
    res.status(200).json(tracks);
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to fetch music tracks",
  error: error.message });
  }
};

/**
 * Update a specific music track.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateMusicTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    const {
      title,
      artist_id,
      genre_id,
      release_date,
      duration,
      cover_art_url,
      audio_file_url,
      sound_category_id
    } = req.body;

    if (
      !title ||
      !artist_id ||
      !genre_id ||
      !release_date ||
      !duration ||
      !cover_art_url ||
      !audio_file_url ||
      !sound_category_id
    ) {
      return res
        .status(400)
        .json({message: "All fields are required for updating a music track."
        });
    }

    await db
      .promise()
      .query(
        "UPDATE music_tracks SET title = ?, artist_id = ?, genre_id = ?, release_date = ?, duration = ?, cover_art_url = ?, audio_file_url = ?, sound_category_id = ? WHERE id = ?",
        [
          title,
          artist_id,
          genre_id,
          release_date,
          duration,
          cover_art_url,
          audio_file_url,
          sound_category_id,
          trackId
        ],
      );

    res.status(200).json({message: "Music track updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to update music track",
  error: error.message });
  }
};

/**
 * Delete a specific music track.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteMusicTrack = async (req, res) => {
  try {
    const { trackId } = req.params;

    await db
      .promise()
      .query("DELETE FROM music_tracks WHERE id = ?", [trackId]);

    res.status(200).json({message: "Music track deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to delete music track",
  error: error.message });
  }
};

module.exports = {
  getAllMusicTracks,
  updateMusicTrack,
  deleteMusicTrack
};
