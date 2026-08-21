const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class EcommerceService {
  // Create a new product
  static async createProduct(memberId, productData) {
    try {
      const {
        name,
        description,
        price,
        currency,
        category,
        inventory,
        images,
        variants,
        attributes
      } = productData;

      if (!name || !price) {
        throw new Error("Product name and price are required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_ecommerce_products 
         (member_id, name, description, price, currency, category, inventory, images, variants, attributes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          memberId,
          name,
          description || "",
          price,
          currency || "USD",
          category || "general",
          inventory || 0,
          images || [],
          variants || [],
          attributes || {}
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "ECOMMERCE_PRODUCT_CREATE", {productId: result.rows[0].id,
  productName: name
      });

      return {success: true,
  product: result.rows[0],
  message: "Product created successfully"
      };
    } catch (error) {
      logger.error("Error creating, product:", error);
      throw error;
    }
  }

  // Get products for a member
  static async getProducts(memberId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_ecommerce_products WHERE member_id = $1`;
      const params = [memberId];

      if (options.category) {
        query += ` AND category = $${params.length + 1}`;
        params.push(options.category);
      }

      if (options.searchTerm) {
        query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
        params.push(`%${options.searchTerm}%`);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  products: result.rows,
  message: "Products retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, products:", error);
      throw error;
    }
  }

  // Update a product
  static async updateProduct(memberId, productId, productData) {
    try {
      // Verify product belongs to member
      const productResult = await identityDb.query(
        `SELECT * FROM stercs_ecommerce_products WHERE id = $1 AND member_id = $2`,
        [productId, memberId],
      );

      if (productResult.rows.length === 0) {
        throw new Error("Product not found or not owned by member");
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is productId

      if (productData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(productData.name);
        paramIndex++;
      }

      if (productData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(productData.description);
        paramIndex++;
      }

      if (productData.price) {
        updateFields.push(`price = $${paramIndex}`);
        updateValues.push(productData.price);
        paramIndex++;
      }

      if (productData.currency) {
        updateFields.push(`currency = $${paramIndex}`);
        updateValues.push(productData.currency);
        paramIndex++;
      }

      if (productData.category) {
        updateFields.push(`category = $${paramIndex}`);
        updateValues.push(productData.category);
        paramIndex++;
      }

      if (productData.inventory !== undefined) {
        updateFields.push(`inventory = $${paramIndex}`);
        updateValues.push(productData.inventory);
        paramIndex++;
      }

      if (productData.images) {
        updateFields.push(`images = $${paramIndex}`);
        updateValues.push(productData.images);
        paramIndex++;
      }

      if (productData.variants) {
        updateFields.push(`variants = $${paramIndex}`);
        updateValues.push(productData.variants);
        paramIndex++;
      }

      if (productData.attributes) {
        updateFields.push(`attributes = $${paramIndex}`);
        updateValues.push(productData.attributes);
        paramIndex++;
      }

      updateValues.push(productId); // Add productId as last value

      const query = `UPDATE stercs_ecommerce_products SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "ECOMMERCE_PRODUCT_UPDATE", {productId: result.rows[0].id,
  productName: result.rows[0].name
      });

      return {success: true,
  product: result.rows[0],
  message: "Product updated successfully"
      };
    } catch (error) {
      logger.error("Error updating, product:", error);
      throw error;
    }
  }

  // Delete a product
  static async deleteProduct(memberId, productId) {
    try {
      // Verify product belongs to member
      const productResult = await identityDb.query(
        `SELECT * FROM stercs_ecommerce_products WHERE id = $1 AND member_id = $2`,
        [productId, memberId],
      );

      if (productResult.rows.length === 0) {
        throw new Error("Product not found or not owned by member");
      }

      await identityDb.query(
        `DELETE FROM stercs_ecommerce_products WHERE id = $1`,
        [productId],
      );

      // Log security event
      await logSecurityEvent(memberId, "ECOMMERCE_PRODUCT_DELETE", {
        productId
      });

      return {success: true,
  message: "Product deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting, product:", error);
      throw error;
    }
  }

  // Create a new category
  static async createCategory(memberId, categoryData) {
    try {
      const { name, description, parentCategoryId } = categoryData;

      if (!name) {
        throw new Error("Category name is required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_ecommerce_categories 
         (member_id, name, description, parent_category_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [memberId, name, description || "", parentCategoryId || null],
      );

      // Log security event
      await logSecurityEvent(memberId, "ECOMMERCE_CATEGORY_CREATE", {categoryId: result.rows[0].id,
  categoryName: name
      });

      return {success: true,
  category: result.rows[0],
  message: "Category created successfully"
      };
    } catch (error) {
      logger.error("Error creating, category:", error);
      throw error;
    }
  }

  // Get categories for a member
  static async getCategories(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_ecommerce_categories WHERE member_id = $1 ORDER BY created_at DESC`,
        [memberId],
      );

      return {success: true,
  categories: result.rows,
  message: "Categories retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, categories:", error);
      throw error;
    }
  }

  // Create a new order
  static async createOrder(memberId, orderData) {
    try {
      const {
        customerId,
        items,
        totalAmount,
        currency,
        shippingAddress,
        billingAddress,
        status
      } = orderData;

      if (!items || !totalAmount) {
        throw new Error("Order items and total amount are required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_ecommerce_orders 
         (member_id, customer_id, items, total_amount, currency, shipping_address, billing_address, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          memberId,
          customerId || null,
          items,
          totalAmount,
          currency || "USD",
          shippingAddress || {},
          billingAddress || {},
          status || "pending"
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "ECOMMERCE_ORDER_CREATE", {orderId: result.rows[0].id,
  totalAmount
      });

      return {success: true,
  order: result.rows[0],
  message: "Order created successfully"
      };
    } catch (error) {
      logger.error("Error creating, order:", error);
      throw error;
    }
  }

  // Get orders for a member
  static async getOrders(memberId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_ecommerce_orders WHERE member_id = $1`;
      const params = [memberId];

      if (options.status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(options.status);
      }

      if (options.customerId) {
        query += ` AND customer_id = $${params.length + 1}`;
        params.push(options.customerId);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  orders: result.rows,
  message: "Orders retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, orders:", error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(memberId, orderId, status) {
    try {
      // Verify order belongs to member
      const orderResult = await identityDb.query(
        `SELECT * FROM stercs_ecommerce_orders WHERE id = $1 AND member_id = $2`,
        [orderId, memberId],
      );

      if (orderResult.rows.length === 0) {
        throw new Error("Order not found or not owned by member");
      }

      const result = await identityDb.query(
        `UPDATE stercs_ecommerce_orders 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [status, orderId],
      );

      // Log security event
      await logSecurityEvent(memberId, "ECOMMERCE_ORDER_UPDATE", {
        orderId,
        status
      });

      return {success: true,
  order: result.rows[0],
  message: "Order status updated successfully"
      };
    } catch (error) {
      logger.error("Error updating order, status:", error);
      throw error;
    }
  }
}

module.exports = EcommerceService;
