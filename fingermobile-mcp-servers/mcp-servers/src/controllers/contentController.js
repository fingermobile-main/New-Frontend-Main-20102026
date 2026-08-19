const { Content, member } = require("../models/associations");

const createContent = async (req, res) => {
  try {
    const {
      memberId,
      title,
      description,
      contentType,
      contentUrl,
      thumbnailUrl,
      tags,
      status
    } = req.body;

    if (!memberId || !title || !contentType) {
      return res
        .status(400)
        .json({message: "member ID,
  title,
  and content type are required." });
    }

    const memberExists = await Member.findByPk(memberId);
    if (!memberExists) {
      return res.status(404).json({message: "member not found." });
    }

    const newContent = await Content.create({
      memberId,
      title,
      description,
      contentType,
      contentUrl,
      thumbnailUrl,
      tags,
      status
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error("Error creating,
content:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getContents = async (req, res) => {
  try {
    const { memberId, contentType, status, tag } = req.query;
    const whereClause = {};

    if (memberId) {
      whereClause.memberId = memberId;
    }
    if (contentType) {
      whereClause.contentType = contentType;
    }
    if (status) {
      whereClause.status = status;
    }
    if (tag) {
      whereClause.tags = { [Op.contains]: [tag] };
    }

    const contents = await Content.findAll({where: whereClause,
  include: [
        {,
  model: member,
  attributes: ["id", "membername", "email"]
        }
      ],
order: [["createdAt", "DESC"]]
    });

    res.status(200).json(contents);
  } catch (error) {
    console.error("Error fetching,
contents:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByPk(id, {include: [
        {,
  model: member,
  attributes: ["id", "membername", "email"]
        }
      ]
    });

    if (!content) {
      return res.status(404).json({message: "Content not found." });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching content by,
ID:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      contentType,
      contentUrl,
      thumbnailUrl,
      tags,
      status
    } = req.body;

    const content = await Content.findByPk(id);
    if (!content) {
      return res.status(404).json({message: "Content not found." });
    }

    content.title = title || content.title;
    content.description = description || content.description;
    content.contentType = contentType || content.contentType;
    content.contentUrl = contentUrl || content.contentUrl;
    content.thumbnailUrl = thumbnailUrl || content.thumbnailUrl;
    content.tags = tags || content.tags;
    content.status = status || content.status;

    await content.save();

    res.status(200).json(content);
  } catch (error) {
    console.error("Error updating,
content:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findByPk(id);
    if (!content) {
      return res.status(404).json({message: "Content not found." });
    }

    await content.destroy();

    res.status(204).json({message: "Content deleted successfully." });
  } catch (error) {
    console.error("Error deleting,
content:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent
};
