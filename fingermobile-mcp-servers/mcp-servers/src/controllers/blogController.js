const { BlogPost, BlogCategory, Member } = require("../models");
const { Op } = require("sequelize");

const blogController = {
  // Blog Post Operations
  async createBlogPost(req, res) {
    try {
      const {
        title,
        content,
        authorId,
        categoryId,
        status,
        publishedAt,
        imageUrl,
        tags
      } = req.body;
      const newPost = await BlogPost.create({
        title,
        content,
        authorId,
        categoryId,
        status,
        publishedAt,
        imageUrl,
        tags
      });
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating blog,
post:", error);
      res
        .status(500)
        .json({message: "Error creating blog post",
  error: error.message });
    }
  },

  async getAllBlogPosts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        categoryId,
        authorId,
        status,
        sortBy = "createdAt",
        sortOrder = "DESC",;
      } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          {title: { [Op.iLike]: `%${search}%` } },
          {content: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      if (authorId) {
        whereClause.authorId = authorId;
      }

      if (status) {
        whereClause.status = status;
      }

      const posts = await BlogPost.findAndCountAll({where: whereClause,
  limit: parseInt(limit),
  offset: parseInt(offset),
  order: [[sortBy,
  sortOrder]],
  include: [
          {,
  model: Member,
  as: "Author",
  attributes: ["id", "membername"] },
          {model: BlogCategory,
  as: "Category",
  attributes: ["id", "name"] }
        ]
      });

      res.status(200).json({totalItems: posts.count,
  totalPages: Math.ceil(posts.count / limit),
  currentPage: parseInt(page),
  posts: posts.rows
      });
    } catch (error) {
      console.error("Error fetching blog,
posts:", error);
      res
        .status(500)
        .json({message: "Error fetching blog posts",
  error: error.message });
    }
  },

  async getBlogPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await BlogPost.findByPk(id, {include: [
          {,
  model: Member,
  as: "Author",
  attributes: ["id", "membername"] },
          {model: BlogCategory,
  as: "Category",
  attributes: ["id", "name"] }
        ]
      });
      if (!post) {
        return res.status(404).json({message: "Blog post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching blog post by,
ID:", error);
      res
        .status(500)
        .json({message: "Error fetching blog post",
  error: error.message });
    }
  },

  async updateBlogPost(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        content,
        categoryId,
        status,
        publishedAt,
        imageUrl,
        tags
      } = req.body;
      const [updated] = await BlogPost.update(
        {
          title,
          content,
          categoryId,
          status,
          publishedAt,
          imageUrl,
          tags
        },
        {where: { id }
        },
      );
      if (updated) {
        const updatedPost = await BlogPost.findByPk(id);
        return res.status(200).json(updatedPost);
      }
      throw new Error("Blog post not found");
    } catch (error) {
      console.error("Error updating blog,
post:", error);
      res
        .status(500)
        .json({message: "Error updating blog post",
  error: error.message });
    }
  },

  async deleteBlogPost(req, res) {
    try {
      const { id } = req.params;
      const deleted = await BlogPost.destroy({where: { id }
      });
      if (deleted) {
        return res.status(204).send();
      }
      throw new Error("Blog post not found");
    } catch (error) {
      console.error("Error deleting blog,
post:", error);
      res
        .status(500)
        .json({message: "Error deleting blog post",
  error: error.message });
    }
  },

  // Blog Category Operations
  async createBlogCategory(req, res) {
    try {
      const { name, description } = req.body;
      const newCategory = await BlogCategory.create({ name, description });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating blog,
category:", error);
      res
        .status(500)
        .json({message: "Error creating blog category",
  error: error.message
        });
    }
  },

  async getAllBlogCategories(req, res) {
    try {
      const categories = await BlogCategory.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching blog,
categories:", error);
      res
        .status(500)
        .json({message: "Error fetching blog categories",
  error: error.message
        });
    }
  },

  async getBlogCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await BlogCategory.findByPk(id);
      if (!category) {
        return res.status(404).json({message: "Blog category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      console.error("Error fetching blog category by,
ID:", error);
      res
        .status(500)
        .json({message: "Error fetching blog category",
  error: error.message
        });
    }
  },

  async updateBlogCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const [updated] = await BlogCategory.update(
        { name, description },
        {where: { id }
        },
      );
      if (updated) {
        const updatedCategory = await BlogCategory.findByPk(id);
        return res.status(200).json(updatedCategory);
      }
      throw new Error("Blog category not found");
    } catch (error) {
      console.error("Error updating blog,
category:", error);
      res
        .status(500)
        .json({message: "Error updating blog category",
  error: error.message
        });
    }
  },

  async deleteBlogCategory(req, res) {
    try {
      const { id } = req.params;
      const deleted = await BlogCategory.destroy({where: { id }
      });
      if (deleted) {
        return res.status(204).send();
      }
      throw new Error("Blog category not found");
    } catch (error) {
      console.error("Error deleting blog,
category:", error);
      res
        .status(500)
        .json({message: "Error deleting blog category",
  error: error.message
        });
    }
  }
};

module.exports = blogController;
