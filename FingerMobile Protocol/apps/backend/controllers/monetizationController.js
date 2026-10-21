const db = require('../db');
const logger = require('../utils/logger');

const getDb = () => db.monetizationDb || db;

exports.getSubscriptions = async (req, res) => {
  try {
    // We assume a basic subscriptions setup using the products table for now
    res.json({
      message: 'Subscriptions retrieved successfully',
      data: []
    });
  } catch (error) {
    logger.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const userId = req.user?.id || req.member?.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    res.json({
      message: 'Subscription created successfully (simulated)',
      data: {
        userId,
        productId,
        status: 'active',
        startDate: new Date()
      }
    });
  } catch (error) {
    logger.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.id || req.member?.id;
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ message: 'Subscription ID is required' });
    }

    res.json({
      message: 'Subscription cancelled successfully (simulated)',
      data: {
        userId,
        subscriptionId,
        status: 'cancelled',
        endDate: new Date()
      }
    });
  } catch (error) {
    logger.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    // Simulate returning actual balance and stats
    res.json({
      success: true,
      data: {
        balance: 15420.50,
        totalEarned: 45200.00,
        activeCampaigns: 3,
        transactions: [
          {
            id: 'TXN-9871',
            type: 'earnings',
            amount: 500,
            status: 'completed',
            date: new Date().toISOString()
          }
        ]
      }
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.requestPayout = async (req, res) => {
  try {
    const userId = req.user?.id || req.member?.id;
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payout amount' });
    }

    // Process payout here...
    logger.info(`Payout requested for user ${userId}, amount: ${amount}, method: ${method}`);

    res.json({
      success: true,
      message: 'Payout request received successfully',
      data: {
        amount,
        method,
        status: 'processing',
        reference: `PAYOUT-${Date.now()}`
      }
    });
  } catch (error) {
    logger.error('Error requesting payout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/monetization/subscription-models
 * Retrieve all platform subscription models persisted in PostgreSQL
 */
exports.getSubscriptionModels = async (req, res) => {
  try {
    const querySql = `
      SELECT * FROM platform_subscription_models 
      ORDER BY sort_order ASC, created_at ASC
    `;
    let result;
    try {
      result = await getDb().query(querySql);
    } catch {
      result = await db.query(querySql);
    }

    const rows = result.rows || [];
    const models = rows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      monthlyFIC: Number(r.monthly_fic),
      annualFIC: Number(r.annual_fic),
      monthlyNGN: Number(r.monthly_ngn),
      annualNGN: Number(r.annual_ngn),
      isFreeTier: Boolean(r.is_free_tier),
      badge: r.badge,
      description: r.description,
      features: typeof r.features === 'string' ? JSON.parse(r.features) : (r.features || []),
      subscriberCount: Number(r.subscriber_count) || 0,
      targetAnnualVolumeFIC: Number(r.target_annual_volume_fic) || 0,
      status: r.status
    }));

    return res.status(200).json({
      success: true,
      count: models.length,
      data: models,
      models: models
    });
  } catch (error) {
    logger.error('Error in getSubscriptionModels:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to retrieve subscription models' });
  }
};

/**
 * POST or PUT /api/monetization/subscription-models/:id
 * Save or update single subscription model in PostgreSQL
 */
exports.saveSubscriptionModel = async (req, res) => {
  try {
    const model = req.body;
    const id = req.params.id || model.id || `sub_${Date.now()}`;

    const upsertSql = `
      INSERT INTO platform_subscription_models (
        id, name, category, monthly_fic, annual_fic, monthly_ngn, annual_ngn,
        is_free_tier, badge, description, features, subscriber_count, target_annual_volume_fic, status, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        monthly_fic = EXCLUDED.monthly_fic,
        annual_fic = EXCLUDED.annual_fic,
        monthly_ngn = EXCLUDED.monthly_ngn,
        annual_ngn = EXCLUDED.annual_ngn,
        is_free_tier = EXCLUDED.is_free_tier,
        badge = EXCLUDED.badge,
        description = EXCLUDED.description,
        features = EXCLUDED.features,
        subscriber_count = EXCLUDED.subscriber_count,
        target_annual_volume_fic = EXCLUDED.target_annual_volume_fic,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const params = [
      id,
      model.name || 'Untitled Tier',
      model.category || 'platform',
      Number(model.monthlyFIC) || 0,
      Number(model.annualFIC) || 0,
      Number(model.monthlyNGN) || 0,
      Number(model.annualNGN) || 0,
      Boolean(model.isFreeTier),
      model.badge || '',
      model.description || '',
      JSON.stringify(model.features || []),
      Number(model.subscriberCount) || 0,
      Number(model.targetAnnualVolumeFIC) || 0,
      model.status || 'active'
    ];

    let result;
    try {
      result = await getDb().query(upsertSql, params);
    } catch {
      result = await db.query(upsertSql, params);
    }

    return res.status(200).json({
      success: true,
      message: `Subscription model '${id}' persisted to PostgreSQL`,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error saving subscription model:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to persist subscription model' });
  }
};

/**
 * PUT /api/monetization/subscription-models/batch
 * Batch persist all subscription models to PostgreSQL
 */
exports.batchSaveSubscriptionModels = async (req, res) => {
  try {
    const { models } = req.body;
    if (!Array.isArray(models)) {
      return res.status(400).json({ success: false, error: 'Expected models array' });
    }

    for (let idx = 0; idx < models.length; idx++) {
      const model = models[idx];
      const upsertSql = `
        INSERT INTO platform_subscription_models (
          id, name, category, monthly_fic, annual_fic, monthly_ngn, annual_ngn,
          is_free_tier, badge, description, features, subscriber_count, target_annual_volume_fic, sort_order, status, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          monthly_fic = EXCLUDED.monthly_fic,
          annual_fic = EXCLUDED.annual_fic,
          monthly_ngn = EXCLUDED.monthly_ngn,
          annual_ngn = EXCLUDED.annual_ngn,
          is_free_tier = EXCLUDED.is_free_tier,
          badge = EXCLUDED.badge,
          description = EXCLUDED.description,
          features = EXCLUDED.features,
          subscriber_count = EXCLUDED.subscriber_count,
          target_annual_volume_fic = EXCLUDED.target_annual_volume_fic,
          sort_order = EXCLUDED.sort_order,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
      `;

      const params = [
        model.id,
        model.name,
        model.category || 'platform',
        Number(model.monthlyFIC) || 0,
        Number(model.annualFIC) || 0,
        Number(model.monthlyNGN) || 0,
        Number(model.annualNGN) || 0,
        Boolean(model.isFreeTier),
        model.badge || '',
        model.description || '',
        JSON.stringify(model.features || []),
        Number(model.subscriberCount) || 0,
        Number(model.targetAnnualVolumeFIC) || 0,
        idx,
        model.status || 'active'
      ];

      try {
        await getDb().query(upsertSql, params);
      } catch {
        await db.query(upsertSql, params);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully persisted ${models.length} subscription models to PostgreSQL`,
      count: models.length
    });
  } catch (error) {
    logger.error('Error batch saving subscription models:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to batch persist subscription models' });
  }
};

/**
 * DELETE /api/monetization/subscription-models/:id
 * Remove subscription model from PostgreSQL
 */
exports.deleteSubscriptionModel = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSql = 'DELETE FROM platform_subscription_models WHERE id = $1';
    try {
      await getDb().query(deleteSql, [id]);
    } catch {
      await db.query(deleteSql, [id]);
    }
    return res.status(200).json({
      success: true,
      message: `Subscription model '${id}' deleted from PostgreSQL`
    });
  } catch (error) {
    logger.error('Error deleting subscription model:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to delete subscription model' });
  }
};
