const Category = require('../models/Category');
const Product = require('../models/Product');
const logger = require('../utils/logger');

class CategoryController {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * Get all categories with optional filtering
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = (page - 1) * limit;

      // Filter options
      const whereClause = {};
      if (req.query.parentId) whereClause.parentId = req.query.parentId;
      if (req.query.name) whereClause.name = { [require('sequelize').Op.iLike]: `%${req.query.name}%` };

      const { count, rows: categories } = await Category.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Category,
            as: 'subcategories',
            attributes: ['id', 'name', 'description']
          }
        ]
      });

      res.json({
        success: true,
        data: categories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      logger.logError(error, { action: 'get_all_categories', userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get category by ID
   */
  async getById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id, {
        include: [
          {
            model: Category,
            as: 'subcategories',
            attributes: ['id', 'name', 'description']
          },
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'name', 'description']
          },
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'name', 'price', 'stockQuantity'],
            limit: 10 // Limit products in category overview
          }
        ]
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      logger.logError(error, { action: 'get_category_by_id', categoryId: req.params.id, userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Create new category
   */
  async create(req, res) {
    try {
      // Only admin can create categories
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required to create categories'
        });
      }

      const category = await Category.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      logger.logError(error, { action: 'create_category', userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Update category
   */
  async update(req, res) {
    try {
      // Only admin can update categories
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required to update categories'
        });
      }

      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const updatedCategory = await category.update(req.body);

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory
      });
    } catch (error) {
      logger.logError(error, { action: 'update_category', categoryId: req.params.id, userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Delete category
   */
  async delete(req, res) {
    try {
      // Only admin can delete categories
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required to delete categories'
        });
      }

      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Check if category has subcategories or products
      const subcategories = await Category.count({ where: { parentId: category.id } });
      const products = await Product.count({ where: { categoryId: category.id } });

      if (subcategories > 0 || products > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category with subcategories or products'
        });
      }

      await category.destroy();

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      logger.logError(error, { action: 'delete_category', categoryId: req.params.id, userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new CategoryController();
