/**
 * investorRelationsController.js
 * Controller for Investor Relations module
 */
const { pool } = require('../db');
const logger = require('../utils/logger');

class InvestorRelationsController {
  // GET /api/investor-relations/overview
  async getOverview(req, res) {
    try {
      const summaryRes = await pool.query(`
        SELECT COALESCE(SUM(net_income), 0)::float as total_net_income,
               COALESCE(SUM(ebitda), 0)::float as total_ebitda,
               COUNT(*)::int as total_reports
        FROM financial_reports
      `);
      const docsCount = await pool.query('SELECT COUNT(*)::int as count FROM investor_relations');

      return res.json({
        success: true,
        data: {
          total_investment_fic: 1250000.0,
          portfolio_roi_percentage: 28.4,
          annual_growth_percentage: 34.2,
          total_reports: summaryRes.rows[0]?.total_reports || 0,
          total_documents: docsCount.rows[0]?.count || 0,
          market_cap_fic: 54000000.0
        }
      });
    } catch (error) {
      logger.error('Error in investorRelationsController.getOverview:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch overview', error: error.message });
    }
  }

  // GET /api/investor-relations/reports
  async getReports(req, res) {
    try {
      const result = await pool.query(`
        SELECT * FROM financial_reports 
        ORDER BY fiscal_year DESC, quarter DESC
      `);
      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in investorRelationsController.getReports:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch reports', error: error.message });
    }
  }

  // POST /api/investor-relations/reports
  async createReport(req, res) {
    try {
      const { title, report_type = '10-Q', quarter, fiscal_year, filing_date, document_url, net_income = 0, ebitda = 0, auditor_firm } = req.body;
      if (!title || !fiscal_year) {
        return res.status(400).json({ success: false, message: 'Title and fiscal year are required' });
      }
      const result = await pool.query(`
        INSERT INTO financial_reports (title, report_type, quarter, fiscal_year, filing_date, document_url, net_income, ebitda, auditor_firm)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [title, report_type, quarter || 'Q1', fiscal_year, filing_date || new Date(), document_url || '', net_income, ebitda, auditor_firm || 'Independent Audit']);

      return res.status(201).json({
        success: true,
        message: 'Financial report created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in investorRelationsController.createReport:', error);
      return res.status(500).json({ success: false, message: 'Failed to create report', error: error.message });
    }
  }

  // GET /api/investor-relations/governance
  async getGovernance(req, res) {
    try {
      const result = await pool.query(`
        SELECT * FROM governance_policies 
        ORDER BY policy_category ASC, created_at DESC
      `);
      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in investorRelationsController.getGovernance:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch governance policies', error: error.message });
    }
  }
}

module.exports = new InvestorRelationsController();
