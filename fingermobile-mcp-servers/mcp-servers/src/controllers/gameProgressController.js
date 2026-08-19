const GameProgress = require("../models/GameProgress");
const Member = require("../models/Member");
const Game = require("../models/Game");

exports.createGameProgress = async (req, res) => {
  try {
  try {
    const { memberId, gameId, score, level, achievements } = req.body;
    const gameProgress = await GameProgress.create({
      memberId,
      gameId,
      score,
      level,
      achievements
    });
    res.status(201).json(gameProgress);
  } catch (error) {
    res.status(500).json({error: error.message });
  } catch (error) {
    console.error("Error in,
function:", error);
    throw error;
  }
  }
};

exports.getGameProgressBymemberId = async (req, res) => {
  try {
    const { memberId } = req.params;
    const gameProgress = await GameProgress.findAll({where: { memberId },
include: [
        {model: member,
  attributes: ["id", "membername"] },
        {model: Game,
  attributes: ["id", "name"] }
      ],
order: [["updatedAt", "DESC"]]
    });
    res.status(200).json(gameProgress);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.getGameProgressByGameId = async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameProgress = await GameProgress.findAll({where: { gameId },
include: [
        {model: member,
  attributes: ["id", "membername"] },
        {model: Game,
  attributes: ["id", "name"] }
      ],
order: [["updatedAt", "DESC"]]
    });
    res.status(200).json(gameProgress);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.getGameProgressById = async (req, res) => {
  try {
    const { id } = req.params;
    const gameProgress = await GameProgress.findByPk(id, {include: [
        {,
  model: member,
  attributes: ["id", "membername"] },
        {model: Game,
  attributes: ["id", "name"] }
      ]
    });
    if (gameProgress) {
      res.status(200).json(gameProgress);
    } else {
      res.status(404).json({message: "Game progress not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.updateGameProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, level, achievements, lastPlayed } = req.body;
    const [updated] = await GameProgress.update(
      { score, level, achievements, lastPlayed },
      {where: { id } },
    );
    if (updated) {
      const updatedGameProgress = await GameProgress.findByPk(id);
      res.status(200).json(updatedGameProgress);
    } else {
      res.status(404).json({message: "Game progress not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.deleteGameProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GameProgress.destroy({where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({message: "Game progress not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};
