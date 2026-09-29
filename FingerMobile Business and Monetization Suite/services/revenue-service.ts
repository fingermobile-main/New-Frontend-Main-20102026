import { db } from '../database.js';

// Row → RevenueRecord mapper using the revenue_ledger table schema
function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    transactionType: row.transaction_type as string,
    amount: row.amount as number,
    currency: row.currency as string,
    description: row.description as string,
    relatedEntityId: row.related_entity_id as string | undefined,
    relatedEntityType: row.related_entity_type as string | undefined,
    status: row.status as 'pending' | 'completed' | 'failed' | 'refunded',
    metadata: row.metadata_json ? JSON.parse(row.metadata_json as string) : {},
    processedAt: new Date(row.processed_at as string),
    // Legacy field aliases for backward compat
    date: row.processed_at as string,
    source: row.related_entity_type as string || 'platform'
  };
}

export interface RevenueRecord {
  id: string;
  userId: string;
  transactionType: string;
  amount: number;
  currency: string;
  description: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata: Record<string, unknown>;
  processedAt: Date;
  /** @deprecated use processedAt */
  date: string;
  /** @deprecated use relatedEntityType */
  source: string;
}

interface RevenueReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  records: RevenueRecord[];
  count: number;
}

interface RevenueSource {
  source: string;
  amount: number;
}

interface MonthlyRevenue {
  month: string;
  amount: number;
}

interface TopProduct {
  productId: string;
  productName: string;
  amount: number;
}

class RevenueServiceClass {
  getRevenueByUser(userId: string): RevenueRecord[] {
    const rows = db.prepare(
      "SELECT * FROM revenue_ledger WHERE user_id = ? ORDER BY processed_at DESC"
    ).all(userId) as Record<string, unknown>[];
    return rows.map(mapRow);
  }

  async getTotalRevenue(): Promise<number> {
    const result = db.prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM revenue_ledger WHERE status = 'completed'"
    ).get() as { total: number };
    return result.total;
  }

  createRevenueRecord(record: Omit<RevenueRecord, 'id' | 'processedAt' | 'date'>): RevenueRecord {
    const id = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const processedAt = new Date().toISOString();
    db.prepare(`
      INSERT INTO revenue_ledger (id, user_id, transaction_type, amount, currency, description,
        related_entity_id, related_entity_type, status, metadata_json, processed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      record.userId,
      record.transactionType,
      record.amount,
      record.currency,
      record.description,
      record.relatedEntityId ?? null,
      record.relatedEntityType ?? null,
      record.status,
      JSON.stringify(record.metadata ?? {}),
      processedAt
    );
    const row = db.prepare('SELECT * FROM revenue_ledger WHERE id = ?').get(id) as Record<string, unknown>;
    return mapRow(row);
  }

  getRevenueReport(startDate?: string, endDate?: string): RevenueRecord[] {
    let query = 'SELECT * FROM revenue_ledger WHERE 1=1';
    const params: string[] = [];
    if (startDate) { query += ' AND processed_at >= ?'; params.push(startDate); }
    if (endDate)   { query += ' AND processed_at <= ?'; params.push(endDate); }
    query += ' ORDER BY processed_at DESC';
    const rows = db.prepare(query).all(...params) as Record<string, unknown>[];
    return rows.map(mapRow);
  }

  async generateReport(startDate: string, endDate: string): Promise<RevenueReport> {
    const records = this.getRevenueReport(startDate, endDate);
    const totalRevenue = records
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
    return { startDate, endDate, totalRevenue, records, count: records.length };
  }

  async getRevenueBySource(): Promise<RevenueSource[]> {
    const rows = db.prepare(`
      SELECT related_entity_type as source, SUM(amount) as amount
      FROM revenue_ledger WHERE status = 'completed'
      GROUP BY related_entity_type
    `).all() as { source: string; amount: number }[];
    return rows.map(r => ({ source: r.source || 'platform', amount: r.amount }));
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    const rows = db.prepare(`
      SELECT strftime('%Y-%m', processed_at) as month, SUM(amount) as amount
      FROM revenue_ledger WHERE status = 'completed'
      GROUP BY month ORDER BY month DESC
    `).all() as { month: string; amount: number }[];
    return rows;
  }

  async getTopPerformingProducts(): Promise<TopProduct[]> {
    const rows = db.prepare(`
      SELECT related_entity_id as productId, related_entity_type as productName, SUM(amount) as amount
      FROM revenue_ledger WHERE status = 'completed' AND related_entity_id IS NOT NULL
      GROUP BY related_entity_id ORDER BY amount DESC LIMIT 10
    `).all() as { productId: string; productName: string; amount: number }[];
    return rows;
  }

  async getProjectedRevenue(): Promise<number> {
    const result = db.prepare(`
      SELECT COALESCE(AVG(monthly_total), 0) as avg_monthly
      FROM (
        SELECT strftime('%Y-%m', processed_at) as month, SUM(amount) as monthly_total
        FROM revenue_ledger WHERE status = 'completed'
        GROUP BY month
      )
    `).get() as { avg_monthly: number };
    return (result.avg_monthly || 0) * 12;
  }

  getAllEntries(): RevenueRecord[] {
    const rows = db.prepare('SELECT * FROM revenue_ledger ORDER BY processed_at DESC').all() as Record<string, unknown>[];
    return rows.map(mapRow);
  }
}

export const RevenueService = new RevenueServiceClass();