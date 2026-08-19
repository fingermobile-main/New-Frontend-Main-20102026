const { Product, member } = require("../models/associations");
const { Op } = require("sequelize");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;
    const sellerId = req.member.id; // Assuming member is authenticated

    const product = await Product.create({
      name,
      description,
      price,
      sellerId,
      category,
      imageUrl,
      stock
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating,
product:", error);
    return res.status(500).json({message: "Error creating product",
  error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
      category,
      sellerId,
      search,;
    } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (category) {
      where.category = category;
    }
    if (sellerId) {
      where.sellerId = sellerId;
    }
    if (search) {
      where[Op.or] = [
        {name: { [Op.like]: `%${search}%` } },
        {description: { [Op.like]: `%${search}%` } }
      ];
    }

    const products = await Product.findAndCountAll({
      where,
include: [
        {model: member,
  as: "seller",
  attributes: ["id", "membername", "profilePictureUrl"]
        }
      ],
limit: parseInt(limit),
offset: parseInt(offset),
order: [[sortBy, sortOrder.toUpperCase()]]
    });

    return res.status(200).json({totalItems: products.count,
  currentPage: parseInt(page),
  totalPages: Math.ceil(products.count / limit),
  products: products.rows
    });
  } catch (error) {
    console.error("Error fetching,
products:", error);
    return res.status(500).json({message: "Error fetching products",
  error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {include: [
        {,
  model: member,
  as: "seller",
  attributes: ["id", "membername", "profilePictureUrl"]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching,
product:", error);
    return res.status(500).json({message: "Error fetching product",
  error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, imageUrl, stock, status } =
      req.body;
    const sellerId = req.member.id; // Assuming member is authenticated

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({message: "Product not found" });
    }

    // Only seller can update their own product
    if (product.sellerId !== sellerId) {
      return res
        .status(403)
        .json({message: "Unauthorized to update this product" });
    }

    await product.update({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      status
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating,
product:", error);
    return res.status(500).json({message: "Error updating product",
  error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.member.id; // Assuming member is authenticated

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({message: "Product not found" });
    }

    // Only seller can delete their own product
    if (product.sellerId !== sellerId) {
      return res
        .status(403)
        .json({message: "Unauthorized to delete this product" });
    }

    await product.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting,
product:", error);
    return res.status(500).json({message: "Error deleting product",
  error });
  }
};
