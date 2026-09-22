import { AffiliateMetrics } from '../shared/types';
import { db } from '../database.js';

export interface AffiliateRecord {
  id: string;
  userId: string;
  affiliateId: string;
  commissionRate: number;
  totalCommission: number;
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  updatedAt: string;
}

interface AffiliateStats {
  affiliateId: string;
  userId: string;
  status: string;
  commissionRate: number;
  totalCommission: number;
  totalSales: number;
  joinedAt: string;
  updatedAt: string;
}

interface CommissionRecord {
  id: string;
  affiliateId: string;
  amount: number;
  date: string;
  source: string;
  status: string;
}

interface PerformanceData {
  totalAffiliates: number;
  activeAffiliates: number;
  totalCommission: number;
  avgCommissionRate: number;
  topPerforming: Array<{ id: string; totalCommission: number }>;
}

function mapRowToAffiliate(row: Record<string, unknown>): AffiliateRecord {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    affiliateId: row.affiliate_id as string,
    commissionRate: row.commission_rate as number,
    totalCommission: row.total_commission as number,
    status: row.status as 'active' | 'inactive' | 'suspended',
    joinedAt: row.joined_at as string,
    updatedAt: row.updated_at as string
  };
}

class AffiliateServiceClass {
  async getAffiliateById(affiliateId: string): Promise<AffiliateRecord | null> {
    const row = db.prepare('SELECT * FROM affiliates WHERE affiliate_id = ?').get(affiliateId) as Record<string, unknown> | undefined;
    return row ? mapRowToAffiliate(row) : null;
  }

  async getAffiliatesByUser(userId: string): Promise<AffiliateRecord[]> {
    const rows = db.prepare('SELECT * FROM affiliates WHERE user_id = ?').all(userId) as Record<string, unknown>[];
    return rows.map(mapRowToAffiliate);
  }

  async createAffiliate(affiliate: Omit<AffiliateRecord, 'id' | 'joinedAt' | 'updatedAt'>): Promise<AffiliateRecord> {
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare(`
      INSERT INTO affiliates (id, user_id, affiliate_id, commission_rate, total_commission, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, affiliate.userId, affiliate.affiliateId, affiliate.commissionRate, affiliate.totalCommission, affiliate.status);
    
    const row = db.prepare('SELECT * FROM affiliates WHERE id = ?').get(id) as Record<string, unknown>;
    return mapRowToAffiliate(row);
  }

  async updateAffiliate(affiliateId: string, updates: Partial<AffiliateRecord>): Promise<AffiliateRecord | null> {
    const existing = await this.getAffiliateById(affiliateId);
    if (!existing) return null;

    const updateKeys: string[] = [];
    const values: unknown[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      const column = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      updateKeys.push(`${column} = ?`);
      values.push(value);
    });
    
    if (updateKeys.length > 0) {
      updateKeys.push('updated_at = CURRENT_TIMESTAMP');
      values.push(existing.id);
      
      db.prepare(`
        UPDATE affiliates 
        SET ${updateKeys.join(', ')} 
        WHERE id = ?
      `).run(...values);
    }
    
    return this.getAffiliateById(affiliateId);
  }

  async calculateCommission(affiliateId: string, saleAmount: number): Promise<number> {
    const affiliate = await this.getAffiliateById(affiliateId);
    if (!affiliate) return 0;
    return saleAmount * (affiliate.commissionRate / 100);
  }

  async getStats(affiliateId: string): Promise<AffiliateStats> {
    const affiliate = await this.getAffiliateById(affiliateId);
    if (!affiliate) {
      throw new Error(`Affiliate with ID ${affiliateId} not found`);
    }

    const totalSales = affiliate.totalCommission / (affiliate.commissionRate / 100);
    
    return {
      affiliateId: affiliate.id,
      userId: affiliate.userId,
      status: affiliate.status,
      commissionRate: affiliate.commissionRate,
      totalCommission: affiliate.totalCommission,
      totalSales,
      joinedAt: affiliate.joinedAt,
      updatedAt: affiliate.updatedAt
    };
  }

  async getCommissions(affiliateId: string): Promise<CommissionRecord[]> {
    const affiliate = await this.getAffiliateById(affiliateId);
    if (!affiliate) {
      throw new Error(`Affiliate with ID ${affiliateId} not found`);
    }

    const events = db.prepare('SELECT * FROM affiliate_events WHERE affiliate_id = ? ORDER BY occurred_at DESC').all(affiliate.id) as Record<string, unknown>[];
    
    return events.map(event => ({
      id: event.id as string,
      affiliateId: affiliate.id,
      amount: event.commission_amount as number,
      date: event.occurred_at as string,
      source: event.event_type as string,
      status: 'paid'
    }));
  }

  async getOverallPerformance(): Promise<PerformanceData> {
    const all = db.prepare('SELECT * FROM affiliates').all() as Record<string, unknown>[];
    const affiliates = all.map(mapRowToAffiliate);
    
    const activeAffiliates = affiliates.filter(a => a.status === 'active');
    const totalCommission = affiliates.reduce((sum, a) => sum + a.totalCommission, 0);
    const avgCommissionRate = affiliates.length > 0 
      ? affiliates.reduce((sum, a) => sum + a.commissionRate, 0) / affiliates.length 
      : 0;

    return {
      totalAffiliates: affiliates.length,
      activeAffiliates: activeAffiliates.length,
      totalCommission,
      avgCommissionRate: parseFloat(avgCommissionRate.toFixed(2)),
      topPerforming: affiliates
        .sort((a, b) => b.totalCommission - a.totalCommission)
        .slice(0, 5)
        .map(a => ({ id: a.id, totalCommission: a.totalCommission }))
    };
  }

  async getAllAffiliates(): Promise<AffiliateRecord[]> {
    const rows = db.prepare('SELECT * FROM affiliates').all() as Record<string, unknown>[];
    return rows.map(mapRowToAffiliate);
  }

  async update(id: string, updateData: Partial<AffiliateRecord>): Promise<AffiliateRecord | null> {
    // Finds by primary id instead of affiliate_id
    const row = db.prepare('SELECT affiliate_id FROM affiliates WHERE id = ?').get(id) as { affiliate_id: string } | undefined;
    if (!row) return null;
    return this.updateAffiliate(row.affiliate_id, updateData);
  }

  async delete(id: string): Promise<void> {
    db.prepare('DELETE FROM affiliates WHERE id = ?').run(id);
  }
}

export const AffiliateService = new AffiliateServiceClass();

export const getAffiliateData = async (): Promise<AffiliateMetrics> => {
  const row = db.prepare('SELECT * FROM affiliate_metrics LIMIT 1').get() as Record<string, unknown> | undefined;
  
  if (!row) {
    return {
      totalReferrals: 0,
      totalCommission: 0,
      conversionRate: 0,
      averageCommissionPerReferral: 0,
      topPerformingReferrals: [],
      monthlyTrends: []
    };
  }

  return {
    totalReferrals: row.total_referrals as number,
    totalCommission: row.total_commission as number,
    conversionRate: row.conversion_rate as number,
    averageCommissionPerReferral: row.average_commission_per_referral as number,
    topPerformingReferrals: row.top_performing_referrals_json ? JSON.parse(row.top_performing_referrals_json as string) : [],
    monthlyTrends: row.monthly_trends_json ? JSON.parse(row.monthly_trends_json as string) : []
  };
};

export default {
  getAffiliateData
};
