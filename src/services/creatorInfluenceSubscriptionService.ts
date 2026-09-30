import React, {} from 'react';
import axios from 'axios';

interface SubscriptionTier {
  name: string;
  level: string;
  minFollowers: number;
  maxFollowers: number;
  monthlyPriceNaira: number;
  durationMonths: number | null;
  features: string[];
}

interface SubscriptionRecommendation {
  recommended_tier: string;
  tier_name: string;
  monthly_price_naira: number;
  features: string[];
  justification: {
  followers_count: number;
  engagement_rate: number;
  engagement_score: number;
  bandwidth_usage: number;
  monetization_earnings: number;
  recommended_reason: string;
  };
is_upgrade: boolean;
current_subscription: {
  id: string;
  member_id: string;
  subscription_type: string;
  subscription_level: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  features_access: string[];
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  } | null;
}

interface Subscription {
  id: string;
  member_id: string;
  subscription_type: string;
  subscription_level: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  features_access: string[];
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

interface SubscriptionBenefits {
  level: string;
  name: string;
  monthlyPriceNaira: number;
  duration: string;
  features: string[];
  minFollowers: number;
  maxFollowers: number;
  feature_permissions: string[];
}

class CreatorInfluenceSubscriptionService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
  }

  /**
   * Get all available subscription tiers
   */
  async getAllTiers(): Promise<Record<string, SubscriptionTier>> {
    const response = await axios.get(`${this.baseUrl}/creator-influence-subscriptions/tiers`);
    return response.data.data;
  }

  /**
   * Get subscription recommendations for a user
   */
  async getRecommendations(
    memberId: string,
    followers: number,
    engagementRate: number,
    bandwidthUsage?: number,
    monetizationEarnings?: number
  ): Promise<SubscriptionRecommendation> {
    const response = await axios.post(
      `${this.baseUrl}/creator-influence-subscriptions/recommend/${memberId}`,
      {
        followers,
        engagement_rate: engagementRate,
        bandwidth_usage: bandwidthUsage || 0,
        monetization_earnings: monetizationEarnings || 0
      }
    );
    return response.data.data;
  }

  /**
   * Get current subscription for a member
   */
  async getCurrentSubscription(
    memberId: string): Promise<Subscription | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/creator-influence-subscriptions/member/${memberId}`
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get subscription benefits for a specific tier
   */
  async getSubscriptionBenefits(
    level: string): Promise<SubscriptionBenefits> {
    const response = await axios.get(
      `${this.baseUrl}/creator-influence-subscriptions/benefits/${level}`
    );
    return response.data.data;
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    data: {
  member_id: string;
  subscription_level: string;
    subscription_type?: string;
    auto_renew?: boolean;
    payment_method_id?: string;
  }): Promise<Subscription> {
    const response = await axios.post(
      `${this.baseUrl}/creator-influence-subscriptions`,
      data
    );
    return response.data.data;
  }

  /**
   * Upgrade subscription
   */
  async upgradeSubscription(
    memberId: string,
    newLevel: string
  ): Promise<Subscription> {
    const response = await axios.patch(
      `${this.baseUrl}/creator-influence-subscriptions/upgrade/${memberId}`,
      {new_level: newLevel }
    );
    return response.data.data;
  }

  /**
   * Downgrade subscription
   */
  async downgradeSubscription(
    memberId: string,
    newLevel: string
  ): Promise<Subscription> {
    const response = await axios.patch(
      `${this.baseUrl}/creator-influence-subscriptions/downgrade/${memberId}`,
      {new_level: newLevel }
    );
    return response.data.data;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    reason?: string
  ): Promise<{
  success: boolean;
  data: Record<string,
  unknown> }> {
    const response = await axios.delete(
      `${this.baseUrl}/creator-influence-subscriptions/cancel/${subscriptionId}`,
      {data: { reason } }
    );
    return response.data;
  }

  /**
   * Process subscription payment
   */
  async processPayment(
    data: {
  member_id: string;
  subscription_level: string;
  amount: number;
  payment_method: string;
    currency?: string;
    billing_details?: Record<string,
  unknown>;
  }): Promise<Record<string, unknown>> {
    const response = await axios.post(
      `${this.baseUrl}/creator-influence-subscriptions/payment`,
      data
    );
    return response.data.data;
  }

  /**
   * Get subscription usage
   */
  async getSubscriptionUsage(
    memberId: string): Promise<{
  subscription_level: string;
  features_used: number;
  features_available: number;
  usage_percentage: number;
  days_remaining: number | null;
  }> {
    const response = await axios.get(
      `${this.baseUrl}/creator-influence-subscriptions/usage/${memberId}`
    );
    return response.data.data;
  }

  /**
   * Get billing history
   */
  async getBillingHistory(
    memberId: string): Promise<Record<string, unknown>[]> {
    const response = await axios.get(
      `${this.baseUrl}/creator-influence-subscriptions/billing/${memberId}`
    );
    return response.data.data;
  }

  /**
   * Generate invoice for a subscription
   */
  async generateInvoice(
    subscriptionId: string): Promise<Record<string, unknown>> {
    const response = await axios.get(
      `${this.baseUrl}/creator-influence-subscriptions/invoice/${subscriptionId}`
    );
    return response.data.data;
  }
}

export default new CreatorInfluenceSubscriptionService();
