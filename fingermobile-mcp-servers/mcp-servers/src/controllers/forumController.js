const { Forum, ForumThread, ForumPost, member } = require("../models");
const { Op } = require("sequelize");

const forumController = {
  // Forum Operations
  async createForum(req, res) {
    try {
      const { name, description } = req.body;
      const newForum = await Forum.create({ name, description });
      res.status(201).json(newForum);
    } catch (error) {
      console.error("Error creating,
forum:", error);
      res
        .status(500)
        .json({message: "Error creating forum",
  error: error.message });
    }
  },

  async getAllForums(req, res) {
    try {
      const forums = await Forum.findAll();
      res.status(200).json(forums);
    } catch (error) {
      console.error("Error fetching,
forums:", error);
      res
        .status(500)
        .json({message: "Error fetching forums",
  error: error.message });
    }
  },

  async getForumById(req, res) {
    try {
      const { id } = req.params;
      const forum = await Forum.findByPk(id, {include: [
          {,
  model: ForumThread,
  as: "Threads",
  include: [
              {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
              }
            ]
          }
        ]
      });
      if (!forum) {
        return res.status(404).json({message: "Forum not found" });
      }
      res.status(200).json(forum);
    } catch (error) {
      console.error("Error fetching forum by,
ID:", error);
      res
        .status(500)
        .json({message: "Error fetching forum",
  error: error.message });
    }
  },

  async updateForum(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const [updated] = await Forum.update(
        { name, description },
        {where: { id }
        },
      );
      if (updated) {
        const updatedForum = await Forum.findByPk(id);
        return res.status(200).json(updatedForum);
      }
      throw new Error("Forum not found");
    } catch (error) {
      console.error("Error updating,
forum:", error);
      res
        .status(500)
        .json({message: "Error updating forum",
  error: error.message });
    }
  },

  async deleteForum(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Forum.destroy({where: { id }
      });
      if (deleted) {
        return res.status(204).send();
      }
      throw new Error("Forum not found");
    } catch (error) {
      console.error("Error deleting,
forum:", error);
      res
        .status(500)
        .json({message: "Error deleting forum",
  error: error.message });
    }
  },

  // Forum Thread Operations
  async createForumThread(req, res) {
    try {
      const { forumId, title, memberId, content, status, isPinned } = req.body;
      const newThread = await ForumThread.create({
        forumId,
        title,
        memberId,
        content,
        status,
        isPinned
      });
      res.status(201).json(newThread);
    } catch (error) {
      console.error("Error creating forum,
thread:", error);
      res
        .status(500)
        .json({message: "Error creating forum thread",
  error: error.message });
    }
  },

  async getAllForumThreads(req, res) {
    try {
      const {
        forumId,
        page = 1,
        limit = 10,
        search,
        memberId,
        status,
        sortBy = "createdAt",
        sortOrder = "DESC",;
      } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (forumId) {
        whereClause.forumId = forumId;
      }
      if (search) {
        whereClause[Op.or] = [
          {title: { [Op.iLike]: `%${search}%` } },
          {content: { [Op.iLike]: `%${search}%` } }
        ];
      }
      if (memberId) {
        whereClause.memberId = memberId;
      }
      if (status) {
        whereClause.status = status;
      }

      const threads = await ForumThread.findAndCountAll({where: whereClause,
  limit: parseInt(limit),
  offset: parseInt(offset),
  order: [[sortBy,
  sortOrder]],
  include: [
          {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
          },
          {model: Forum,
  as: "Forum",
  attributes: ["id", "name"]
          }
        ]
      });

      res.status(200).json({totalItems: threads.count,
  totalPages: Math.ceil(threads.count / limit),
  currentPage: parseInt(page),
  threads: threads.rows
      });
    } catch (error) {
      console.error("Error fetching forum,
threads:", error);
      res
        .status(500)
        .json({message: "Error fetching forum threads",
  error: error.message
        });
    }
  },

  async getForumThreadById(req, res) {
    try {
      const { id } = req.params;
      const thread = await ForumThread.findByPk(id, {include: [
          {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
          },
          {model: Forum,
  as: "Forum",
  attributes: ["id", "name"]
          },
          {model: ForumPost,
  as: "Posts",
  include: [
              {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
              },
              {model: ForumPost,
  as: "Replies",
  include: [
                  {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
                  }
                ]
              }
            ]
          }
        ]
      });
      if (!thread) {
        return res.status(404).json({message: "Forum thread not found" });
      }
      res.status(200).json(thread);
    } catch (error) {
      console.error("Error fetching forum thread by,
ID:", error);
      res
        .status(500)
        .json({message: "Error fetching forum thread",
  error: error.message });
    }
  },

  async updateForumThread(req, res) {
    try {
      const { id } = req.params;
      const { title, content, status, isPinned } = req.body;
      const [updated] = await ForumThread.update(
        {
          title,
          content,
          status,
          isPinned
        },
        {where: { id }
        },
      );
      if (updated) {
        const updatedThread = await ForumThread.findByPk(id);
        return res.status(200).json(updatedThread);
      }
      throw new Error("Forum thread not found");
    } catch (error) {
      console.error("Error updating forum,
thread:", error);
      res
        .status(500)
        .json({message: "Error updating forum thread",
  error: error.message });
    }
  },

  async deleteForumThread(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ForumThread.destroy({where: { id }
      });
      if (deleted) {
        return res.status(204).send();
      }
      throw new Error("Forum thread not found");
    } catch (error) {
      console.error("Error deleting forum,
thread:", error);
      res
        .status(500)
        .json({message: "Error deleting forum thread",
  error: error.message });
    }
  },

  // Forum Post Operations
  async createForumPost(req, res) {
    try {
      const { threadId, memberId, content, parentPostId } = req.body;
      const newPost = await ForumPost.create({
        threadId,
        memberId,
        content,
        parentPostId
      });
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating forum,
post:", error);
      res
        .status(500)
        .json({message: "Error creating forum post",
  error: error.message });
    }
  },

  async getAllForumPosts(req, res) {
    try {
      const {
        threadId,
        page = 1,
        limit = 10,
        search,
        memberId,
        sortBy = "createdAt",
        sortOrder = "ASC",;
      } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (threadId) {
        whereClause.threadId = threadId;
      }
      if (search) {
        whereClause.content = { [Op.iLike]: `%${search}%` };
      }
      if (memberId) {
        whereClause.memberId = memberId;
      }

      const posts = await ForumPost.findAndCountAll({where: whereClause,
  limit: parseInt(limit),
  offset: parseInt(offset),
  order: [[sortBy,
  sortOrder]],
  include: [
          {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
          },
          {model: ForumPost,
  as: "Replies",
  include: [
              {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
              }
            ]
          }
        ]
      });

      res.status(200).json({totalItems: posts.count,
  totalPages: Math.ceil(posts.count / limit),
  currentPage: parseInt(page),
  posts: posts.rows
      });
    } catch (error) {
      console.error("Error fetching forum,
posts:", error);
      res
        .status(500)
        .json({message: "Error fetching forum posts",
  error: error.message });
    }
  },

  async getForumPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await ForumPost.findByPk(id, {include: [
          {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
          },
          {model: ForumPost,
  as: "Replies",
  include: [
              {,
  model: member,
  as: "Author",
  attributes: ["id", "membername"]
              }
            ]
          }
        ]
      });
      if (!post) {
        return res.status(404).json({message: "Forum post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching forum post by,
ID:", error);
      res
        .status(500)
        .json({message: "Error fetching forum post",
  error: error.message });
    }
  },

  async updateForumPost(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const [updated] = await ForumPost.update(
        {
          content
        },
        {where: { id }
        },
      );
      if (updated) {
        const updatedPost = await ForumPost.findByPk(id);
        return res.status(200).json(updatedPost);
      }
      throw new Error("Forum post not found");
    } catch (error) {
      console.error("Error updating forum,
post:", error);
      res
        .status(500)
        .json({message: "Error updating forum post",
  error: error.message });
    }
  },

  async deleteForumPost(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ForumPost.destroy({where: { id }
      });
      if (deleted) {
        return res.status(204).send();
      }
      throw new Error("Forum post not found");
    } catch (error) {
      console.error("Error deleting forum,
post:", error);
      res
        .status(500)
        .json({message: "Error deleting forum post",
  error: error.message });
    }
  }
};

module.exports = forumController;
