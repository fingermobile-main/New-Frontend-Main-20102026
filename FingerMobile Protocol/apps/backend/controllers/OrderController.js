/**
 * Order Controller
 * Handles order-related operations
 */

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op, literal } = require('sequelize');

class OrderController {
  constructor() {
    this.getAll = (req, res) => this.getAllOrders(req, res);
    this.getById = (req, res) => this.getOrderById(req, res);
    this.create = (req, res) => this.createOrder(req, res);
    this.update = (req, res) => this.updateOrderStatus(req, res);
    this.updateStatus = (req, res) => this.updateOrderStatus(req, res);
    this.getUserOrders = (req, res) => this.getOrdersByUser(req, res);
  }

  // Create a new order
  async createOrder(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;
      const userId = req.user.id; // Assuming user is authenticated

      // Validate items
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order items are required and must be a non-empty array'
        });
      }

      // Start a transaction
      const transaction = await Order.sequelize.transaction();

      try {
        // Calculate total amount and validate inventory
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items) {
          const { productId, quantity, price } = item;

          // Fetch product
          const product = await Product.findByPk(productId);
          if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
          }

          // Check inventory
          if (product.stockQuantity < quantity) {
            throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}, Requested: ${quantity}`);
          }

          // Add to validated items
          validatedItems.push({
            productId,
            quantity,
            price: price || product.price,
            productName: product.name
          });

          // Add to total
          totalAmount += (price || product.price) * quantity;
        }

        // Create order
        const order = await Order.create({
          userId,
          totalAmount,
          shippingAddress,
          billingAddress,
          paymentMethod,
          status: 'pending', // Initial status
          notes: notes || ''
        }, { transaction });

        // Create order items
        for (const item of validatedItems) {
          await OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            productName: item.productName
          }, { transaction });

          // Update product inventory
          await Product.update(
            {
              stockQuantity: literal(`stockQuantity - ${item.quantity}`)
            },
            {
              where: { id: item.productId },
              transaction
            }
          );
        }

        // Commit transaction
        await transaction.commit();

        // Populate the order for response
        const populatedOrder = await Order.findByPk(order.id, {
          include: [{ model: OrderItem, as: 'items' }]
        });

        res.status(201).json({
          success: true,
          message: 'Order created successfully',
          order: populatedOrder
        });
      } catch (error) {
        // Rollback transaction
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      logger.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while creating order',
        error: error.message
      });
    }
  }

  // Get all orders with pagination and filtering
  async getAllOrders(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status = '',
        dateFrom = '',
        dateTo = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        userId: filterUserId = ''
      } = req.query;

      // Convert to integers
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = {};

      if (status) {
        whereConditions.status = status;
      }

      if (dateFrom || dateTo) {
        whereConditions.createdAt = {};
        if (dateFrom) {
          whereConditions.createdAt[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereConditions.createdAt[Op.lte] = new Date(dateTo);
        }
      }

      // Only allow users to see their own orders unless they are admins
      const userRole = req.user.role;
      if (userRole !== 'admin' && userRole !== 'moderator') {
        whereConditions.userId = req.user.id;
      } else if (filterUserId) {
        // Admins can filter by specific user
        whereConditions.userId = filterUserId;
      }

      // Fetch orders with pagination
      const orders = await Order.findAndCountAll({
        where: whereConditions,
        include: [{
          model: OrderItem,
          as: 'items',
          attributes: ['id', 'productId', 'productName', 'quantity', 'price']
        }, {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      // Calculate pagination info
      const totalPages = Math.ceil(orders.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        orders: orders.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalOrders: orders.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching orders',
        error: error.message
      });
    }
  }

  // Get a single order by ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Find the order
      let orderQuery = {
        where: { id },
        include: [
          {
            model: OrderItem,
            as: 'items',
            attributes: ['id', 'productId', 'productName', 'quantity', 'price']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'displayName']
          }
        ]
      };

      // Regular users can only see their own orders
      if (userRole !== 'admin' && userRole !== 'moderator') {
        orderQuery.where.userId = userId;
      }

      const order = await Order.findOne(orderQuery);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      logger.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching order',
        error: error.message
      });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order status'
        });
      }

      // Find the order
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update the order status
      await order.update({ status });

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order
      });
    } catch (error) {
      logger.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating order status',
        error: error.message
      });
    }
  }

  // Cancel an order
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find the order
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if user owns the order (only owner can cancel unless admin)
      const userRole = req.user.role;
      if (order.userId !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this order'
        });
      }

      // Can only cancel pending or confirmed orders
      if (['shipped', 'delivered'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel an order that has already shipped or been delivered'
        });
      }

      // Update status to cancelled
      await order.update({ status: 'cancelled' });

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order
      });
    } catch (error) {
      logger.error('Error cancelling order:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while cancelling order',
        error: error.message
      });
    }
  }

  // Get orders by user
  async getOrdersByUser(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status = '' } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      let whereConditions = { userId };
      if (status) {
        whereConditions.status = status;
      }

      const orders = await Order.findAndCountAll({
        where: whereConditions,
        include: [{
          model: OrderItem,
          as: 'items',
          attributes: ['id', 'productId', 'productName', 'quantity', 'price']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(orders.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        orders: orders.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalOrders: orders.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching user orders:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching user orders',
        error: error.message
      });
    }
  }

  // Get order statistics
  async getOrderStats(req, res) {
    try {
      const userRole = req.user.role;

      let statsQuery = `
        SELECT 
          COUNT(*) as totalOrders,
          SUM(totalAmount) as totalRevenue,
          AVG(totalAmount) as averageOrderValue,
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completedOrders,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledOrders
        FROM Orders
      `;

      // Regular users can only see their own stats
      let statsResultVar;
      if (userRole !== 'admin' && userRole !== 'moderator') {
        statsQuery += ' WHERE userId = ?';
        statsResultVar = await Order.sequelize.query(statsQuery, {
          replacements: [req.user.id],
          type: Order.sequelize.QueryTypes.SELECT
        });
      } else {
        statsResultVar = await Order.sequelize.query(statsQuery, {
          type: Order.sequelize.QueryTypes.SELECT
        });
      }

      const stats = statsResultVar[0];

      res.status(200).json({
        success: true,
        stats: {
          totalOrders: parseInt(stats.totalOrders) || 0,
          totalRevenue: parseFloat(stats.totalRevenue) || 0,
          averageOrderValue: parseFloat(stats.averageOrderValue) || 0,
          completedOrders: parseInt(stats.completedOrders) || 0,
          cancelledOrders: parseInt(stats.cancelledOrders) || 0
        }
      });
    } catch (error) {
      logger.error('Error fetching order stats:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching order stats',
        error: error.message
      });
    }
  }
}

module.exports = new OrderController();
