const { Listing, member, Product } = require("../models/associations");
const { Op } = require("sequelize");

exports.createListing = async (req, res) => {
  try {
    const {
      sellerId,
      productId,
      title,
      description,
      price,
      currency,
      quantity,
      status,
      category,
      imageUrl
    } = req.body;
    const listing = await Listing.create({
      sellerId,
      productId,
      title,
      description,
      price,
      currency,
      quantity,
      status,
      category,
      imageUrl
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const {
      sellerId,
      productId,
      status,
      category,
      minPrice,
      maxPrice,
      search
    } = req.query;
    const where = {};

    if (sellerId) where.sellerId = sellerId;
    if (productId) where.productId = productId;
    if (status) where.status = status;
    if (category) where.category = category;
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice)
      where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    if (search) {
      where[Op.or] = [
        {title: { [Op.iLike]: `%${search}%` } },
        {description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const listings = await Listing.findAll({
      where,
include: [
        {model: member,
  as: "seller",
  attributes: ["id", "membername", "email"]
        },
        {model: Product,
  as: "product",
  attributes: ["id", "name", "description", "price"]
        }
      ]
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByPk(id, {include: [
        {,
  model: member,
  as: "seller",
  attributes: ["id", "membername", "email"]
        },
        {model: Product,
  as: "product",
  attributes: ["id", "name", "description", "price"]
        }
      ]
    });
    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).json({message: "Listing not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Listing.update(req.body, {where: { id }
    });
    if (updated) {
      const updatedListing = await Listing.findByPk(id);
      res.status(200).json(updatedListing);
    } else {
      res.status(404).json({message: "Listing not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Listing.destroy({where: { id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({message: "Listing not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};
