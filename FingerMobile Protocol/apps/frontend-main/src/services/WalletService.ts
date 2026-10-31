import React, {} from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from './api';

// --- ROBUST INTERFACES & LEDGER TYPES ---

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  pendingBalance: number; // Escrow / Hold funds
  totalEarned: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string; // Crucial for ledger validation
  description?: string;
  category: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  metadata?: Record<string, any>; // Flexible context tracking (order id, invoice reference etc.)
  createdAt: string;
}

export interface TransferData {
  recipientId: string;
  amount: number;
  currency: string; // Ensured multi-currency validation on balance transfers
  note?: string;
}

export interface TransactionFilterParams {
  limit?: number;
  offset?: number;
  type?: 'credit' | 'debit';
  status?: 'pending' | 'completed' | 'failed';
}

class WalletService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/wallet`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Injects client authentication state automatically & implicitly
    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  /**
   * Safe operational wrapper to isolate ledger handling from network noise
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api(config);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Wallet transaction failed';
      console.error('[WalletService Error]:', errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  // --- CORE WALLET ENTITY ---

  /**
   * Fetches the wallet context of the current authenticated user session securely.
   */
  async getMyWallet(): Promise<Wallet> {
    return this.request<Wallet>({ method: 'GET', url: '/' });
  }

  /**
   * Fetches total available balance safely without downloading unnecessary sub-ledger frames
   */
  async getBalance(): Promise<{ balance: number; pendingBalance: number; currency: string }> {
    return this.request<{ balance: number; pendingBalance: number; currency: string }>({
      method: 'GET',
      url: '/balance'
    });
  }

  // --- LEDGER TRANSACTIONS & MUTATIONS ---

  async getTransactions(filters?: TransactionFilterParams): Promise<{ data: Transaction[]; total: number }> {
    return this.request<{ data: Transaction[]; total: number }>({
      method: 'GET',
      url: '/transactions',
      params: filters
    });
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    return this.request<Transaction>({ method: 'GET', url: `/transactions/${transactionId}` });
  }

  // --- MUTATIONS WITH IDEMPOTENCY SAFETY PROTECTIONS ---

  /**
   * Peer-to-peer balance transfer. Requires idempotencyKey to prevent double-spending on bad connections.
   */
  async transferFunds(data: TransferData, idempotencyKey: string): Promise<Transaction> {
    return this.request<Transaction>({
      method: 'POST',
      url: '/transfer',
      data,
      headers: { 'Idempotency-Key': idempotencyKey }
    });
  }

  /**
   * Deducts from internal wallet balance towards external banking channels
   */
  async withdraw(amount: number, currency: string, method: string, idempotencyKey: string): Promise<Transaction> {
    return this.request<Transaction>({
      method: 'POST',
      url: '/withdraw',
      data: { amount, currency, method },
      headers: { 'Idempotency-Key': idempotencyKey }
    });
  }

  /**
   * Top-up ledger wallet using an external processing gateway source
   */
  async deposit(amount: number, currency: string, method: string, idempotencyKey: string): Promise<Transaction> {
    return this.request<Transaction>({
      method: 'POST',
      url: '/deposit',
      data: { amount, currency, method },
      headers: { 'Idempotency-Key': idempotencyKey }
    });
  }

  // --- FINANCIAL INTELLIGENCE & EARNINGS LOGIC ---

  async getEarningsSummary(period: string = '30d'): Promise<{
    totalEarned: number;
    averageDaily: number;
    topSource: string;
    transactions: Transaction[];
  }> {
    return this.request({
      method: 'GET',
      url: '/me/summary/earnings',
      params: { period }
    });
  }

  async getSpendingSummary(period: string = '30d'): Promise<{
    totalSpent: number;
    averageDaily: number;
    topCategory: string;
    transactions: Transaction[];
  }> {
    return this.request({
      method: 'GET',
      url: '/me/summary/spending',
      params: { period }
    });
  }

  // --- ACCOUNTING COMPLIANCE ---

  async exportTransactions(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    return this.request<Blob>({
      method: 'GET',
      url: '/me/transactions/export',
      params: { format },
      responseType: 'blob'
    });
  }
}

export const walletService = new WalletService();
export default walletService;
