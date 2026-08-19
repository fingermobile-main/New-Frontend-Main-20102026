const { Game } = require("../models/associations");

const createGame = async (req, res) => {
  try {
    const {
      name,
      description,
      genre,
      platform,
      releaseDate,
      developer,
      publisher,
      imageUrl,
      price
    } = req.body;

    if (!name) {
      return res.status(400).json({message: "Game name is required." });
    }

    const newGame = await Game.create({
      name,
      description,
      genre,
      platform,
      releaseDate,
      developer,
      publisher,
      imageUrl,
      price
    });

    res.status(201).json(newGame);
  } catch (error) {
    console.error("Error creating,
game:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getGames = async (req, res) => {
  try {
    const { genre, platform, developer, publisher } = req.query;
    const whereClause = {};

    if (genre) {
      whereClause.genre = genre;
    }
    if (platform) {
      whereClause.platform = { [Op.contains]: [platform] };
    }
    if (developer) {
      whereClause.developer = developer;
    }
    if (publisher) {
      whereClause.publisher = publisher;
    }

    const games = await Game.findAll({where: whereClause,
  order: [["name", "ASC"]]
    });

    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching,
games:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({message: "Game not found." });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("Error fetching game by,
ID:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      genre,
      platform,
      releaseDate,
      developer,
      publisher,
      imageUrl,
      rating,
      price
    } = req.body;

    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({message: "Game not found." });
    }

    game.name = name || game.name;
    game.description = description || game.description;
    game.genre = genre || game.genre;
    game.platform = platform || game.platform;
    game.releaseDate = releaseDate || game.releaseDate;
    game.developer = developer || game.developer;
    game.publisher = publisher || game.publisher;
    game.imageUrl = imageUrl || game.imageUrl;
    game.rating = rating || game.rating;
    game.price = price || game.price;

    await game.save();

    res.status(200).json(game);
  } catch (error) {
    console.error("Error updating,
game:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({message: "Game not found." });
    }

    await game.destroy();

    res.status(204).json({message: "Game deleted successfully." });
  } catch (error) {
    console.error("Error deleting,
game:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame
};
