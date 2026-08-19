const { Publication, member } = require("../models/associations");
const { Op } = require("sequelize");

exports.createPublication = async (req, res) => {
  try {
    const { title, content, contentType, status, publishedAt } = req.body;
    const authorId = req.member.id; // Assuming member is authenticated

    const publication = await Publication.create({
      title,
      content,
      authorId,
      contentType,
      status,
      publishedAt
    });

    return res.status(201).json(publication);
  } catch (error) {
    console.error("Error creating,
publication:", error);
    return res
      .status(500)
      .json({message: "Error creating publication",
  error });
  }
};

exports.getPublications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
      status,
      contentType,
      authorId,;
    } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }
    if (contentType) {
      where.contentType = contentType;
    }
    if (authorId) {
      where.authorId = authorId;
    }

    const publications = await Publication.findAndCountAll({
      where,
include: [
        {model: member,
  as: "author",
  attributes: ["id", "membername", "profilePictureUrl"]
        }
      ],
limit: parseInt(limit),
offset: parseInt(offset),
order: [[sortBy, sortOrder.toUpperCase()]]
    });

    return res.status(200).json({totalItems: publications.count,
  currentPage: parseInt(page),
  totalPages: Math.ceil(publications.count / limit),
  publications: publications.rows
    });
  } catch (error) {
    console.error("Error fetching,
publications:", error);
    return res
      .status(500)
      .json({message: "Error fetching publications",
  error });
  }
};

exports.getPublicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id, {include: [
        {,
  model: member,
  as: "author",
  attributes: ["id", "membername", "profilePictureUrl"]
        }
      ]
    });

    if (!publication) {
      return res.status(404).json({message: "Publication not found" });
    }

    return res.status(200).json(publication);
  } catch (error) {
    console.error("Error fetching,
publication:", error);
    return res
      .status(500)
      .json({message: "Error fetching publication",
  error });
  }
};

exports.updatePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, contentType, status, publishedAt } = req.body;
    const authorId = req.member.id; // Assuming member is authenticated

    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({message: "Publication not found" });
    }

    // Only author can update their own publication
    if (publication.authorId !== authorId) {
      return res
        .status(403)
        .json({message: "Unauthorized to update this publication" });
    }

    await publication.update({
      title,
      content,
      contentType,
      status,
      publishedAt
    });

    return res.status(200).json(publication);
  } catch (error) {
    console.error("Error updating,
publication:", error);
    return res
      .status(500)
      .json({message: "Error updating publication",
  error });
  }
};

exports.deletePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.member.id; // Assuming member is authenticated

    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({message: "Publication not found" });
    }

    // Only author can delete their own publication
    if (publication.authorId !== authorId) {
      return res
        .status(403)
        .json({message: "Unauthorized to delete this publication" });
    }

    await publication.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting,
publication:", error);
    return res
      .status(500)
      .json({message: "Error deleting publication",
  error });
  }
};
