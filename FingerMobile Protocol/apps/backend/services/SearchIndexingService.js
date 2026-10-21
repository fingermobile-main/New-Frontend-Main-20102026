/**
 * Search Indexing Service
 * Handles indexing of content for search functionality
 */

const logger = require('../utils/logger');
const pool = require('../database/connection');
const SearchService = require('./SearchService');

class SearchIndexingService {
  constructor() {
    this.isRunning = false;
    this.batchSize = 100;
    this.intervalMs = 60000; // 1 minute
  }

  /**
   * Start background indexing
   */
  start() {
    if (this.isRunning) {
      logger.info('SearchIndexingService already running');
      return;
    }

    this.isRunning = true;
    logger.info('✅ SearchIndexingService started');

    // Initial sync
    this.syncNewDocuments().catch(err => {
      logger.error('Initial sync failed:', err);
    });

    // Periodic sync
    this.interval = setInterval(() => {
      this.syncNewDocuments().catch(err => {
        logger.error('Periodic sync failed:', err);
      });
    }, this.intervalMs);
  }

  /**
   * Stop background indexing
   */
  stop() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
    logger.info('SearchIndexingService stopped');
  }

  /**
   * Sync new/updated documents
   */
  async syncNewDocuments() {
    try {
      await this.syncUsers();
      await this.syncPosts();
      await this.syncProducts();

      logger.info('✅ Sync completed');
    } catch (error) {
      logger.error('Error in syncNewDocuments:', error);
    }
  }

  /**
   * Sync users to Elasticsearch
   */
  async syncUsers() {
    const query = `
      SELECT id, name, email, username, bio, location, created_at, 
             follower_count, is_verified
      FROM users
      WHERE deleted_at IS NULL
        AND updated_at > NOW() - INTERVAL '1 minute'
      LIMIT $1
    `;

    const result = await pool.query(query, [this.batchSize]);

    for (const user of result.rows) {
      try {
        await SearchService.indexDocument(SearchService.indices.users, user.id, {
          ...user,
          follower_count: user.follower_count || 0,
          is_verified: user.is_verified || false
        });
      } catch (error) {
        logger.error(`Failed to index user ${user.id}:`, error);
      }
    }

    if (result.rows.length > 0) {
      logger.info(`Indexed ${result.rows.length} users`);
    }
  }

  /**
   * Sync posts to Elasticsearch
   */
  async syncPosts() {
    const query = `
      SELECT id, user_id, title, content, tags, category, like_count,
             comment_count, view_count, created_at, updated_at, status
      FROM posts
      WHERE status = 'published'
        AND updated_at > NOW() - INTERVAL '1 minute'
      LIMIT $1
    `;

    const result = await pool.query(query, [this.batchSize]);

    for (const post of result.rows) {
      try {
        await SearchService.indexDocument(SearchService.indices.posts, post.id, {
          ...post,
          like_count: post.like_count || 0,
          comment_count: post.comment_count || 0,
          view_count: post.view_count || 0,
          is_published: true
        });
      } catch (error) {
        logger.error(`Failed to index post ${post.id}:`, error);
      }
    }

    if (result.rows.length > 0) {
      logger.info(`Indexed ${result.rows.length} posts`);
    }
  }

  /**
   * Sync products to Elasticsearch
   */
  async syncProducts() {
    // Implementation similar to users/posts
    logger.info('Product sync not yet implemented');
  }

  /**
   * Index single document immediately
   */
  async indexNow(type, id) {
    try {
      switch (type) {
      case 'user':
        {
          const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
          if (user.rows.length > 0) {
            await SearchService.indexDocument(SearchService.indices.users, id, user.rows[0]);
          }
        }
        break;
      case 'post':
        {
          const post = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
          if (post.rows.length > 0) {
            await SearchService.indexDocument(SearchService.indices.posts, id, post.rows[0]);
          }
        }
        break;
      }
    } catch (error) {
      logger.error(`Error indexing ${type} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete document from index
   */
  async deleteNow(type, id) {
    try {
      let index;
      switch (type) {
      case 'user':
        index = SearchService.indices.users;
        break;
      case 'post':
        index = SearchService.indices.posts;
        break;
      default:
        throw new Error(`Unknown type: ${type}`);
      }

      await SearchService.deleteDocument(index, id);
    } catch (error) {
      logger.error(`Error deleting ${type} ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new SearchIndexingService();
