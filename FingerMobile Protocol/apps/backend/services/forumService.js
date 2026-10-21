/**
 * Forum Service Layer
 * Provides business logic for forum operations
 */

const ForumCategory = require('../models/ForumCategory');
const ForumThread = require('../models/ForumThread');
const ForumPost = require('../models/ForumPost');
const User = require('../models/User');
const SavedPost = require('../models/SavedPost');
const VideoRoom = require('../models/VideoRoom');
const PostEditHistory = require('../models/PostEditHistory');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class ForumService {
  /**
   * Get all forum categories
   */
  async getCategories(options = {}) {
    try {
      const { limit, offset, includeStats = false } = options;

      const queryOptions = {
        where: { isActive: true },
        order: [['displayOrder', 'ASC'], ['name', 'ASC']]
      };

      if (limit) queryOptions.limit = parseInt(limit);
      if (offset) queryOptions.offset = parseInt(offset);

      const categories = await ForumCategory.findAll(queryOptions);

      if (includeStats) {
        // Add thread and post counts to each category
        const categoriesWithStats = await Promise.all(categories.map(async (category) => {
          let threadCount = 0;
          try {
            threadCount = await ForumThread.count({ where: { categoryId: category.id } });
          } catch (e) {
            threadCount = 0;
          }
          return {
            ...category.toJSON(),
            threadCount,
            postCount: 0
          };
        }));

        return categoriesWithStats;
      }

      return categories;
    } catch (error) {
      logger.error('Error getting forum categories:', error);
      throw error;
    }
  }

  /**
   * Get threads by category with pagination and sorting
   */
  async getThreadsByCategory(categoryId, options = {}) {
    try {
      const {
        limit = 20,
        offset = 0,
        sortBy = 'latest',
        order = 'DESC'
      } = options;

      let orderField = 'createdAt';
      switch(sortBy) {
      case 'popular':
        orderField = 'viewCount';
        break;
      case 'sticky':
        orderField = 'isSticky';
        break;
      case 'latest':
      default:
        orderField = 'createdAt';
        break;
      }

      // Direct query: forum_threads has category_id field that links directly to forum_categories
      const whereClause = (categoryId && categoryId !== 'all' && categoryId !== '0') ? { categoryId } : {};
      const threads = await ForumThread.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [
          ['isSticky', 'DESC'],
          [orderField, order],
        ],
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }
        ]
      });

      return threads;
    } catch (error) {
      logger.error('Error getting threads by category:', error);
      throw error;
    }
  }

  /**
   * Get posts by thread with pagination and sorting
   */
  async getPostsByThread(threadId, options = {}) {
    try {
      const {
        limit = 20,
        offset = 0,
        sortBy = 'oldest',
        order = sortBy === 'latest' ? 'DESC' : 'ASC'
      } = options;

      const posts = await ForumPost.findAndCountAll({
        where: { threadId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', order]],
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }
        ]
      });

      return posts;
    } catch (error) {
      logger.error('Error getting posts by thread:', error);
      throw error;
    }
  }

  /**
   * Create a new forum thread
   */
  async createThread(userId, categoryId, threadData) {
    try {
      const { title, content, tags = [], isSticky = false, attachments = [], activityType = null } = threadData;

      // Verify category exists
      const category = await ForumCategory.findByPk(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      const thread = await ForumThread.create({
        title,
        content,
        categoryId,
        authorId: userId,
        tags,
        attachments,
        isSticky,
        activityType,
        status: 'active'
      });

      return thread;
    } catch (error) {
      logger.error('Error creating forum thread:', error);
      throw error;
    }
  }

  /**
   * Create a new forum post/reply
   */
  async createPost(userId, postData) {
    try {
      const { content, threadId, parentId = null } = postData;

      // Verify thread exists if provided
      if (threadId) {
        const thread = await ForumThread.findByPk(threadId);
        if (!thread) {
          throw new Error('Thread not found');
        }
      }

      const post = await ForumPost.create({
        content,
        threadId,
        authorId: userId,
        parentId,
        status: 'active'
      });

      // Update reply count in thread if this is a reply to a thread
      if (threadId) {
        await ForumThread.increment({ replyCount: 1 }, { where: { id: threadId } });
      }

      return post;
    } catch (error) {
      logger.error('Error creating forum post:', error);
      throw error;
    }
  }

  /**
   * Update a forum thread
   */
  async updateThread(threadId, userId, updates) {
    try {
      const thread = await ForumThread.findByPk(threadId);
      if (!thread) {
        throw new Error('Thread not found');
      }

      // Verify ownership
      if (thread.authorId !== userId) {
        throw new Error('Unauthorized: Only thread author can update');
      }

      // Remove sensitive fields from updates
      const allowedUpdates = ['title', 'content', 'tags', 'isPinned', 'isLocked', 'activityType'];
      const filteredUpdates = {};

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = value;
        }
      }

      await thread.update(filteredUpdates);
      return thread;
    } catch (error) {
      logger.error('Error updating forum thread:', error);
      throw error;
    }
  }

  /**
   * Update a forum post
   */
  async updatePost(postId, userId, updates) {
    try {
      const post = await ForumPost.findByPk(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Verify ownership
      if (post.authorId !== userId) {
        throw new Error('Unauthorized: Only post author can update');
      }

      // Get current content for history tracking
      const currentContent = post.content;

      // Remove sensitive fields from updates
      const allowedUpdates = ['content', 'isEdited', 'editReason'];
      const filteredUpdates = {};

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = value;
        }
      }

      filteredUpdates.isEdited = true;

      // Update the post
      await post.update(filteredUpdates);

      // Create edit history record
      await PostEditHistory.create({
        postId: postId,
        editorId: userId,
        oldContent: currentContent,
        newContent: filteredUpdates.content
      });

      return post;
    } catch (error) {
      logger.error('Error updating forum post:', error);
      throw error;
    }
  }

  /**
   * Delete a forum thread
   */
  async deleteThread(threadId, userId, isAdmin = false) {
    try {
      const thread = await ForumThread.findByPk(threadId);
      if (!thread) {
        throw new Error('Thread not found');
      }

      // Verify ownership or admin rights
      if (thread.authorId !== userId && !isAdmin) {
        throw new Error('Unauthorized: Only thread author or admin can delete');
      }

      await thread.destroy();
      return true;
    } catch (error) {
      logger.error('Error deleting forum thread:', error);
      throw error;
    }
  }

  /**
   * Delete a forum post
   */
  async deletePost(postId, userId, isAdmin = false) {
    try {
      const post = await ForumPost.findByPk(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Verify ownership or admin rights
      if (post.authorId !== userId && !isAdmin) {
        throw new Error('Unauthorized: Only post author or admin can delete');
      }

      await post.destroy();
      return true;
    } catch (error) {
      logger.error('Error deleting forum post:', error);
      throw error;
    }
  }

  /**
   * Search forum posts
   */
  async searchPosts(query, options = {}) {
    try {
      const { limit = 10, offset = 0, filters = {} } = options;

      if (!query) {
        throw new Error('Search query is required');
      }

      let whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } }
        ],
        status: 'active'
      };

      // Apply filters if provided
      if (filters.categoryId) {
        whereClause.categoryId = filters.categoryId;
      }

      if (filters.authorId) {
        whereClause.authorId = filters.authorId;
      }

      if (filters.tags && Array.isArray(filters.tags)) {
        whereClause.tags = { [Op.overlap]: filters.tags };
      }

      const posts = await ForumPost.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: ForumThread,
            as: 'thread',
            attributes: ['id', 'title']
          },
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }
        ]
      });

      return posts;
    } catch (error) {
      logger.error('Error searching forum posts:', error);
      throw error;
    }
  }

  /**
   * Report a forum post
   */
  async reportPost(postId, userId, reportData) {
    try {
      const { reason, description } = reportData;

      if (!reason) {
        throw new Error('Report reason is required');
      }

      const post = await ForumPost.findByPk(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Update post status to reported
      await post.update({
        isReported: true,
        reportReason: reason,
        status: 'reported'
      });

      // Log the report
      logger.info(`Post ${postId} reported by user ${userId}. Reason: ${reason}. Description: ${description}`);

      return { success: true, message: 'Post reported successfully' };
    } catch (error) {
      logger.error('Error reporting forum post:', error);
      throw error;
    }
  }

  /**
   * Pin/unpin a forum thread
   */
  async toggleThreadPin(threadId, userId, isAdmin = false, pin = true) {
    try {
      if (!isAdmin) {
        throw new Error('Unauthorized: Only admin can pin/unpin threads');
      }

      const thread = await ForumThread.findByPk(threadId);
      if (!thread) {
        throw new Error('Thread not found');
      }

      await thread.update({ isPinned: pin });
      return { success: true, message: `Thread ${pin ? 'pinned' : 'unpinned'} successfully` };
    } catch (error) {
      logger.error(`Error ${pin ? 'pinning' : 'unpinning'} forum thread:`, error);
      throw error;
    }
  }

  /**
   * Lock/unlock a forum thread
   */
  async toggleThreadLock(threadId, userId, isAdmin = false, lock = true) {
    try {
      if (!isAdmin) {
        throw new Error('Unauthorized: Only admin can lock/unlock threads');
      }

      const thread = await ForumThread.findByPk(threadId);
      if (!thread) {
        throw new Error('Thread not found');
      }

      await thread.update({ isLocked: lock });
      return { success: true, message: `Thread ${lock ? 'locked' : 'unlocked'} successfully` };
    } catch (error) {
      logger.error(`Error ${lock ? 'locking' : 'unlocking'} forum thread:`, error);
      throw error;
    }
  }

  // NEW: Saved Posts functionality
  /**
   * Save a post for a user
   */
  async savePost(userId, postId) {
    try {
      // Verify post exists
      const post = await ForumPost.findByPk(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Create or update the saved post record
      const savedPost = await SavedPost.findOrCreate({
        where: { userId, postId },
        defaults: {
          userId,
          postId
        }
      });

      return { success: true, message: 'Post saved successfully', savedPost: savedPost[0] };
    } catch (error) {
      logger.error('Error saving post:', error);
      throw error;
    }
  }

  /**
   * Unsave a post for a user
   */
  async unsavePost(userId, postId) {
    try {
      const result = await SavedPost.destroy({
        where: { userId, postId }
      });

      if (result === 0) {
        throw new Error('Post was not saved by this user');
      }

      return { success: true, message: 'Post unsaved successfully' };
    } catch (error) {
      logger.error('Error unsaving post:', error);
      throw error;
    }
  }

  /**
   * Get user's saved posts
   */
  async getUserSavedPosts(userId, options = {}) {
    try {
      const {
        limit = 20,
        offset = 0,
        sortBy = 'createdAt',
        order = 'DESC'
      } = options;

      const savedPosts = await SavedPost.findAndCountAll({
        where: { userId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, order]],
        include: [
          {
            model: ForumPost,
            as: 'post',
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'avatar']
              },
              {
                model: ForumThread,
                as: 'thread',
                attributes: ['id', 'title', 'categoryId']
              }
            ]
          }
        ]
      });

      return savedPosts;
    } catch (error) {
      logger.error('Error getting user saved posts:', error);
      throw error;
    }
  }

  // NEW: Video Room functionality
  /**
   * Create a video room
   */
  async createVideoRoom(hostId, roomData) {
    try {
      const { title, type = 'video', maxParticipants = 10 } = roomData;

      const room = await VideoRoom.create({
        hostId,
        title,
        type,
        maxParticipants
      });

      return room;
    } catch (error) {
      logger.error('Error creating video room:', error);
      throw error;
    }
  }

  /**
   * Get active video rooms
   */
  async getActiveVideoRooms(options = {}) {
    try {
      const {
        limit = 20,
        offset = 0,
        type = null
      } = options;

      const whereClause = { status: 'active' };
      if (type) {
        whereClause.type = type;
      }

      const rooms = await VideoRoom.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'username', 'avatar']
          }
        ]
      });

      return rooms;
    } catch (error) {
      logger.error('Error getting active video rooms:', error);
      throw error;
    }
  }

  /**
   * End a video room
   */
  async endVideoRoom(roomId, userId) {
    try {
      const room = await VideoRoom.findByPk(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Only the host can end the room
      if (room.hostId !== userId) {
        throw new Error('Only the host can end this room');
      }

      await room.update({
        status: 'ended',
        endedAt: new Date()
      });

      return { success: true, message: 'Video room ended successfully' };
    } catch (error) {
      logger.error('Error ending video room:', error);
      throw error;
    }
  }

  // NEW: Activity Type functionality
  /**
   * Set activity type for a thread
   */
  async setThreadActivityType(threadId, userId, activityType) {
    try {
      const thread = await ForumThread.findByPk(threadId);
      if (!thread) {
        throw new Error('Thread not found');
      }

      // Verify ownership
      if (thread.authorId !== userId) {
        throw new Error('Unauthorized: Only thread author can set activity type');
      }

      await thread.update({ activityType });

      return { success: true, message: 'Activity type updated successfully', thread };
    } catch (error) {
      logger.error('Error setting thread activity type:', error);
      throw error;
    }
  }
}

module.exports = new ForumService();

