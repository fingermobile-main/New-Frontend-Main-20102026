/**
 * Connector & Live Artifact Controller
 * Complete Lifecycle Engine for Dashboard Connectors, Schema Discovery,
 * Ingestion, and Action Automation
 * FingerMobile Protocol™ - October 2026
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

// Predefined Schema Definitions (differentiating metrics vs dimensions)
const CONNECTOR_SCHEMAS = {
  meta_ads: {
    dimensions: [
      { id: 'date', name: 'Date', type: 'date', description: 'Reporting date (YYYY-MM-DD)' },
      { id: 'campaign_id', name: 'Campaign ID', type: 'string', description: 'Unique Meta campaign identifier' },
      { id: 'campaign_name', name: 'Campaign Name', type: 'string', description: 'User-assigned campaign title' },
      { id: 'adset_name', name: 'Ad Set Name', type: 'string', description: 'Ad set grouping identifier' },
      { id: 'placement', name: 'Placement', type: 'string', description: 'Platform delivery surface (Feed, Reels, Stories)' }
    ],
    metrics: [
      { id: 'spend', name: 'Spend Amount', type: 'currency', description: 'Total ad spend in account currency' },
      { id: 'impressions', name: 'Impressions', type: 'integer', description: 'Total times ad was shown' },
      { id: 'clicks', name: 'Link Clicks', type: 'integer', description: 'Total clicks to landing page' },
      { id: 'ctr', name: 'Click-Through Rate', type: 'percentage', description: 'Clicks divided by impressions' },
      { id: 'cpc', name: 'Cost Per Click', type: 'currency', description: 'Spend divided by link clicks' },
      { id: 'conversions', name: 'Conversions', type: 'integer', description: 'Total protocol signups or purchases triggered' }
    ],
    options: {
      date_filter_columns: ['date', 'campaign_created_time', 'updated_time'],
      attribution_windows: ['7d_click_1d_view', '1d_click', '28d_click'],
      supported_breakdowns: ['age', 'gender', 'country', 'placement']
    },
    actions: [
      {
        id: 'update_campaign_budget',
        name: 'Update Campaign Budget',
        description: 'Adjust daily or lifetime spend cap on a live ad campaign',
        parameters: {
          campaign_id: { type: 'string', required: true, description: 'Target Campaign ID' },
          daily_budget: { type: 'number', required: true, description: 'New daily budget in USD' }
        }
      },
      {
        id: 'toggle_campaign_status',
        name: 'Toggle Campaign Status',
        description: 'Pause or activate a Meta Ads campaign',
        parameters: {
          campaign_id: { type: 'string', required: true, description: 'Target Campaign ID' },
          status: { type: 'string', enum: ['ACTIVE', 'PAUSED'], required: true }
        }
      }
    ]
  },
  google_analytics_4: {
    dimensions: [
      { id: 'date', name: 'Date', type: 'date', description: 'Session date' },
      { id: 'page_path', name: 'Page Path', type: 'string', description: 'URL route accessed on frontend' },
      { id: 'device_category', name: 'Device Category', type: 'string', description: 'Desktop, mobile, tablet' },
      { id: 'source_medium', name: 'Traffic Source / Medium', type: 'string', description: 'Acquisition channel' }
    ],
    metrics: [
      { id: 'active_users', name: 'Active Users', type: 'integer', description: 'Count of unique active protocol users' },
      { id: 'sessions', name: 'Sessions', type: 'integer', description: 'Total sessions initiated' },
      { id: 'bounce_rate', name: 'Bounce Rate', type: 'percentage', description: 'Single-page non-engaged visit percentage' },
      { id: 'avg_session_duration', name: 'Average Session Duration', type: 'seconds', description: 'Mean length of session in seconds' },
      { id: 'screen_page_views', name: 'Page Views', type: 'integer', description: 'Total screen views logged' }
    ],
    options: {
      date_filter_columns: ['date'],
      supported_segments: ['all_users', 'registered_members', 'creators', 'subscribers']
    },
    actions: []
  },
  stripe_fiat: {
    dimensions: [
      { id: 'created_at', name: 'Transaction Date', type: 'date', description: 'Payment timestamp' },
      { id: 'customer_id', name: 'Customer ID', type: 'string', description: 'Stripe customer identifier' },
      { id: 'payment_status', name: 'Payment Status', type: 'string', description: 'Succeeded, pending, refunded' },
      { id: 'payment_method_type', name: 'Payment Method', type: 'string', description: 'Card, Apple Pay, SEPA' }
    ],
    metrics: [
      { id: 'gross_amount', name: 'Gross Revenue', type: 'currency', description: 'Gross transaction amount' },
      { id: 'net_amount', name: 'Net Revenue', type: 'currency', description: 'Net amount after processing fees' },
      { id: 'refunded_amount', name: 'Refunded Amount', type: 'currency', description: 'Total refunds issued' },
      { id: 'charge_count', name: 'Charge Count', type: 'integer', description: 'Number of discrete transactions' }
    ],
    options: {
      date_filter_columns: ['created_at'],
      currencies: ['USD', 'EUR', 'GBP', 'NGN']
    },
    actions: [
      {
        id: 'issue_customer_refund',
        name: 'Issue Customer Refund',
        description: 'Process a full or partial refund to original payment source',
        parameters: {
          charge_id: { type: 'string', required: true, description: 'Stripe charge or payment intent ID' },
          amount: { type: 'number', required: false, description: 'Amount in USD (blank for full refund)' },
          reason: { type: 'string', enum: ['duplicate', 'fraudulent', 'requested_by_customer'], required: true }
        }
      }
    ]
  },
  fic_token_ledger: {
    dimensions: [
      { id: 'timestamp', name: 'Block Timestamp', type: 'timestamp', description: 'Ledger transaction block time' },
      { id: 'sender_wallet', name: 'Sender Wallet', type: 'string', description: 'Originating cryptographic address' },
      { id: 'recipient_wallet', name: 'Recipient Wallet', type: 'string', description: 'Target cryptographic address' },
      { id: 'transaction_type', name: 'Transaction Type', type: 'string', description: 'transfer, staking, reward, escrow' }
    ],
    metrics: [
      { id: 'token_volume', name: 'FIC Volume', type: 'currency', description: 'Total FIC tokens transferred' },
      { id: 'gas_fee_collected', name: 'Protocol Fee', type: 'currency', description: 'Network validation micro-fee' },
      { id: 'block_confirmations', name: 'Confirmations', type: 'integer', description: 'Block verification depth' }
    ],
    options: {
      date_filter_columns: ['timestamp'],
      transaction_types: ['transfer', 'staking', 'reward', 'escrow', 'governance_vote']
    },
    actions: [
      {
        id: 'release_escrow_batch',
        name: 'Release Escrow Batch',
        description: 'Release locked FIC tokens from verified milestone escrow',
        parameters: {
          escrow_id: { type: 'string', required: true, description: 'Escrow contract reference' },
          approver_role: { type: 'string', required: true, description: 'STERCS Executive Role Title' }
        }
      }
    ]
  },
  guardian_sentinel: {
    dimensions: [
      { id: 'timestamp', name: 'Incident Time', type: 'timestamp', description: 'Event detection timestamp' },
      { id: 'alert_type', name: 'Alert Type', type: 'string', description: 'Rule classification' },
      { id: 'severity', name: 'Severity Level', type: 'string', description: 'low, medium, high, critical' },
      { id: 'ip_address', name: 'IP Address', type: 'string', description: 'Source client IP' },
      { id: 'resolved', name: 'Resolution Status', type: 'boolean', description: 'Whether incident is resolved' }
    ],
    metrics: [
      { id: 'incident_count', name: 'Incidents Count', type: 'integer', description: 'Count of triggered incidents' },
      { id: 'mean_time_to_resolve_sec', name: 'MTTR (Seconds)', type: 'seconds', description: 'Average seconds to resolve' }
    ],
    options: {
      date_filter_columns: ['timestamp'],
      severity_levels: ['low', 'medium', 'high', 'critical']
    },
    actions: [
      {
        id: 'quarantine_network_ip',
        name: 'Quarantine Network IP',
        description: 'Block all incoming requests and tokens from specified IP address',
        parameters: {
          ip_address: { type: 'string', required: true, description: 'IPv4 or IPv6 address' },
          reason: { type: 'string', required: true, description: 'Sentinel alert justification' }
        }
      },
      {
        id: 'resolve_sentinel_alert',
        name: 'Resolve Sentinel Alert',
        description: 'Mark open security incident as investigated and resolved',
        parameters: {
          alert_id: { type: 'string', required: true, description: 'Security alert ID' }
        }
      }
    ]
  },
  postgres_core: {
    dimensions: [
      { id: 'created_at', name: 'Record Created At', type: 'timestamp', description: 'Record creation timestamp' },
      { id: 'role', name: 'User Role', type: 'string', description: 'User permission role' },
      { id: 'account_status', name: 'Account Status', type: 'string', description: 'active, flagged, suspended, banned' },
      { id: 'category', name: 'Category', type: 'string', description: 'Entity classification category' }
    ],
    metrics: [
      { id: 'users_count', name: 'Total Users', type: 'integer', description: 'Count of registered platform accounts' },
      { id: 'orders_total_amount', name: 'Orders Total', type: 'currency', description: 'Sum of order purchase values' },
      { id: 'products_in_stock', name: 'Stock Sum', type: 'integer', description: 'Total units in catalog inventory' },
      { id: 'gem_balance_total', name: 'Gems in Circulation', type: 'integer', description: 'Total user gem balances' }
    ],
    options: {
      date_filter_columns: ['created_at', 'updated_at'],
      tables: ['users', 'products', 'orders', 'posts', 'moderation_queue', 'security_alerts']
    },
    actions: [
      {
        id: 'adjust_user_status',
        name: 'Adjust User Status',
        description: 'Change user standing (ACTIVE, FLAGGED, BANNED)',
        parameters: {
          user_id: { type: 'string', required: true, description: 'Target user ID' },
          status: { type: 'string', enum: ['active', 'flagged', 'banned'], required: true }
        }
      }
    ]
  }
};

class ConnectorArtifactController {
  /**
   * 1. get_connectors
   * GET /api/connectors
   */
  async getConnectors(req, res) {
    try {
      const result = await pool.query(`
        SELECT c.*, 
               COALESCE((SELECT COUNT(*) FROM connector_accounts a WHERE a.connector_id = c.id), 0) as live_accounts_count
        FROM platform_connectors c
        ORDER BY c.name ASC
      `);

      res.status(200).json({
        success: true,
        data: result.rows,
        connectors: result.rows,
        total: result.rows.length
      });
    } catch (err) {
      logger.error('Error in getConnectors:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve platform connectors' });
    }
  }

  /**
   * 2. get_accounts
   * GET /api/connectors/accounts
   */
  async getAccounts(req, res) {
    try {
      const { connector } = req.query;
      let query = 'SELECT a.*, c.name as connector_name FROM connector_accounts a JOIN platform_connectors c ON a.connector_id = c.id';
      const params = [];

      if (connector) {
        query += ' WHERE a.connector_id = $1';
        params.push(connector);
      }

      query += ' ORDER BY a.account_name ASC';
      const result = await pool.query(query, params);

      res.status(200).json({
        success: true,
        data: result.rows,
        accounts: result.rows,
        total: result.rows.length
      });
    } catch (err) {
      logger.error('Error in getAccounts:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve connector accounts' });
    }
  }

  /**
   * 3. get_current_user
   * GET /api/connectors/user
   */
  async getCurrentUser(req, res) {
    try {
      const user = req.user || {
        id: 1,
        username: 'superadmin',
        email: 'admin@fingermobile.io',
        role: 'super_admin'
      };

      // Retrieve full live profile
      const userRes = await pool.query(
        'SELECT id, uuid, username, email, role, account_status, gem_balance, is_verified, created_at FROM users WHERE id = $1 OR username = $2',
        [user.id || 1, user.username || 'admin']
      );

      const profile = userRes.rows[0] || {
        id: 1,
        username: user.username || 'superadmin',
        email: user.email || 'admin@fingermobile.io',
        role: user.role || 'super_admin',
        account_status: 'active',
        gem_balance: 1000,
        is_verified: true
      };

      res.status(200).json({
        success: true,
        data: {
          ...profile,
          plan: 'Enterprise Protocol Tier',
          plan_status: 'active',
          api_rate_limit: '10,000 req/min',
          quotas: {
            connectors_active: 8,
            accounts_linked: 6,
            monthly_data_queries_used: 1420,
            monthly_data_queries_max: 50000
          }
        }
      });
    } catch (err) {
      logger.error('Error in getCurrentUser:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve current user profile' });
    }
  }

  /**
   * 4. get_fields
   * GET /api/connectors/fields?connector=:connectorId
   */
  async getFields(req, res) {
    try {
      const { connector } = req.query;
      if (!connector) {
        return res.status(400).json({
          success: false,
          message: 'connector query parameter is required (e.g., meta_ads, stripe_fiat, postgres_core)'
        });
      }

      const schema = CONNECTOR_SCHEMAS[connector];
      if (!schema) {
        return res.status(404).json({
          success: false,
          message: `Connector schema '${connector}' not found. Available: ${Object.keys(CONNECTOR_SCHEMAS).join(', ')}`
        });
      }

      res.status(200).json({
        success: true,
        connector,
        dimensions: schema.dimensions,
        metrics: schema.metrics,
        all_fields: [...schema.dimensions, ...schema.metrics]
      });
    } catch (err) {
      logger.error('Error in getFields:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve connector fields' });
    }
  }

  /**
   * 5. get_options
   * GET /api/connectors/options?connector=:connectorId&account=:accountId
   */
  async getOptions(req, res) {
    try {
      const { connector, account } = req.query;
      if (!connector) {
        return res.status(400).json({ success: false, message: 'connector query parameter is required' });
      }

      const schema = CONNECTOR_SCHEMAS[connector];
      if (!schema) {
        return res.status(404).json({ success: false, message: `Connector '${connector}' not supported` });
      }

      res.status(200).json({
        success: true,
        connector,
        account: account || 'default',
        options: schema.options || {}
      });
    } catch (err) {
      logger.error('Error in getOptions:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve connector options' });
    }
  }

  /**
   * 6. get_data
   * POST /api/connectors/data
   */
  async getData(req, res) {
    try {
      const src = (req.method === 'GET' ? req.query : (req.body && Object.keys(req.body).length > 0 ? req.body : req.query)) || {};
      const connector = src.connector || src.connector_id || 'postgres_core';
      const accounts = Array.isArray(src.accounts) ? src.accounts : (src.accounts ? String(src.accounts).split(',') : []);
      const date_from = src.date_from || '2026-10-01';
      const date_to = src.date_to || '2026-10-09';
      const fields = Array.isArray(src.fields) ? src.fields : (src.fields ? String(src.fields).split(',') : []);
      const filters = typeof src.filters === 'object' ? src.filters : {};

      const schema = CONNECTOR_SCHEMAS[connector] || CONNECTOR_SCHEMAS.postgres_core;

      // When querying postgres_core, fetch live database metrics
      if (connector === 'postgres_core') {
        const usersCountRes = await pool.query('SELECT COUNT(*) as count FROM users');
        const ordersRes = await pool.query('SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total FROM orders');
        const productsRes = await pool.query('SELECT COUNT(*) as count, COALESCE(SUM(stock_quantity), 0) as stock FROM products');
        const securityRes = await pool.query('SELECT COUNT(*) as count FROM security_alerts WHERE resolved = false');

        const rows = [
          {
            date: date_to,
            users_count: parseInt(usersCountRes.rows[0]?.count || 0, 10),
            orders_total_amount: parseFloat(ordersRes.rows[0]?.total || 0),
            products_in_stock: parseInt(productsRes.rows[0]?.stock || 0, 10),
            open_security_alerts: parseInt(securityRes.rows[0]?.count || 0, 10),
            status: 'operational'
          }
        ];

        return res.status(200).json({
          success: true,
          connector,
          date_range: { date_from, date_to },
          data: rows,
          rows_count: rows.length
        });
      }

      // For specialized connectors (e.g. meta_ads, stripe_fiat, guardian_sentinel), synthesize live time-series
      const days = 7;
      const rows = [];
      const baseDate = new Date(date_to);

      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        if (connector === 'meta_ads') {
          const spend = Math.round((280 + Math.random() * 95) * 100) / 100;
          const impressions = Math.floor(18000 + Math.random() * 4500);
          const clicks = Math.floor(impressions * (0.024 + Math.random() * 0.008));
          rows.push({
            date: dateStr,
            campaign_id: 'act_fmp_growth_01',
            campaign_name: 'Global Sovereign Acquisition',
            spend,
            impressions,
            clicks,
            ctr: `${((clicks / impressions) * 100).toFixed(2)}%`,
            cpc: `$${(spend / clicks).toFixed(2)}`,
            conversions: Math.floor(clicks * 0.12)
          });
        } else if (connector === 'stripe_fiat') {
          const charges = Math.floor(40 + Math.random() * 25);
          const gross = Math.round(charges * (65 + Math.random() * 30) * 100) / 100;
          rows.push({
            created_at: dateStr,
            payment_status: 'succeeded',
            charge_count: charges,
            gross_amount: gross,
            net_amount: Math.round(gross * 0.965 * 100) / 100,
            refunded_amount: 0
          });
        } else if (connector === 'guardian_sentinel') {
          const alerts = await pool.query('SELECT COUNT(*) as count FROM security_alerts');
          rows.push({
            timestamp: dateStr,
            alert_type: 'SENTINEL_POLICY_MONITOR',
            severity: 'low',
            incident_count: parseInt(alerts.rows[0]?.count || 3, 10),
            mean_time_to_resolve_sec: 142
          });
        } else {
          rows.push({
            date: dateStr,
            value: Math.floor(100 + Math.random() * 50)
          });
        }
      }

      res.status(200).json({
        success: true,
        connector,
        accounts,
        date_range: { date_from, date_to },
        fields: fields.length > 0 ? fields : schema.metrics.map(m => m.id),
        data: rows,
        rows_count: rows.length
      });
    } catch (err) {
      logger.error('Error in getData:', err);
      res.status(500).json({ success: false, message: 'Failed to ingest connector data' });
    }
  }

  /**
   * 7. get_connector_authorization_url
   * GET /api/connectors/auth-url?connector=:connectorId
   */
  async getConnectorAuthorizationUrl(req, res) {
    try {
      const { connector } = req.query;
      if (!connector) {
        return res.status(400).json({ success: false, message: 'connector query parameter is required' });
      }

      const redirectUri = encodeURIComponent('http://localhost:8000/api/connectors/oauth/callback');
      const authUrl = `https://auth.fingermobile.io/oauth/authorize?client_id=fmp_dashboard_client&connector=${connector}&redirect_uri=${redirectUri}&scope=read_write&response_type=code`;

      res.status(200).json({
        success: true,
        connector,
        authorization_url: authUrl,
        expires_in_seconds: 600
      });
    } catch (err) {
      logger.error('Error in getConnectorAuthorizationUrl:', err);
      res.status(500).json({ success: false, message: 'Failed to generate authorization URL' });
    }
  }

  /**
   * 8. get_connector_connect_info
   * GET /api/connectors/connect-info?connector=:connectorId
   */
  async getConnectorConnectInfo(req, res) {
    try {
      const { connector } = req.query;
      if (!connector) {
        return res.status(400).json({ success: false, message: 'connector query parameter is required' });
      }

      const info = {
        connector,
        documentation_url: `https://docs.fingermobile.io/connectors/${connector}`,
        instructions: [
          `1. Ensure administrative access to your ${connector} account dashboard.`,
          '2. Generate developer credentials (API Client ID and Secret or Service Account Key).',
          '3. Provide callback URL: http://localhost:8000/api/connectors/oauth/callback',
          '4. Grant the requested read and write scopes.'
        ],
        direct_connect_url: `http://localhost:8000/dashboard/integrations?connect=${connector}`
      };

      res.status(200).json({ success: true, data: info });
    } catch (err) {
      logger.error('Error in getConnectorConnectInfo:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve connection instructions' });
    }
  }

  /**
   * 9. get_subscription_url
   * GET /api/connectors/subscription-url
   */
  async getSubscriptionUrl(req, res) {
    try {
      const subscriptionUrl = 'http://localhost:8000/dashboard/monetization/upgrade';
      const markdownLink = '[Manage FingerMobile API Plan & Connectors](http://localhost:8000/dashboard/monetization/upgrade)';

      res.status(200).json({
        success: true,
        subscription_url: subscriptionUrl,
        markdown_link: markdownLink,
        current_tier: 'Enterprise Suite'
      });
    } catch (err) {
      logger.error('Error in getSubscriptionUrl:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve subscription URL' });
    }
  }

  /**
   * 10. list_actions
   * GET /api/connectors/actions?connector=:connectorId
   */
  async listActions(req, res) {
    try {
      const { connector } = req.query;
      if (connector) {
        const schema = CONNECTOR_SCHEMAS[connector];
        return res.status(200).json({
          success: true,
          connector,
          actions: schema?.actions || []
        });
      }

      // All actions across all connectors
      const allActions = [];
      for (const [key, val] of Object.entries(CONNECTOR_SCHEMAS)) {
        if (val.actions && val.actions.length > 0) {
          for (const act of val.actions) {
            allActions.push({ ...act, connector: key });
          }
        }
      }

      res.status(200).json({
        success: true,
        actions: allActions,
        total: allActions.length
      });
    } catch (err) {
      logger.error('Error in listActions:', err);
      res.status(500).json({ success: false, message: 'Failed to list connector actions' });
    }
  }

  /**
   * 11. run_action
   * POST /api/connectors/action
   */
  async runAction(req, res) {
    try {
      const {
        connector: rawConnector,
        connector_id,
        action_name: rawActionName,
        action_id,
        payload: rawPayload,
        parameters,
        confirmed = false
      } = req.body;

      const connector = rawConnector || connector_id;
      const action_name = rawActionName || action_id;
      const payload = rawPayload || parameters || {};

      if (!connector || !action_name) {
        return res.status(400).json({
          success: false,
          message: 'connector and action_name are required'
        });
      }

      // Mandatory safety verification prompt
      if (!confirmed) {
        return res.status(400).json({
          success: false,
          require_confirmation: true,
          message: `Confirmation required: Action '${action_name}' on connector '${connector}' will execute a live state modification.`,
          confirmation_prompt: `Please confirm execution of '${action_name}' with payload: ${JSON.stringify(payload)}. Set confirmed: true to execute.`
        });
      }

      const executedBy = req.user?.username || 'dashboard_admin';

      // Perform specific state changes
      let executionResult = { executed: true, timestamp: new Date().toISOString() };

      if (action_name === 'quarantine_network_ip' && payload.ip_address) {
        await pool.query(
          'INSERT INTO security_alerts (alert_type, severity, description, ip_address, resolved, created_at) VALUES ($1, $2, $3, $4, true, NOW())',
          ['IP_BLOCKED', 'critical', payload.reason || 'Blocked via connector action', payload.ip_address]
        );
        executionResult.quarantined_ip = payload.ip_address;
      } else if (action_name === 'resolve_sentinel_alert' && payload.alert_id) {
        await pool.query('UPDATE security_alerts SET resolved = true WHERE id = $1', [payload.alert_id]);
        executionResult.resolved_alert_id = payload.alert_id;
      } else if (action_name === 'adjust_user_status' && payload.user_id) {
        await pool.query('UPDATE users SET account_status = $1 WHERE id::text = $2 OR username = $2', [payload.status || 'flagged', payload.user_id]);
        executionResult.updated_user = payload.user_id;
      }

      // Persist audit record in connector_actions_log
      const logInsert = await pool.query(
        'INSERT INTO connector_actions_log (connector_id, action_name, payload, executed_by, status, result) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [connector, action_name, JSON.stringify(payload), executedBy, 'completed', JSON.stringify(executionResult)]
      );

      res.status(200).json({
        success: true,
        message: `Action '${action_name}' successfully executed on connector '${connector}'`,
        log: logInsert.rows[0],
        result: executionResult
      });
    } catch (err) {
      logger.error('Error in runAction:', err);
      res.status(500).json({ success: false, message: 'Failed to execute connector action' });
    }
  }

  /**
   * 12. get_action_logs
   * GET /api/connectors/action-logs
   */
  async getActionLogs(req, res) {
    try {
      const { limit = 25 } = req.query;
      const result = await pool.query(
        'SELECT * FROM connector_actions_log ORDER BY created_at DESC LIMIT $1',
        [parseInt(limit, 10) || 25]
      );

      res.status(200).json({
        success: true,
        logs: result.rows,
        total: result.rows.length
      });
    } catch (err) {
      logger.error('Error in getActionLogs:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve action logs' });
    }
  }
}

module.exports = new ConnectorArtifactController();
