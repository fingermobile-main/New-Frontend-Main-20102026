const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class CartController {
  /**
   * Cart Controller
   * Handles shopping cart operations
   */

  constructor() {
    // Bind methods to ensure correct 'this' context
    this.addToCart = this.addToCart.bind(this);
    this.getUserCart = this.getUserCart.bind(this);
    this.updateCartItem = this.updateCartItem.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.removeCartItem = this.removeFromCart ? this.removeFromCart.bind(this) : this.clearCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.getCartSummary = this.getCartSummary.bind(this);
    this.mergeCarts = this.mergeCarts.bind(this);
  }

  /**
   * Add item to shopping cart
   */
  async addToCart(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { productId, variantId, quantity = 1, customOptions = {} } = req.body;
      const userId = req.user?.id || null;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Validate product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if item already in cart
      let cartItem = await Cart.findOne({
        where: {
          userId,
          productId,
          variantId: variantId || null
        }
      });

      if (cartItem) {
        // Update quantity if item already exists
        const newQuantity = cartItem.quantity + quantity;

        // Check inventory
        if (product.inventoryTracking && product.stockQuantity < newQuantity) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stockQuantity} items available in stock`
          });
        }

        await cartItem.update({ quantity: newQuantity });
      } else {
        // Check inventory
        if (product.inventoryTracking && product.stockQuantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stockQuantity} items available in stock`
          });
        }

        // Add new item to cart
        cartItem = await Cart.create({
          userId,
          productId,
          variantId: variantId || null,
          quantity,
          customOptions
        });
      }

      // Populate the cart item for response
      const populatedCartItem = await this.populateCartItem(cartItem);

      res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        cartItem: populatedCartItem
      });
    } catch (error) {
      logger.logError(error, { action: 'add_to_cart', userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Server error occurred while adding item to cart',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get user's shopping cart
   */
  async getUserCart(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get all cart items for the user
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'images', 'isActive', 'stockQuantity', 'inventoryTracking']
          },
          {
            model: ProductVariant,
            as: 'variant',
            attributes: ['id', 'name', 'price', 'sku', 'stockQuantity']
          }
        ],
        order: [['addedAt', 'DESC']]
      });

      // Calculate totals
      let subtotal = 0;
      let itemCount = 0;

      const populatedItems = cartItems.map(item => {
        // Calculate item total (using variant price if available, otherwise product price)
        const itemTotal = (item.variant?.price || item.product?.price || 0) * item.quantity;
        subtotal += itemTotal;
        itemCount += item.quantity;

        return {
          ...item.toJSON(),
          itemTotal,
          product: item.product,
          variant: item.variant
        };
      });

      res.status(200).json({
        success: true,
        cart: {
          items: populatedItems,
          subtotal,
          itemCount,
          total: subtotal
        }
      });
    } catch (error) {
      logger.logError(error, { action: 'get_user_cart', userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching cart',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(req, res) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0'
        });
      }

      // Find cart item
      const cartItem = await Cart.findByPk(itemId);
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }

      // Verify ownership
      if (cartItem.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this cart item'
        });
      }

      // Get associated product
      const product = await Product.findByPk(cartItem.productId);

      // Check inventory
      if (product.inventoryTracking && product.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} items available in stock`
        });
      }

      // Update quantity
      await cartItem.update({ quantity });

      // Populate the updated cart item
      const populatedCartItem = await this.populateCartItem(cartItem);

      res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        cartItem: populatedCartItem
      });
    } catch (error) {
      logger.logError(error, { action: 'update_cart_item', itemId: req.params.itemId, userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating cart item',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Remove item from shopping cart
   */
  async removeFromCart(req, res) {
    try {
      const { itemId } = req.params;
      const userId = req.user?.id || null;

      // Check if user is authenticated
      if (!req.user || !userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Find cart item
      const cartItem = await Cart.findByPk(itemId);
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }

      // Verify ownership
      if (cartItem.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to remove this cart item'
        });
      }

      await cartItem.destroy();

      res.status(200).json({
        success: true,
        message: 'Cart item removed successfully'
      });
    } catch (error) {
      logger.logError(error, { action: 'remove_from_cart', itemId: req.params.itemId, userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Server error occurred while removing cart item',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Clear user's shopping cart
   */
  async clearCart(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Remove all items from user's cart
      await Cart.destroy({
        where: { userId }
      });

      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } catch (error) {
      logger.logError(error, { action: 'clear_cart', userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Server error occurred while clearing cart',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get cart summary (item count and subtotal)
   */
  async getCartSummary(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get all cart items for the user
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'price']
          }
        ]
      });

      // Calculate totals
      let subtotal = 0;
      let itemCount = 0;

      cartItems.forEach(item => {
        // Calculate item total (using variant price if available, otherwise product price)
        const itemTotal = (item.variant?.price || item.product?.price || 0) * item.quantity;
        subtotal += itemTotal;
        itemCount += item.quantity;
      });

      res.status(200).json({
        success: true,
        summary: {
          itemCount,
          subtotal,
          total: subtotal
        }
      });
    } catch (error) {
      logger.logError(error, { action: 'get_cart_summary', userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching cart summary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Merge guest cart with user cart (useful during checkout after login)
   */
  async mergeCarts(req, res) {
    try {
      const userId = req.user?.id || null;
      const { guestCartItems } = req.body; // Array of guest cart items to merge

      // Check if user is authenticated
      if (!req.user || !userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!guestCartItems || !Array.isArray(guestCartItems)) {
        return res.status(400).json({
          success: false,
          message: 'Guest cart items are required and must be an array'
        });
      }

      let mergedCount = 0;

      for (const guestItem of guestCartItems) {
        const { productId, variantId, quantity, customOptions } = guestItem;

        // Check if item already exists in user's cart
        let existingItem = await Cart.findOne({
          where: {
            userId,
            productId,
            variantId: variantId || null
          }
        });

        if (existingItem) {
          // Merge quantities
          const product = await Product.findByPk(productId);
          const newQuantity = existingItem.quantity + quantity;

          if (product.inventoryTracking && product.stockQuantity < newQuantity) {
            // Skip this item if not enough inventory
            continue;
          }

          await existingItem.update({ quantity: newQuantity });
        } else {
          // Add new item to user's cart
          const product = await Product.findByPk(productId);

          if (product.inventoryTracking && product.stockQuantity < quantity) {
            // Skip this item if not enough inventory
            continue;
          }

          await Cart.create({
            userId,
            productId,
            variantId: variantId || null,
            quantity,
            customOptions
          });
        }

        mergedCount++;
      }

      // Get updated cart
      const updatedCart = await this.getUserCart(req);

      res.status(200).json({
        success: true,
        message: `${mergedCount} items merged successfully`,
        cart: updatedCart.cart
      });
    } catch (error) {
      logger.logError(error, { action: 'merge_carts', userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Server error occurred while merging carts',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Helper method to populate cart item with product/variant data
   * @param {Object} cartItem - The cart item to populate
   * @returns {Object} - Populated cart item with product and variant details
   */
  async populateCartItem(cartItem) {
    // In a real implementation, we'd populate related data
    // This is simplified for now
    try {
      return {
        ...cartItem.toJSON(),
        product: await Product.findByPk(cartItem.productId),
        variant: cartItem.variantId ? await ProductVariant.findByPk(cartItem.variantId) : null
      };
    } catch (error) {
      logger.logError(error, { action: 'populate_cart_item' });
      return cartItem.toJSON();
    }
  }
}

module.exports = new CartController();
