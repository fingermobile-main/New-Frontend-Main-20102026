const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const EcommerceService = require("../services/ecommerceService");

// Apply admin authentication to all e-commerce routes
router.use(requireAdmin);

// Create a new product
router.post("/products", async (req, res) => {
  try {
    const memberId = req.member.id;
    const productData = req.body;

    if (!productData.name || !productData.price) {
      return res.status(400).json({success: false,
  message: "Product name and price are required"
      });
    }

    const result = await EcommerceService.createProduct(memberId, productData);

    res.status(201).json({success: true,
  message: result.message,
  data: result.product
    });
  } catch (error) {
    logger.error("Error creating, product:", error);
    res.status(500).json({success: false,
  message: "Failed to create product",
  error: error.message
    });
  }
});

// Get products
router.get("/products", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { category, searchTerm, limit } = req.query;

    const result = await EcommerceService.getProducts(memberId, {category: category || null,
  searchTerm: searchTerm || null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.products
    });
  } catch (error) {
    logger.error("Error getting, products:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve products",
  error: error.message
    });
  }
});

// Update a product
router.put("/products/:productId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { productId } = req.params;
    const productData = req.body;

    const result = await EcommerceService.updateProduct(
      memberId,
      parseInt(productId),
      productData,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.product
    });
  } catch (error) {
    logger.error("Error updating, product:", error);
    res.status(500).json({success: false,
  message: "Failed to update product",
  error: error.message
    });
  }
});

// Delete a product
router.delete("/products/:productId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { productId } = req.params;

    const result = await EcommerceService.deleteProduct(
      memberId,
      parseInt(productId),
    );

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error deleting, product:", error);
    res.status(500).json({success: false,
  message: "Failed to delete product",
  error: error.message
    });
  }
});

// Create a category
router.post("/categories", async (req, res) => {
  try {
    const memberId = req.member.id;
    const categoryData = req.body;

    if (!categoryData.name) {
      return res.status(400).json({success: false,
  message: "Category name is required"
      });
    }

    const result = await EcommerceService.createCategory(
      memberId,
      categoryData,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result.category
    });
  } catch (error) {
    logger.error("Error creating, category:", error);
    res.status(500).json({success: false,
  message: "Failed to create category",
  error: error.message
    });
  }
});

// Get categories
router.get("/categories", async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await EcommerceService.getCategories(memberId);

    res.status(200).json({success: true,
  message: result.message,
  data: result.categories
    });
  } catch (error) {
    logger.error("Error getting, categories:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve categories",
  error: error.message
    });
  }
});

// Create an order
router.post("/orders", async (req, res) => {
  try {
    const memberId = req.member.id;
    const orderData = req.body;

    if (!orderData.items || !orderData.totalAmount) {
      return res.status(400).json({success: false,
  message: "Order items and total amount are required"
      });
    }

    const result = await EcommerceService.createOrder(memberId, orderData);

    res.status(201).json({success: true,
  message: result.message,
  data: result.order
    });
  } catch (error) {
    logger.error("Error creating, order:", error);
    res.status(500).json({success: false,
  message: "Failed to create order",
  error: error.message
    });
  }
});

// Get orders
router.get("/orders", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { status, customerId, limit } = req.query;

    const result = await EcommerceService.getOrders(memberId, {status: status || null,
  customerId: customerId ? parseInt(customerId) : null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.orders
    });
  } catch (error) {
    logger.error("Error getting, orders:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve orders",
  error: error.message
    });
  }
});

// Update order status
router.put("/orders/:orderId/status", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({success: false,
  message: "Order status is required"
      });
    }

    const result = await EcommerceService.updateOrderStatus(
      memberId,
      parseInt(orderId),
      status,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.order
    });
  } catch (error) {
    logger.error("Error updating order, status:", error);
    res.status(500).json({success: false,
  message: "Failed to update order status",
  error: error.message
    });
  }
});

module.exports = router;
