import api from './api';

export interface SpendCapMetrics {
  totalUsersWithCaps: number;
  averageCapAmount: number;
  totalCurrentSpending: number;
}

export interface AccountInactivityMetrics {
  totalInactiveAccounts: number;
  frozenAccounts: number;
  accountsWithLiabilities: number;
  totalUnpaidLiabilities: number;
}

export interface SpendCapDistribution {
  cap_range: string;
  user_count: number;
}

export interface LiabilityDistribution {
  liability_range: string;
  account_count: number;
  total_liability: number;
}

export interface DetailedSpendCapsData {
  overallStats: {
    total_users_with_caps: number;
    avg_cap_amount: number;
    max_cap_amount: number;
    min_cap_amount: number;
    total_current_spending: number;
    avg_current_spending: number;
    frozen_accounts: number;
  };
  capDistribution: SpendCapDistribution[];
}

export interface DetailedInactivityData {
  overallStats: {
    total_inactive_accounts: number;
    frozen_accounts: number;
    inactive_pending_accounts: number;
    accounts_with_liabilities: number;
    total_unpaid_liabilities: number;
    avg_days_since_login: number;
  };
  liabilityDistribution: LiabilityDistribution[];
}

export const StercsDashboardService = {
  // Get spend caps metrics
  async getSpendCapsMetrics(): Promise<DetailedSpendCapsData> {
    try {
      const response: any = await api.get('/master-dashboard/spend-caps');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get spend caps metrics:', error);
      throw error;
    }
  },

  // Get account inactivity metrics
  async getAccountInactivityMetrics(): Promise<DetailedInactivityData> {
    try {
      const response: any = await api.get('/master-dashboard/account-inactivity');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get account inactivity metrics:', error);
      throw error;
    }
  },

  // Get overview data (including spend caps and inactivity)
  async getOverview() {
    try {
      const response: any = await api.get('/master-dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Failed to get overview data:', error);
      throw error;
    }
  }
};