/**
 * Review Controller
 * Handles review-related operations
 */

const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op, fn, col } = require('sequelize');
const db = require('../db');
const ugcPrivacyService = require('../services/ugcPrivacyService');

const getPool = () => db.pool || db;

class ReviewController {
  constructor() {
    this.getAll = (req, res) => this.getAllReviews ? this.getAllReviews(req, res) : (this.getReviews ? this.getReviews(req, res) : res.json({ success: true, data: [] }));
    this.getById = (req, res) => this.getReviewById ? this.getReviewById(req, res) : (this.getReviews ? this.getReviews(req, res) : res.json({ success: true, data: {} }));
    this.create = (req, res) => this.createReview(req, res);
    this.update = (req, res) => this.updateReview ? this.updateReview(req, res) : this.createReview(req, res);
    this.delete = (req, res) => this.deleteReview(req, res);
    this.getReviews = (req, res) => (req.params.contentId || req.params.productId) ? this.getReviewsByProduct(req, res) : this.getAllReviews(req, res);
    this.getProductReviews = (req, res) => this.getReviewsByProduct ? this.getReviewsByProduct(req, res) : res.json({ success: true, data: [] });
    this.getUserReviews = (req, res) => this.getReviewsByUser ? this.getReviewsByUser(req, res) : res.json({ success: true, data: [] });
  }

  // Create a new review
  async createReview(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { productId, rating, title, content, isVerifiedPurchase } = req.body;
      const userId = req.user.id; // Assuming user is authenticated

      // Validate rating
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Check UGC Privacy Permissions
      const contentType = req.params?.contentType || req.body?.contentType || 'product';
      const contentId = req.params?.contentId || req.body?.productId || req.body?.contentId;
      if (contentId) {
        const perm = await ugcPrivacyService.checkPermission(contentType, contentId, userId, 'review');
        if (perm && perm.allowed === false) {
          return res.status(403).json({
            success: false,
            message: perm.reason || 'Owner has disabled reviews on this content'
          });
        }
      }

      // Check if user has already reviewed this product
      const existingReview = await Review.findOne({
        where: { userId, productId }
      });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          message: 'User has already reviewed this product'
        });
      }

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Create the review
      const review = await Review.create({
        userId,
        productId,
        rating,
        title: title || '',
        content: content || '',
        isVerifiedPurchase: isVerifiedPurchase || false
      });

      // Update product's average rating
      await this.updateProductAverageRating(productId);

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        review
      });
    } catch (error) {
      logger.error('Error creating review:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while creating review',
        error: error.message
      });
    }
  }

  // Get all reviews with pagination and filtering
  async getAllReviews(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        productId = '',
        userId = '',
        minRating = '',
        maxRating = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      // Convert to integers
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = {};

      if (productId) {
        whereConditions.productId = productId;
      }

      if (userId) {
        whereConditions.userId = userId;
      }

      if (minRating) {
        whereConditions.rating = { [Op.gte]: parseInt(minRating) };
      }
      if (maxRating) {
        whereConditions.rating = whereConditions.rating ?
          { ...whereConditions.rating, [Op.lte]: parseInt(maxRating) } :
          { [Op.lte]: parseInt(maxRating) };
      }

      // Fetch reviews with pagination
      const reviews = await Review.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'displayName', 'avatar']
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name']
          }
        ],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      // Calculate pagination info
      const totalPages = Math.ceil(reviews.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        reviews: reviews.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalReviews: reviews.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching reviews',
        error: error.message
      });
    }
  }

  // Get a single review by ID
  async getReviewById(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'displayName', 'avatar']
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name']
          }
        ]
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.status(200).json({
        success: true,
        review
      });
    } catch (error) {
      logger.error('Error fetching review:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching review',
        error: error.message
      });
    }
  }

  // Update a review
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, title, content } = req.body;
      const userId = req.user.id;

      // Find the review
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user owns the review
      if (review.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this review'
        });
      }

      // Validate rating if provided
      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Update the review
      await review.update({
        rating: rating !== undefined ? rating : review.rating,
        title: title !== undefined ? title : review.title,
        content: content !== undefined ? content : review.content
      });

      // Update product's average rating
      await this.updateProductAverageRating(review.productId);

      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        review
      });
    } catch (error) {
      logger.error('Error updating review:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating review',
        error: error.message
      });
    }
  }

  // Delete a review
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find the review
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user owns the review or is an admin
      const isAdmin = req.user.role === 'admin';
      if (review.userId !== userId && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this review'
        });
      }

      // Store product ID before deletion
      const productId = review.productId;

      // Delete the review
      await review.destroy();

      // Update product's average rating
      await this.updateProductAverageRating(productId);

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting review:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while deleting review',
        error: error.message
      });
    }
  }

  // Get reviews by product
  async getReviewsByProduct(req, res) {
    try {
      const { productId } = req.params;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const reviews = await Review.findAndCountAll({
        where: { productId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'displayName', 'avatar']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(reviews.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        reviews: reviews.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalReviews: reviews.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching reviews by product:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching reviews by product',
        error: error.message
      });
    }
  }

  // Get reviews by user
  async getReviewsByUser(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const reviews = await Review.findAndCountAll({
        where: { userId },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'images']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(reviews.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        reviews: reviews.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalReviews: reviews.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching reviews by user:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching reviews by user',
        error: error.message
      });
    }
  }

  // Get product's average rating
  async getProductRating(req, res) {
    try {
      const { productId } = req.params;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        averageRating: product.averageRating || 0,
        totalReviews: product.reviewCount || 0
      });
    } catch (error) {
      logger.error('Error fetching product rating:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching product rating',
        error: error.message
      });
    }
  }

  // Helper method to update product's average rating
  async updateProductAverageRating(productId) {
    try {
      const result = await Review.findAll({
        where: { productId },
        attributes: [
          [fn('AVG', col('rating')), 'averageRating'],
          [fn('COUNT', col('id')), 'reviewCount']
        ]
      });

      const averageRating = parseFloat(result[0].dataValues.averageRating) || 0;
      const reviewCount = parseInt(result[0].dataValues.reviewCount) || 0;

      await Product.update(
        { averageRating, reviewCount },
        { where: { id: productId } }
      );
    } catch (error) {
      logger.error('Error updating product average rating:', error);
    }
  }
}

module.exports = new ReviewController();
