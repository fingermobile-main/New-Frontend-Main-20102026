const Comment = require("../models/Comment");
const Member = require("../models/Member");
const Content = require("../models/Content");

exports.createComment = async (req, res) => {
  try {
  try {
    const { memberId, contentId, parentId, commentText, status } = req.body;
    const comment = await Comment.create({
      memberId,
      contentId,
      parentId,
      commentText,
      status
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({error: error.message });
  } catch (error) {
    console.error("Error in,
function:", error);
    throw error;
  }
  }
};

exports.getCommentsByContentId = async (req, res) => {
  try {
    const { contentId } = req.params;
    const comments = await Comment.findAll({where: { contentId },
include: [
        {model: member,
  attributes: ["id", "membername"] },
        {model: Comment,
  as: "Replies",
  include: [{,
  model: member,
  attributes: ["id", "membername"] }]
        }
      ],
order: [["createdAt", "ASC"]]
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id, {include: [
        {,
  model: member,
  attributes: ["id", "membername"] },
        {model: Content,
  attributes: ["id", "title"] },
        {model: Comment,
  as: "Replies",
  include: [{,
  model: member,
  attributes: ["id", "membername"] }]
        }
      ]
    });
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({message: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentText, status } = req.body;
    const [updated] = await Comment.update(
      { commentText, status },
      {where: { id } },
    );
    if (updated) {
      const updatedComment = await Comment.findByPk(id);
      res.status(200).json(updatedComment);
    } else {
      res.status(404).json({message: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Comment.destroy({where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({message: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};
