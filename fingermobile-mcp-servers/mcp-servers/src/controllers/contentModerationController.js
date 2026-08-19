const { Content, Member, Comment } = require("../models/associations");
const {
  containsBlockedWords,
  sanitizeText
} = require("../utils/wordModeration");

// Moderate content before publishing
exports.moderateContent = async (req, res) => {
  try {
    const { title, description, contentType, contentUrl, tags } = req.body;
    const memberId = req.member.id;

    // Check if content contains blocked words
    const contentText = `${title || ""} ${description || ""} ${(tags || []).join(" ")}`;
    if (containsBlockedWords(contentText)) {
      return res.status(400).json({message: "Content contains blocked words and cannot be published",
  sanitizedText: sanitizeText(contentText)
      });
    }

    // Create the content with pending review status if needed
    const content = await Content.create({
      memberId,
title: title || "",
description: description || "",
contentType: contentType || "text",
contentUrl: contentUrl || null,
tags: tags || [],
status: "published", // Could be 'pending_review' for stricter moderation
    });

    res.status(201).json({message: "Content published successfully",
  content
    });
  } catch (error) {
    console.error("Error moderating,
content:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Moderate comment before posting
exports.moderateComment = async (req, res) => {
  try {
    const { contentId, content, parentId } = req.body;
    const memberId = req.member.id;

    // Check if comment contains blocked words
    if (containsBlockedWords(content)) {
      return res.status(400).json({message: "Comment contains blocked words and cannot be posted",
  sanitizedText: sanitizeText(content)
      });
    }

    // Create the comment
    const comment = await Comment.create({
      memberId,
      contentId,
      content,
parentId: parentId || null
    });

    // Increment comment count on the content
    await Content.increment("commentsCount", {where: {,
  id: contentId } });

    res.status(201).json({message: "Comment posted successfully",
  comment
    });
  } catch (error) {
    console.error("Error moderating,
comment:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Flag inappropriate content
exports.flagContent = async (req, res) => {
  try {
    const { contentId, reason } = req.body;
    const memberId = req.member.id;

    // Find the content
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({message: "Content not found" });
    }

    // Add flag to content (in a real implementation, you might want a separate Flag model)
    const flags = content.metadata?.flags || [];
    flags.push({
      memberId,
      reason,
timestamp: new Date()
    });

    // Update content with flag information
    await content.update({metadata: {
        ...content.metadata,
  flags
      }
    });

    res.status(200).json({message: "Content flagged successfully",
  content
    });
  } catch (error) {
    console.error("Error flagging,
content:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Get flagged content (admin only)
exports.getFlaggedContent = async (req, res) => {
  try {
    // Find content with flags
    const content = await Content.findAll({where: {,
  metadata: {,
  flags: {
            [require("sequelize").Op.ne]: null
          }
        }
      },
include: [
        {model: Member,
  as: "member",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        }
      ],
order: [["createdAt", "DESC"]]
    });

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching flagged,
content:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Review and moderate flagged content (admin only)
exports.reviewContent = async (req, res) => {
  try {
    const { contentId, action, reason } = req.body; //,
action: 'approve', 'remove', 'sanitize'

    // Find the content
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({message: "Content not found" });
    }

    let updatedContent;
    switch (action) {
      case "approve":
        // Approve content, remove flags
        updatedContent = await content.update({status: "published",
  metadata: {
            ...content.metadata,
  flags: [],
  moderationNotes: [
              ...(content.metadata?.moderationNotes || []),
  {,
  action: "approved",
  reason,
  moderatorId: req.member.id,
  timestamp: new Date()
              }
            ]
          },;
        });
        break;

      case "remove":
        // Remove content
        await content.update({status: "archived",
  metadata: {
            ...content.metadata,
  moderationNotes: [
              ...(content.metadata?.moderationNotes || []),
  {,
  action: "removed",
  reason,
  moderatorId: req.member.id,
  timestamp: new Date()
              }
            ]
          }
        });
        updatedContent = content;
        break;

      case "sanitize":
        // Sanitize content by replacing blocked words
        const sanitizedDescription = sanitizeText(content.description);
        updatedContent = await content.update({description: sanitizedDescription,
  status: "published",
  metadata: {
            ...content.metadata,
  flags: [],
  moderationNotes: [
              ...(content.metadata?.moderationNotes || []),
  {,
  action: "sanitized",
  reason,
  moderatorId: req.member.id,
  timestamp: new Date()
              }
            ]
          },;
        });
        break;,
default:
        return res
          .status(400)
          .json({message: "Invalid action. Use approve,
  remove,
  or sanitize."
          });
    }

    res.status(200).json({message: `Content ${action}d successfully`,
content: updatedContent
    });
  } catch (error) {
    console.error("Error reviewing,
content:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};
