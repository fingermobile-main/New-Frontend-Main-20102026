import React, {} from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// --- ENHANCED TYPES & BUSINESS LOGIC INTERFACES ---

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'crypto' | 'wallet';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
  verified: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  description?: string;
  paymentMethodId?: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

export interface ChargeData {
  amount: number;
  currency: string; // Made required for multi-currency safety
  description?: string;
  paymentMethodId: string;
  metadata?: Record<string, any>;
}

// Earnings & Business Split Interface
export interface PlatformEarnings {
  grossAmount: number;
  platformFee: number;    // Platform take-rate cuts
  vendorPayout: number;   // Amount split to the service provider/vendor
  currency: string;
}

export interface PayoutRequest {
  amount: number;
  currency: string;
  destinationBankOrWalletId: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
}

class PaymentService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/payments`,
      headers: {
        'Content-Type': 'application/json'}
    });

    // Automatically inject auth tokens if available in client storage
    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token'); // or cookie-based session tokens
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  /**
   * Helper utility to safely wrap API requests and formalize error returns.
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api(config);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Payment processing communication error';
      console.error('[PaymentService Error]:', errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  // --- PAYMENT METHODS (Context & Security Aware) ---
  // Note: userId removed from signatures. Identity is inferred from Auth Bearer tokens safely.

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.request<PaymentMethod[]>({ method: 'GET', url: '/methods' });
  }

  async addPaymentMethod(methodData: Partial<PaymentMethod>): Promise<PaymentMethod> {
    return this.request<PaymentMethod>({ method: 'POST', url: '/methods', data: methodData });
  }

  async removePaymentMethod(methodId: string): Promise<void> {
    return this.request<void>({ method: 'DELETE', url: `/methods/${methodId}` });
  }

  async setDefaultPaymentMethod(methodId: string): Promise<void> {
    return this.request<void>({ method: 'PUT', url: `/methods/${methodId}/default` });
  }

  async verifyPaymentMethod(methodId: string, verificationCode: string): Promise<void> {
    return this.request<void>({ method: 'POST', url: `/methods/${methodId}/verify`, data: { verificationCode } });
  }

  // --- PROCESSING ENGINE (With Idempotency to prevent double charges) ---

  async createPaymentIntent(data: ChargeData, idempotencyKey?: string): Promise<PaymentIntent> {
    const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined;
    return this.request<PaymentIntent>({ method: 'POST', url: '/create-intent', data, headers });
  }

  async getPaymentIntent(intentId: string): Promise<PaymentIntent> {
    return this.request<PaymentIntent>({ method: 'GET', url: `/intents/${intentId}` });
  }

  async confirmPayment(intentId: string, paymentMethodId: string, idempotencyKey?: string): Promise<PaymentIntent> {
    const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined;
    return this.request<PaymentIntent>({
      method: 'POST',
      url: '/confirm',
      data: { paymentIntentId: intentId, paymentMethodId },
      headers
    });
  }

  async cancelPayment(intentId: string): Promise<void> {
    return this.request<void>({ method: 'POST', url: `/intents/${intentId}/cancel` });
  }

  // --- EARNINGS, PAYOUTS & SPLIT-LOGIC ---

  /**
   * Safe partial or full refund tracking
   */
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<PaymentIntent> {
    return this.request<PaymentIntent>({
      method: 'POST',
      url: '/refund',
      data: { paymentIntentId: paymentId, amount, reason }
    });
  }

  /**
   * Request payout of accumulated internal balance/earnings to a bank account or crypto wallet
   */
  async requestPayout(payoutData: PayoutRequest): Promise<{ payoutId: string; status: string }> {
    return this.request<{ payoutId: string; status: string }>({
      method: 'POST',
      url: '/payouts',
      data: payoutData
    });
  }

  // --- DATA ARCHITECTURE & REPORTING ---

  async getPaymentHistory(params?: PaginationParams): Promise<{ data: PaymentIntent[]; total: number }> {
    return this.request<{ data: PaymentIntent[]; total: number }>({
      method: 'GET',
      url: '/history',
      params
    });
  }

  async getPaymentReceipt(paymentId: string): Promise<Blob> {
    return this.request<Blob>({
      method: 'GET',
      url: `/invoices/${paymentId}/download`,
      responseType: 'blob'
    });
  }

  async processSubscriptionPayment(subscriptionId: string, amount: number): Promise<PaymentIntent> {
    return this.request<PaymentIntent>({
      method: 'POST',
      url: '/subscriptions/charge',
      data: { subscriptionId, amount }
    });
  }

  /**
   * Enhanced analytics tracking deep revenue visibility
   */
  async getEarningsAnalytics(period: string = '30d'): Promise<{
    summary: { totalProcessed: number; netEarnings: number; totalFeesCollected: number };
    volumeHistory: { date: string; gross: number; net: number }[];
    successRate: number;
  }> {
    return this.request({
      method: 'GET',
      url: '/analytics/earnings',
      params: { period }
    });
  }
}

export const paymentService = new PaymentService();
export default paymentService;
