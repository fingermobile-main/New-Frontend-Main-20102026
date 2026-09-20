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

class AffiliateServiceClass {
  private affiliates: Map<string, AffiliateRecord> = new Map();

  async getAffiliateById(affiliateId: string): Promise<AffiliateRecord | null> {
    return this.affiliates.get(affiliateId) || null;
  }

  async getAffiliatesByUser(userId: string): Promise<AffiliateRecord[]> {
    return Array.from(this.affiliates.values()).filter(affiliate => affiliate.userId === userId);
  }

  async createAffiliate(affiliate: Omit<AffiliateRecord, 'id' | 'joinedAt' | 'updatedAt'>): Promise<AffiliateRecord> {
    const newAffiliate: AffiliateRecord = {
      ...affiliate,
      id: Math.random().toString(36).substring(2, 15),
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.affiliates.set(newAffiliate.id, newAffiliate);
    return newAffiliate;
  }

  async updateAffiliate(affiliateId: string, updates: Partial<AffiliateRecord>): Promise<AffiliateRecord | null> {
    const existing = this.affiliates.get(affiliateId);
    if (!existing) return null;

    const updated: AffiliateRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.affiliates.set(affiliateId, updated);
    return updated;
  }

  async calculateCommission(affiliateId: string, saleAmount: number): Promise<number> {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate) return 0;
    return saleAmount * (affiliate.commissionRate / 100);
  }

  async getStats(affiliateId: string): Promise<AffiliateStats> {
    const affiliate = await this.getAffiliateById(affiliateId);
    if (!affiliate) {
      throw new Error(`Affiliate with ID ${affiliateId} not found`);
    }

    // Calculate stats for this affiliate
    const totalSales = affiliate.totalCommission / (affiliate.commissionRate / 100); // Reverse calculation
    
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

    // Return a history of commission events (simplified)
    return [{
      id: Math.random().toString(36).substring(2, 15),
      affiliateId: affiliate.id,
      amount: affiliate.totalCommission,
      date: new Date().toISOString(),
      source: 'sales',
      status: 'paid'
    }];
  }

  async getOverallPerformance(): Promise<PerformanceData> {
    const allAffiliates = Array.from(this.affiliates.values());
    const activeAffiliates = allAffiliates.filter(a => a.status === 'active');
    
    const totalCommission = allAffiliates.reduce((sum, affiliate) => sum + affiliate.totalCommission, 0);
    const avgCommissionRate = allAffiliates.length > 0 
      ? allAffiliates.reduce((sum, affiliate) => sum + affiliate.commissionRate, 0) / allAffiliates.length 
      : 0;

    return {
      totalAffiliates: allAffiliates.length,
      activeAffiliates: activeAffiliates.length,
      totalCommission,
      avgCommissionRate: parseFloat(avgCommissionRate.toFixed(2)),
      topPerforming: allAffiliates
        .sort((a, b) => b.totalCommission - a.totalCommission)
        .slice(0, 5)
        .map(a => ({ id: a.id, totalCommission: a.totalCommission }))
    };
  }

  async getAllAffiliates(): Promise<AffiliateRecord[]> {
    return Array.from(this.affiliates.values());
  }

  async update(id: string, updateData: Partial<AffiliateRecord>): Promise<AffiliateRecord | null> {
    const existing = this.affiliates.get(id);
    if (!existing) return null;

    const updated: AffiliateRecord = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.affiliates.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.affiliates.delete(id);
  }
}

export const AffiliateService = new AffiliateServiceClass();

import { AffiliateMetrics } from '../shared/types';

export const getAffiliateData = async (): Promise<AffiliateMetrics> => {
  // In a real implementation, this would fetch actual affiliate data
  // For now, returning mock data
  return {
    totalEarnings: 0,
    activeReferrals: 0,
    conversionRate: 0,
    commissionRate: 0.15, // 15% default commission
    referralCode: 'USER123',
    activity: []
  };
};

export default {
  getAffiliateData
};
