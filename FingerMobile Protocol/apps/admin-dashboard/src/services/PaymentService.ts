import ApiService from './api';

export interface Subscription {
  id: string;
  userId: string;
  planId: string; // premium, pro, enterprise
  status: 'active' | 'cancelled' | 'expired' | 'suspended';
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Transaction {
  id: string;
  userId?: string;
  type: 'subscription' | 'tip' | 'donation' | 'purchase' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  externalTransactionId?: string;
  metadata?: any;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Affiliate {
  id: string;
  userId: string;
  referralCode: string;
  commissionRate: number; // Percentage
  totalReferrals: number;
  totalCommissionEarned: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface AffiliateTransaction {
  id: string;
  affiliateId: string;
  referredUserId?: string;
  transactionId?: string;
  commissionAmount: number;
  commissionRate: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: string;
  createdAt: string;
  affiliate: {
    id: string;
    referralCode: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

export interface CreateSubscriptionRequest {
  userId: string;
  planId: string;
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
}

export interface CreateTransactionRequest {
  userId?: string;
  type: 'subscription' | 'tip' | 'donation' | 'purchase' | 'refund';
  amount: number;
  currency: string;
  description: string;
  metadata?: any;
}

export interface SubscriptionListResponse {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AffiliateListResponse {
  data: Affiliate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AffiliateTransactionListResponse {
  data: AffiliateTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class PaymentService {
  private static instance: PaymentService;
  
  private constructor() {}
  
  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async getSubscriptions(params: { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc'; 
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<SubscriptionListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/subscriptions?${queryParams.toString()}`);
  }

  async getSubscriptionById(id: string): Promise<Subscription> {
    return ApiService.get(`/subscriptions/${id}`);
  }

  async createSubscription(subscriptionData: CreateSubscriptionRequest): Promise<Subscription> {
    return ApiService.post('/subscriptions', subscriptionData);
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    return ApiService.put(`/subscriptions/${id}`, data);
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return ApiService.post(`/subscriptions/${id}/cancel`);
  }

  async getTransactions(params: { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc'; 
    type?: string;
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<TransactionListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/transactions?${queryParams.toString()}`);
  }

  async getTransactionById(id: string): Promise<Transaction> {
    return ApiService.get(`/transactions/${id}`);
  }

  async createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    return ApiService.post('/transactions', transactionData);
  }

  async getAffiliates(params: { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc'; 
    status?: string;
    userId?: string;
  } = {}): Promise<AffiliateListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);

    return ApiService.get(`/affiliates?${queryParams.toString()}`);
  }

  async getAffiliateById(id: string): Promise<Affiliate> {
    return ApiService.get(`/affiliates/${id}`);
  }

  async getAffiliateTransactions(params: { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc'; 
    status?: string;
    affiliateId?: string;
  } = {}): Promise<AffiliateTransactionListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.status) queryParams.append('status', params.status);
    if (params.affiliateId) queryParams.append('affiliateId', params.affiliateId);

    return ApiService.get(`/affiliate-transactions?${queryParams.toString()}`);
  }

  async getRevenueStats(params: { 
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.period) queryParams.append('period', params.period);

    return ApiService.get(`/payments/stats/revenue?${queryParams.toString()}`);
  }

  async getMonetizationOverview(): Promise<any> {
    return ApiService.get('/payments/overview');
  }
}

export default PaymentService.getInstance();