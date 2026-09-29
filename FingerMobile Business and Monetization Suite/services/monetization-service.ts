import { db } from '../database.js';

/**
 * Monetization Service
 * Queries real SQLite data for monetization metrics and trends.
 */
export class MonetizationService {
  /**
   * Get monetization overview from live database records.
   */
  static async getOverview(): Promise<unknown> {
    const { totalRevenue } = db.prepare(
      "SELECT COALESCE(SUM(amount), 0) as totalRevenue FROM revenue_ledger WHERE status = 'completed'"
    ).get() as { totalRevenue: number };

    const { activeSubscriptions } = db.prepare(
      "SELECT COUNT(*) as activeSubscriptions FROM subscriptions WHERE status = 'active'"
    ).get() as { activeSubscriptions: number };

    const { totalApplications } = db.prepare(
      "SELECT COUNT(*) as totalApplications FROM monetization_applications"
    ).get() as { totalApplications: number };

    const { approvedApplications } = db.prepare(
      "SELECT COUNT(*) as approvedApplications FROM monetization_applications WHERE status = 'approved'"
    ).get() as { approvedApplications: number };

    const conversionRate = totalApplications > 0
      ? parseFloat((approvedApplications / totalApplications).toFixed(4))
      : 0;

    return {
      totalRevenue,
      activeSubscriptions,
      totalApplications,
      approvedApplications,
      conversionRate,
      monetizationStrategies: ['subscriptions', 'ads', 'premium'],
      date: new Date()
    };
  }

  /**
   * Get monthly revenue trends from revenue_ledger.
   */
  static async getTrends(): Promise<unknown[]> {
    const rows = db.prepare(`
      SELECT 
        strftime('%b', processed_at) as period,
        strftime('%Y-%m', processed_at) as yearMonth,
        SUM(amount) as revenue
      FROM revenue_ledger
      WHERE status = 'completed'
      GROUP BY yearMonth
      ORDER BY yearMonth DESC
      LIMIT 12
    `).all() as { period: string; yearMonth: string; revenue: number }[];

    if (rows.length === 0) return [];

    // Calculate growth relative to previous period
    return rows.map((row, index) => {
      const prev = rows[index + 1];
      const growth = prev && prev.revenue > 0
        ? parseFloat(((row.revenue - prev.revenue) / prev.revenue).toFixed(4))
        : 0;
      return { period: row.period, revenue: row.revenue, growth };
    });
  }

  /**
   * Get revenue breakdown by transaction type.
   */
  static async getBreakdown(): Promise<unknown> {
    const rows = db.prepare(`
      SELECT transaction_type, COALESCE(SUM(amount), 0) as total
      FROM revenue_ledger WHERE status = 'completed'
      GROUP BY transaction_type
    `).all() as { transaction_type: string; total: number }[];

    const result: Record<string, number> = {
      subscriptions: 0,
      advertising: 0,
      commissions: 0,
      other: 0
    };

    for (const row of rows) {
      if (row.transaction_type === 'subscription_fee') result.subscriptions = row.total;
      else if (row.transaction_type === 'affiliate_commission') result.commissions = row.total;
      else if (row.transaction_type === 'sale') result.advertising = row.total;
      else result.other = (result.other || 0) + row.total;
    }

    return result;
  }

  /**
   * Get revenue forecast based on 3-month rolling average.
   */
  static async getForecast(): Promise<unknown> {
    const result = db.prepare(`
      SELECT COALESCE(AVG(monthly_total), 0) as avg_monthly
      FROM (
        SELECT strftime('%Y-%m', processed_at) as month, SUM(amount) as monthly_total
        FROM revenue_ledger WHERE status = 'completed'
        GROUP BY month
        ORDER BY month DESC LIMIT 3
      )
    `).get() as { avg_monthly: number };

    const projectedMonthly = result.avg_monthly || 0;

    return {
      projectedRevenue: parseFloat((projectedMonthly * 12).toFixed(2)),
      projectedMonthly: parseFloat(projectedMonthly.toFixed(2)),
      growthRate: 0.1,
      confidence: 0.75,
      period: 'next_quarter'
    };
  }
}

// Export singleton instance
export const monetizationService = MonetizationService;