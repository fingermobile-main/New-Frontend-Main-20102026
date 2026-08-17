import React, {} from 'react';
/**
 * LendSqr Service - Lending and Financial Services
 * Handles loan applications, credit scoring, and financial products
 */

import { api } from './api';

export interface LoanProduct {id: string; name: string;
  description?: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  duration_days: number;
  requirements: string[];
}

export interface LoanApplication {id: string; member_id: string;
  product_id: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
  applied_at: string;
  approved_at?: string;
  disbursed_at?: string;
}

export interface CreditScore {member_id: string; score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: string[];
  last_updated: string;
}

export interface RepaymentSchedule {loan_id: string; installments: { due_date: string;
  amount: number;
  paid: boolean;
    paid_at?: string;
  }[];
}

class LendSqrService {
  private baseUrl = '/api/lendsq';

  async getLoanProducts(): Promise<LoanProduct[]> {
    const response = await api.get(`${this.baseUrl}/products`);
    return response.data;
  }

  async applyForLoan(application: Partial<LoanApplication>): Promise<LoanApplication> {
    const response = await api.post(`${this.baseUrl}/applications`, application);
    return response.data;
  }

  async getMyApplications(): Promise<LoanApplication[]> {
    const response = await api.get(`${this.baseUrl}/applications/my`);
    return response.data;
  }

  async getApplication(applicationId: string): Promise<LoanApplication> {
    const response = await api.get(`${this.baseUrl}/applications/${applicationId}`);
    return response.data;
  }

  async getCreditScore(memberId: string): Promise<CreditScore> {
    const response = await api.get(`${this.baseUrl}/credit-score/${memberId}`);
    return response.data;
  }

  async getRepaymentSchedule(loanId: string): Promise<RepaymentSchedule> {
    const response = await api.get(`${this.baseUrl}/loans/${loanId}/schedule`);
    return response.data;
  }

  async makePayment(loanId: string,
amount: number): Promise<void> {
    await api.post(`${this.baseUrl}/loans/${loanId}/payments`, { amount });
  }

  async calculateEligibility(amount: number,
duration: number): Promise<{ eligible: boolean; max_amount: number;
  estimated_rate: number }> {
    const response = await api.post(`${this.baseUrl}/eligibility`, { amount, duration });
    return response.data;
  }
}

export const lendSqrService = new LendSqrService();
