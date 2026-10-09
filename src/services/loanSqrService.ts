/**
 * LoanSqr Service - Digital Micro-Financing & SME Lending
 * FingerMobile Protocol™ - Architected by Mbah Israel Obinna
 * Core Services: Fast Business Loans, POS Settlement, Cash Transfers,
 * Guardian AI Algorithmic Underwriting, Multi-Rail Recovery.
 */

import { api } from './api';

export interface LoanSqrProduct {
  id: string;
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  currency: string;
  interestRate: number;
  durationMonths: number;
  durationDays: number;
  processingFee: number;
  processingFeeRefundable: boolean;
  collateralRequired: boolean;
  requiresPosRecords: boolean;
  eligibilityCriteria?: Record<string, any>;
  icon?: string;
  color?: string;
  displayOrder?: number;
  current?: number;
  goal?: number;
  likesCount?: number;
  rating?: number;
}

export interface LoanSqrApplication {
  id: string;
  application_number: string;
  user_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  product_id: number;
  amount_requested: number;
  currency: string;
  duration_months: number;
  purpose: string;
  business_name: string;
  business_type: string;
  years_in_business: number;
  monthly_revenue: number;
  educational_background: string;
  employment_status: string;
  pos_terminal_id?: string;
  bank_name?: string;
  bank_account_number?: string;
  kyc_bvn?: string;
  kyc_nin?: string;
  linked_card_last4?: string;
  linked_card_brand?: string;
  processing_fee_paid: boolean;
  processing_fee_refundable: boolean;
  status: 'submitted' | 'under_review' | 'guardian_approved' | 'manual_approved' | 'disbursed' | 'rejected';
  guardian_ai_score: number;
  guardian_risk_tier: 'low' | 'medium' | 'high' | 'critical';
  guardian_recommendation: 'approve' | 'conditional' | 'decline';
  guardian_decision_notes: string;
  virtual_account_number?: string;
  disbursed_at?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  product_name?: string;
  product_interest_rate?: number;
  product_category?: string;
}

export interface LoanSqrActiveLoan {
  id: string;
  loan_number: string;
  application_id: string;
  user_id: string;
  product_id: number;
  principal_amount: number;
  currency: string;
  interest_rate: number;
  total_interest: number;
  total_repayment: number;
  outstanding_balance: number;
  duration_months: number;
  status: 'active' | 'overdue' | 'repaid' | 'defaulted';
  virtual_disbursement_account: string;
  in_app_wallet_id: string;
  payment_rail: string;
  start_date: string;
  due_date: string;
  next_payment_date: string;
  next_payment_amount: number;
  auto_debit_enabled: boolean;
  created_at: string;
  applicant_name?: string;
  business_name?: string;
  product_name?: string;
  product_title?: string;
}

export interface LoanSqrStats {
  totalDisbursed: number;
  totalOutstanding: number;
  activeLoans: number;
  overdueLoans: number;
  repaidLoans: number;
  totalApplications: number;
  approvalRate: string;
  avgCreditScore: number;
  totalPosVolume: number;
  totalLoanDeductions: number;
  activeBorrowersCount: number;
  currency: string;
  founderTitle: string;
}

export interface LoanSqrPosSettlement {
  id: string;
  user_id: string;
  terminal_id: string;
  business_name: string;
  gross_volume: number;
  net_settlement: number;
  fee_retained: number;
  loan_deduction: number;
  settlement_status: string;
  settled_at: string;
}

class LoanSqrService {
  private baseUrl = '/api/loansqr';

  async getProducts(category?: string, search?: string): Promise<LoanSqrProduct[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const response = await api.get<any>(`${this.baseUrl}/products?${params.toString()}`);
    return response.data?.products || response.data?.data || (Array.isArray(response.data) ? response.data : []);
  }

  async getProductById(id: string | number): Promise<LoanSqrProduct> {
    const response = await api.get<any>(`${this.baseUrl}/products/${id}`);
    return response.data?.data || response.data;
  }

  async submitApplication(data: Partial<LoanSqrApplication>): Promise<any> {
    const response = await api.post<any>(`${this.baseUrl}/apply`, data);
    return response.data;
  }

  async getApplications(status?: string, userId?: string): Promise<LoanSqrApplication[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (userId) params.append('user_id', userId);
    const response = await api.get<any>(`${this.baseUrl}/applications?${params.toString()}`);
    return response.data?.applications || response.data?.data || [];
  }

  async approveApplication(id: string, notes?: string): Promise<any> {
    const response = await api.patch<any>(`${this.baseUrl}/applications/${id}/approve`, { notes });
    return response.data;
  }

  async rejectApplication(id: string, reason?: string): Promise<any> {
    const response = await api.patch<any>(`${this.baseUrl}/applications/${id}/reject`, { reason });
    return response.data;
  }

  async disburseLoan(id: string, paymentRail: string = 'remita'): Promise<any> {
    const response = await api.post<any>(`${this.baseUrl}/applications/${id}/disburse`, { payment_rail: paymentRail });
    return response.data;
  }

  async getLoans(userId?: string, status?: string): Promise<LoanSqrActiveLoan[]> {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (status) params.append('status', status);
    const response = await api.get<any>(`${this.baseUrl}/loans?${params.toString()}`);
    return response.data?.loans || response.data?.data || [];
  }

  async makeRepayment(loanId: string, amount: number, paymentMethod: string = 'paystack', notes?: string): Promise<any> {
    const response = await api.post<any>(`${this.baseUrl}/loans/${loanId}/repay`, {
      amount,
      payment_method: paymentMethod,
      notes
    });
    return response.data;
  }

  async getPosSettlements(userId?: string): Promise<LoanSqrPosSettlement[]> {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    const response = await api.get<any>(`${this.baseUrl}/pos-settlements?${params.toString()}`);
    return response.data?.settlements || response.data?.data || [];
  }

  async simulatePosSettlement(data: Partial<LoanSqrPosSettlement>): Promise<any> {
    const response = await api.post<any>(`${this.baseUrl}/pos-settlements/simulate`, data);
    return response.data;
  }

  async getStats(): Promise<LoanSqrStats> {
    const response = await api.get<any>(`${this.baseUrl}/stats`);
    return response.data?.data || response.data;
  }

  async sendSupportChat(message: string, context?: any): Promise<{ reply: string; timestamp: string }> {
    const response = await api.post<any>(`${this.baseUrl}/support/chat`, { message, context });
    return response.data;
  }
}

export const loanSqrService = new LoanSqrService();
export const LoansqrService = loanSqrService; // Backward-compatibility alias
export default loanSqrService;
