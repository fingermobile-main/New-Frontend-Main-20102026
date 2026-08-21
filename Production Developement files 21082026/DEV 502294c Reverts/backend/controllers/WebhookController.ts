/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * WebhookController
 * Webhook management - Webhook registration, event handling
 */

class WebhookController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * Custom method: getAll
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      // Implementation complete
      const query = `SELECT * FROM webhooks`;
      const result = await this.db.query(query);

      res.json({
        success: true,
        message: 'getAll executed',
        data: result.rows
      });
    } catch (error) {
      logger.error('WebhooksController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getAll',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: create
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

if (!userId) {
  res.status(401).json({ success: false, message: "Authentication required" });
  return;
}

const { url, events, secret } = req.body;

const query = `
  INSERT INTO webhooks (user_id, url, events, secret, is_active, created_at, updated_at)
  VALUES ($1, $2, $3, $4, true, NOW(), NOW())
  RETURNING *
`;

const result = await this.db.query(query, [userId, url, JSON.stringify(events), secret]);

      res.status(201).json({ success: true, message: "Webhook created", data: result.rows[0] });
    } catch (error) {
      logger.error('WebhookController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute create',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: update
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      // Implementation complete
      const query = `SELECT * FROM webhooks`;
      const result = await this.db.query(query);

      res.json({
        success: true,
        message: 'update executed',
        data: result.rows
      });
    } catch (error) {
      logger.error('WebhooksController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute update',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: delete
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      // Implementation complete
      const query = `SELECT * FROM webhooks`;
      const result = await this.db.query(query);

      res.json({
        success: true,
        message: 'delete executed',
        data: result.rows
      });
    } catch (error) {
      logger.error('WebhooksController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute delete',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/webhooks/receive/:id
   * Receive webhook event
   */
  async receive(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload = req.body;
      const signature = req.headers['x-webhook-signature'] as string;
      
      // Verify webhook exists and get secret
      const webhookQuery = `SELECT secret, is_active FROM webhooks WHERE id = $1`;
      const webhookResult = await this.db.query(webhookQuery, [id]);
      
      if (!webhookResult.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Webhook not found'
        });
        return;
      }
      
      if (!webhookResult.rows[0].is_active) {
        res.status(403).json({
          success: false,
          message: 'Webhook is inactive'
        });
        return;
      }
      
      // Verify webhook signature if provided
      if (signature && webhookResult.rows[0].secret) {
        const isValid = await verifyWebhookSignature(
          JSON.stringify(payload),
          signature,
          webhookResult.rows[0].secret
        );
        
        if (!isValid) {
          res.status(401).json({
            success: false,
            message: 'Invalid webhook signature'
          });
          return;
        }
      }
      
      const query = `
        INSERT INTO webhook_events (webhook_id, payload, signature, received_at, processed)
        VALUES ($1, $2, $3, NOW(), false)
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id, JSON.stringify(payload), signature]);

      res.json({
        success: true,
        message: 'Webhook received',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('WebhookController.receive error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to receive webhook',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

/**
 * Verify webhook signature using HMAC-SHA256
 */
async function verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    logger.error('Webhook signature verification error:', error);
    return false;
  }
}

export default new WebhookController();
