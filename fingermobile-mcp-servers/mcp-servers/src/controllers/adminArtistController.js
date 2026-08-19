/* global require, module */
const db = require("../../config/db-config");

/**
 * Get all artists for admin view.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllArtists = async (req, res) => {
  try {
    const [artists] = await db.promise().query("SELECT * FROM artists");
    res.status(200).json(artists);
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to fetch artists",
  error: error.message });
  }
};

/**
 * Update a specific artist.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    const { name, bio, profile_picture_url } = req.body;

    if (!name || !bio || !profile_picture_url) {
      return res
        .status(400)
        .json({message: "All fields are required for updating an artist." });
    }

    await db
      .promise()
      .query(
        "UPDATE artists SET name = ?, bio = ?, profile_picture_url = ? WHERE id = ?",
        [name, bio, profile_picture_url, artistId],
      );

    res.status(200).json({message: "Artist updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to update artist",
  error: error.message });
  }
};

/**
 * Delete a specific artist.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    await db.promise().query("DELETE FROM artists WHERE id = ?", [artistId]);

    res.status(200).json({message: "Artist deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to delete artist",
  error: error.message });
  }
};

module.exports = {
  getAllArtists,
  updateArtist,
  deleteArtist
};
