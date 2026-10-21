/**
 * Product Controller
 * Handles product-related operations
 */

const Product = require('../models/Product');
const Category = require('../models/Category');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op, fn, col } = require('sequelize');

class ProductController {
  // Create a new product
  async createProduct(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        description,
        price,
        comparePrice,
        costPrice,
        sku,
        barcode,
        weight,
        dimensions,
        brand,
        model,
        color,
        size,
        material,
        categoryIds,
        tags,
        images,
        variants,
        inventoryTracking,
        stockQuantity,
        lowStockThreshold,
        isActive,
        metaTitle,
        metaDescription,
        metaKeywords,
        taxClass,
        shippingClass,
        featured,
        virtual,
        downloadable
      } = req.body;

      // Validate category IDs if provided
      if (categoryIds && Array.isArray(categoryIds)) {
        const categories = await Category.findAll({
          where: { id: { [Op.in]: categoryIds } }
        });
        if (categories.length !== categoryIds.length) {
          return res.status(400).json({ error: 'One or more categories do not exist' });
        }
      }

      // Create the product
      const product = await Product.create({
        name,
        description,
        price,
        comparePrice,
        costPrice,
        sku,
        barcode,
        weight,
        dimensions,
        brand,
        model,
        color,
        size,
        material,
        categoryIds: categoryIds || [],
        tags: tags || [],
        images: images || [],
        variants: variants || [],
        inventoryTracking: inventoryTracking !== undefined ? inventoryTracking : true,
        stockQuantity: stockQuantity || 0,
        lowStockThreshold: lowStockThreshold || 5,
        isActive: isActive !== undefined ? isActive : true,
        metaTitle,
        metaDescription,
        metaKeywords,
        taxClass,
        shippingClass,
        featured: featured !== undefined ? featured : false,
        virtual: virtual !== undefined ? virtual : false,
        downloadable: downloadable !== undefined ? downloadable : false
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while creating product',
        error: error.message
      });
    }
  }

  // Get all products with pagination and filtering
  async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        category = '',
        minPrice = '',
        maxPrice = '',
        brand = '',
        inStock = '',
        featured = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        tags = ''
      } = req.query;

      // Convert to integers
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = { isActive: true }; // Only show active products by default

      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { brand: { [Op.like]: `%${search}%` } },
          { tags: { [Op.overlap]: [search.toLowerCase()] } } // If tags are stored as array
        ];
      }

      if (minPrice) {
        whereConditions.price = { [Op.gte]: parseFloat(minPrice) };
      }
      if (maxPrice) {
        whereConditions.price = whereConditions.price ?
          { ...whereConditions.price, [Op.lte]: parseFloat(maxPrice) } :
          { [Op.lte]: parseFloat(maxPrice) };
      }

      if (brand) {
        whereConditions.brand = { [Op.like]: `%${brand}%` };
      }

      if (inStock !== '') {
        whereConditions.inventoryTracking = true; // Only consider stock if tracking is enabled
        if (inStock === 'true') {
          whereConditions.stockQuantity = { [Op.gt]: 0 };
        } else if (inStock === 'false') {
          whereConditions.stockQuantity = { [Op.lte]: 0 };
        }
      }

      if (featured !== '') {
        whereConditions.featured = featured === 'true';
      }

      if (tags) {
        const tagList = tags.split(',').map(tag => tag.trim().toLowerCase());
        whereConditions.tags = { [Op.overlap]: tagList };
      }

      // Apply category filter if specified
      let includeCondition = [];
      if (category) {
        includeCondition.push({
          model: Category,
          as: 'categories',
          where: { name: { [Op.like]: `%${category}%` } },
          attributes: ['id', 'name', 'slug']
        });
      }

      // Fetch products with pagination
      const products = await Product.findAndCountAll({
        where: whereConditions,
        include: includeCondition,
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true // Important when using includes to avoid duplicates
      });

      // Calculate pagination info
      const totalPages = Math.ceil(products.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        products: products.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts: products.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching products',
        error: error.message
      });
    }
  }

  // Get a single product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [{
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'slug']
        }]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Increment view count
      await product.increment('viewCount');

      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      logger.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching product',
        error: error.message
      });
    }
  }

  // Update a product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Find the product
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Validate category IDs if provided in updates
      if (updates.categoryIds && Array.isArray(updates.categoryIds)) {
        const categories = await Category.findAll({
          where: { id: { [Op.in]: updates.categoryIds } }
        });
        if (categories.length !== updates.categoryIds.length) {
          return res.status(400).json({ error: 'One or more categories do not exist' });
        }
      }

      // Update the product
      await product.update(updates);

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating product',
        error: error.message
      });
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      // Find the product
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Delete the product
      await product.destroy();

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while deleting product',
        error: error.message
      });
    }
  }

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Find category by slug
      const category = await Category.findOne({ where: { slug } });
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Find products in this category
      const products = await Product.findAndCountAll({
        where: { isActive: true },
        include: [{
          model: Category,
          as: 'categories',
          where: { id: category.id },
          attributes: ['id', 'name', 'slug']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(products.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        products: products.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts: products.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching products by category',
        error: error.message
      });
    }
  }

  // Search products
  async searchProducts(req, res) {
    try {
      const { q, page = 1, limit = 10, minPrice, maxPrice } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      let whereConditions = {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
          { brand: { [Op.like]: `%${q}%` } },
          { tags: { [Op.overlap]: [q.toLowerCase()] } } // If tags are stored as array
        ],
        isActive: true
      };

      // Add price filters if provided
      if (minPrice !== undefined || maxPrice !== undefined) {
        whereConditions.price = {};
        if (minPrice !== undefined) {
          whereConditions.price[Op.gte] = parseFloat(minPrice);
        }
        if (maxPrice !== undefined) {
          whereConditions.price[Op.lte] = parseFloat(maxPrice);
        }
      }

      const products = await Product.findAndCountAll({
        where: whereConditions,
        include: [{
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'slug']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [
          ['name', 'ASC']  // Sort alphabetically by name
        ]
      });

      const totalPages = Math.ceil(products.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        products: products.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts: products.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while searching products',
        error: error.message
      });
    }
  }

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const { limit = 8 } = req.query;
      const limitNum = parseInt(limit);

      const products = await Product.findAll({
        where: {
          isActive: true,
          featured: true
        },
        limit: limitNum,
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        products
      });
    } catch (error) {
      logger.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching featured products',
        error: error.message
      });
    }
  }

  // Get products on sale
  async getProductsOnSale(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const products = await Product.findAndCountAll({
        where: {
          isActive: true,
          comparePrice: { [Op.gt]: 0 }, // Products with a compare price higher than 0
          [Op.and]: [
            fn('GREATEST', col('comparePrice') - col('price'), 0),
            { [Op.gt]: 0 }
          ]
        },
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(products.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        products: products.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProductsOnSale: products.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching products on sale:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching products on sale',
        error: error.message
      });
    }
  }

  // Get product variants
  async getProductVariants(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        variants: product.variants || []
      });
    } catch (error) {
      logger.error('Error fetching product variants:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching product variants',
        error: error.message
      });
    }
  }
}

module.exports = new ProductController();
