/**
 * Search Service
 * Provides search functionality across the platform
 */

const logger = require('../utils/logger');
const { Client } = require('@elastic/elasticsearch');
const pool = require('../database/connection');

class SearchService {
  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
      }
    });

    this.indices = {
      users: 'fingermobile_users',
      posts: 'fingermobile_posts',
      products: 'fingermobile_products',
      videos: 'fingermobile_videos',
      forums: 'fingermobile_forums',
      events: 'fingermobile_events'
    };
  }

  /**
   * Initialize indices and mappings
   */
  async initializeIndices() {
    try {
      await this.createUsersIndex();
      await this.createPostsIndex();
      await this.createProductsIndex();
      await this.createVideosIndex();
      await this.createForumsIndex();
      await this.createEventsIndex();

      logger.info('✅ Elasticsearch indices initialized');
    } catch (error) {
      logger.error('Error initializing Elasticsearch indices:', error);
      throw error;
    }
  }

  /**
   * Create users index
   */
  async createUsersIndex() {
    const exists = await this.client.indices.exists({ index: this.indices.users });

    if (!exists.body) {
      await this.client.indices.create({
        index: this.indices.users,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 1,
            analysis: {
              analyzer: {
                custom_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'stop', 'snowball']
                }
              }
            }
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: {
                type: 'text',
                analyzer: 'custom_analyzer',
                fields: {
                  keyword: { type: 'keyword' }
                }
              },
              email: { type: 'keyword' },
              username: {
                type: 'text',
                analyzer: 'custom_analyzer',
                fields: {
                  keyword: { type: 'keyword' }
                }
              },
              bio: { type: 'text', analyzer: 'custom_analyzer' },
              location: { type: 'keyword' },
              created_at: { type: 'date' },
              follower_count: { type: 'integer' },
              is_verified: { type: 'boolean' }
            }
          }
        }
      });
    }
  }

  /**
   * Create posts index
   */
  async createPostsIndex() {
    const exists = await this.client.indices.exists({ index: this.indices.posts });

    if (!exists.body) {
      await this.client.indices.create({
        index: this.indices.posts,
        body: {
          settings: {
            number_of_shards: 2,
            number_of_replicas: 1
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              user_id: { type: 'keyword' },
              title: {
                type: 'text',
                analyzer: 'custom_analyzer',
                boost: 2
              },
              content: { type: 'text', analyzer: 'custom_analyzer' },
              tags: { type: 'keyword' },
              category: { type: 'keyword' },
              like_count: { type: 'integer' },
              comment_count: { type: 'integer' },
              view_count: { type: 'integer' },
              created_at: { type: 'date' },
              updated_at: { type: 'date' },
              is_published: { type: 'boolean' }
            }
          }
        }
      });
    }
  }

  /**
   * Index a document
   */
  async indexDocument(index, id, document) {
    try {
      const result = await this.client.index({
        index,
        id,
        body: document,
        refresh: 'wait_for'
      });

      return result.body;
    } catch (error) {
      logger.error(`Error indexing document in ${index}:`, error);
      throw error;
    }
  }

  /**
   * Search with full-text query
   */
  async search(query, options = {}) {
    try {
      const {
        indices = Object.values(this.indices),
        from = 0,
        size = 20,
        filters = {},
        sort = '_score',
        order = 'desc'
      } = options;

      const searchQuery = {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^3', 'content^2', 'name', 'username', 'bio', 'tags^2'],
                fuzziness: 'AUTO',
                operator: 'or'
              }
            }
          ],
          filter: []
        }
      };

      // Add filters
      if (filters.category) {
        searchQuery.bool.filter.push({ term: { category: filters.category } });
      }

      if (filters.user_id) {
        searchQuery.bool.filter.push({ term: { user_id: filters.user_id } });
      }

      if (filters.date_range) {
        searchQuery.bool.filter.push({
          range: {
            created_at: {
              gte: filters.date_range.start,
              lte: filters.date_range.end
            }
          }
        });
      }

      const result = await this.client.search({
        index: indices.join(','),
        from,
        size,
        body: {
          query: searchQuery,
          sort: [{ [sort]: { order } }],
          highlight: {
            fields: {
              title: {},
              content: {}
            }
          }
        }
      });

      return {
        total: result.body.hits.total.value,
        hits: result.body.hits.hits.map(hit => ({
          id: hit._id,
          index: hit._index,
          score: hit._score,
          source: hit._source,
          highlight: hit.highlight
        })),
        aggregations: result.body.aggregations
      };
    } catch (error) {
      logger.error('Error searching:', error);
      throw error;
    }
  }

  /**
   * Autocomplete suggestions
   */
  async autocomplete(prefix, options = {}) {
    try {
      const { indices = Object.values(this.indices), size = 10 } = options;

      const result = await this.client.search({
        index: indices.join(','),
        size,
        body: {
          suggest: {
            text: prefix,
            completion: {
              field: 'name.suggest',
              fuzzy: {
                fuzziness: 2
              }
            }
          }
        }
      });

      return result.body.suggest[0].options.map(option => ({
        text: option.text,
        score: option._score
      }));
    } catch (error) {
      logger.error('Error getting autocomplete suggestions:', error);
      throw error;
    }
  }

  /**
   * Faceted search
   */
  async facetedSearch(query, facets) {
    try {
      const aggregations = {};

      facets.forEach(facet => {
        aggregations[facet] = {
          terms: {
            field: facet,
            size: 50
          }
        };
      });

      const result = await this.client.search({
        index: Object.values(this.indices).join(','),
        size: 0,
        body: {
          query: {
            multi_match: {
              query,
              fields: ['title', 'content', 'name']
            }
          },
          aggregations
        }
      });

      return Object.entries(result.body.aggregations).reduce((acc, [key, value]) => {
        acc[key] = value.buckets.map(bucket => ({
          value: bucket.key,
          count: bucket.doc_count
        }));
        return acc;
      }, {});
    } catch (error) {
      logger.error('Error performing faceted search:', error);
      throw error;
    }
  }

  /**
   * Delete document from index
   */
  async deleteDocument(index, id) {
    try {
      await this.client.delete({
        index,
        id
      });
    } catch (error) {
      logger.error(`Error deleting document from ${index}:`, error);
      throw error;
    }
  }

  /**
   * Bulk index documents
   */
  async bulkIndex(operations) {
    try {
      const result = await this.client.bulk({
        body: operations,
        refresh: 'wait_for'
      });

      return result.body;
    } catch (error) {
      logger.error('Error bulk indexing:', error);
      throw error;
    }
  }

  /**
   * Reindex all data from PostgreSQL
   */
  async reindexAll() {
    try {
      logger.info('Starting full reindex...');

      // Reindex users
      const users = await pool.query('SELECT * FROM users WHERE deleted_at IS NULL');
      for (const user of users.rows) {
        await this.indexDocument(this.indices.users, user.id, {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          bio: user.bio,
          location: user.location,
          created_at: user.created_at,
          follower_count: user.follower_count || 0,
          is_verified: user.is_verified || false
        });
      }

      // Reindex posts
      const posts = await pool.query('SELECT * FROM posts WHERE status = $1', ['published']);
      for (const post of posts.rows) {
        await this.indexDocument(this.indices.posts, post.id, {
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          content: post.content,
          tags: post.tags || [],
          category: post.category,
          like_count: post.like_count || 0,
          comment_count: post.comment_count || 0,
          view_count: post.view_count || 0,
          created_at: post.created_at,
          updated_at: post.updated_at,
          is_published: true
        });
      }

      logger.info('✅ Full reindex completed');
    } catch (error) {
      logger.error('Error during reindex:', error);
      throw error;
    }
  }
}

module.exports = new SearchService();
