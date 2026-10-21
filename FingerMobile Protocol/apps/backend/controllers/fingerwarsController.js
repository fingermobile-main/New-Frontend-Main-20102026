/**
 * FingerWars Controller
 * Handles competitive gaming platform operations
 */

const FingerWarsGame = require('../models/FingerWarsGame');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class FingerWarsController {
  constructor() {
    this.getAll = (req, res) => res.json({ success: true, data: [] });
    this.getById = (req, res) => res.json({ success: true, data: {} });
    this.create = (req, res) => res.status(201).json({ success: true, data: {} });
    this.update = (req, res) => res.json({ success: true, data: {} });
    this.delete = (req, res) => res.json({ success: true, message: 'Deleted successfully' });
  }

  // Get all games with filtering and pagination
  async getAllGames(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        isMultiplayer = '',
        isFreeToPlay = '',
        ageRating = '',
        isPublished = 'true',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = {};

      if (isPublished) {
        whereConditions.is_published = isPublished === 'true';
      }

      if (isMultiplayer !== '') {
        whereConditions.is_multiplayer = isMultiplayer === 'true';
      }

      if (isFreeToPlay !== '') {
        whereConditions.is_free_to_play = isFreeToPlay === 'true';
      }

      if (ageRating) {
        whereConditions.age_rating = ageRating;
      }

      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { short_description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const games = await FingerWarsGame.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'developer',
          attributes: ['id', 'username', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(games.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        games: games.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalGames: games.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching games:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching games',
        error: error.message
      });
    }
  }

  // Create a new game
  async createGame(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        categoryId,
        title,
        description,
        shortDescription,
        thumbnailUrl,
        bannerUrl,
        trailerUrl,
        releaseDate,
        playerCountMin,
        playerCountMax,
        ageRating,
        genreTags,
        tags,
        isMultiplayer,
        isFreeToPlay,
        price
      } = req.body;

      const developerId = req.user.id; // Assuming user is authenticated

      const game = await FingerWarsGame.create({
        category_id: categoryId,
        developer_id: developerId,
        title,
        description,
        short_description: shortDescription,
        thumbnail_url: thumbnailUrl,
        banner_url: bannerUrl,
        trailer_url: trailerUrl,
        release_date: releaseDate,
        is_published: false, // Default to unpublished initially
        player_count_min: playerCountMin || 1,
        player_count_max: playerCountMax || 100,
        age_rating: ageRating || 'Everyone',
        genre_tags: genreTags || [],
        tags: tags || [],
        is_multiplayer: isMultiplayer || false,
        is_free_to_play: isFreeToPlay || false,
        price: parseFloat(price) || 0
      });

      res.status(201).json({
        success: true,
        message: 'Game created successfully',
        game
      });
    } catch (error) {
      logger.error('Error creating game:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while creating game',
        error: error.message
      });
    }
  }

  // Get a specific game by ID
  async getGameById(req, res) {
    try {
      const { id } = req.params;

      const game = await FingerWarsGame.findByPk(id, {
        include: [{
          model: User,
          as: 'developer',
          attributes: ['id', 'username', 'displayName']
        }]
      });

      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }

      res.status(200).json({
        success: true,
        game
      });
    } catch (error) {
      logger.error('Error fetching game:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching game',
        error: error.message
      });
    }
  }

  // Update a game
  async updateGame(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      const game = await FingerWarsGame.findByPk(id);
      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }

      // Check if user is the developer (only developer can update unless admin)
      const userRole = req.user.role;
      if (game.developer_id !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this game'
        });
      }

      await game.update(updates);

      res.status(200).json({
        success: true,
        message: 'Game updated successfully',
        game
      });
    } catch (error) {
      logger.error('Error updating game:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating game',
        error: error.message
      });
    }
  }

  // Publish/unpublish a game
  async toggleGamePublishStatus(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const game = await FingerWarsGame.findByPk(id);
      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }

      // Check if user is the developer (only developer can publish/unpublish unless admin)
      const userRole = req.user.role;
      if (game.developer_id !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this game status'
        });
      }

      const newStatus = !game.is_published;
      await game.update({
        is_published: newStatus,
        published_at: newStatus ? new Date() : null
      });

      res.status(200).json({
        success: true,
        message: `Game ${newStatus ? 'published' : 'unpublished'} successfully`,
        game
      });
    } catch (error) {
      logger.error('Error toggling game publish status:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating game status',
        error: error.message
      });
    }
  }

  // Delete a game
  async deleteGame(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const game = await FingerWarsGame.findByPk(id);
      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }

      // Check if user is the developer (only developer can delete unless admin)
      const userRole = req.user.role;
      if (game.developer_id !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this game'
        });
      }

      await game.destroy();

      res.status(200).json({
        success: true,
        message: 'Game deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting game:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while deleting game',
        error: error.message
      });
    }
  }

  // Get games by developer
  async getGamesByDeveloper(req, res) {
    try {
      const { developerId } = req.params;
      const {
        page = 1,
        limit = 10,
        isPublished = 'all',
        isMultiplayer = '',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      let whereConditions = { developer_id: developerId };

      if (isPublished !== 'all') {
        whereConditions.is_published = isPublished === 'true';
      }

      if (isMultiplayer !== '') {
        whereConditions.is_multiplayer = isMultiplayer === 'true';
      }

      const games = await FingerWarsGame.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'developer',
          attributes: ['id', 'username', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(games.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        games: games.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalGames: games.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching games by developer:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching games by developer',
        error: error.message
      });
    }
  }

  // Get popular games (most played)
  async getPopularGames(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        days = 30
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const daysNum = parseInt(days);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysNum);

      const games = await FingerWarsGame.findAll({
        where: {
          is_published: true,
          created_at: { [Op.gte]: cutoffDate }
        },
        order: [['total_plays', 'DESC']],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum
      });

      const totalPages = Math.ceil(await FingerWarsGame.count({ where: { is_published: true } }) / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        games,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalGames: await FingerWarsGame.count({ where: { is_published: true } }),
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching popular games:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching popular games',
        error: error.message
      });
    }
  }

  // Search games
  async searchGames(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        q = '',
        isMultiplayer = '',
        isFreeToPlay = '',
        ageRating = '',
        minPrice = '',
        maxPrice = ''
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = { is_published: true };

      if (q) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { short_description: { [Op.iLike]: `%${q}%` } }
        ];
      }

      if (isMultiplayer !== '') {
        whereConditions.is_multiplayer = isMultiplayer === 'true';
      }

      if (isFreeToPlay !== '') {
        whereConditions.is_free_to_play = isFreeToPlay === 'true';
      }

      if (ageRating) {
        whereConditions.age_rating = ageRating;
      }

      if (minPrice !== '') {
        whereConditions.price = { [Op.gte]: parseFloat(minPrice) };
      }

      if (maxPrice !== '') {
        whereConditions.price = whereConditions.price ?
          { ...whereConditions.price, [Op.lte]: parseFloat(maxPrice) } :
          { [Op.lte]: parseFloat(maxPrice) };
      }

      const games = await FingerWarsGame.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'developer',
          attributes: ['id', 'username', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['average_rating', 'DESC'], ['total_plays', 'DESC']]
      });

      const totalPages = Math.ceil(games.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        games: games.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalGames: games.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error searching games:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while searching games',
        error: error.message
      });
    }
  }
}

module.exports = new FingerWarsController();
