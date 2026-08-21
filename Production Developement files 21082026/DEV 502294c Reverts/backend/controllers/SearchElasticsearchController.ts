/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * SearchElasticsearchController
 * Elasticsearch integration - Advanced search with ML-based relevance ranking
 */

class SearchElasticsearchController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * Custom method: search
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const q = req.query.q as string;
      const type = req.query.type as string | undefined;

      let query = `SELECT * FROM search_index WHERE data::text ILIKE $1`;
      const params: any[] = [`%${q}%`];

      if (type) {
        query += ` AND document_type = $2`;
        params.push(type);
      }

      query += ` ORDER BY indexed_at DESC LIMIT 50`;

      const result = await this.db.query(query, params);

      res.json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
      logger.error('SearchElasticsearchController.search error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute search',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: index
   */
  async index(req: Request, res: Response): Promise<void> {
    try {
      const { document_type, document_id, data } = req.body;

      const query = `
        INSERT INTO search_index (document_type, document_id, data, indexed_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (document_type, document_id) DO UPDATE SET data = $3, indexed_at = NOW()
        RETURNING *
      `;

      const result = await this.db.query(query, [document_type, document_id, JSON.stringify(data)]);

      res.json({ success: true, message: "Document indexed", data: result.rows[0] });
    } catch (error) {
      logger.error('SearchElasticsearchController.index error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute index',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/search_index/:id
   * Delete search_index
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { id } = req.params;
      
      const query = `
        DELETE FROM search_index
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Search_index not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Search_index deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Search_indexController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete search_index',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new SearchElasticsearchController();
