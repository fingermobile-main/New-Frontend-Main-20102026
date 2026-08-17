import api from './api';

export const paymentAPI = {
  // Get payout history for a member
  getPayoutHistory: async (): Promise<any[]> => {
    try {
      const response = await api.get('/payout/history');
      return response.data.payouts || [];
    } catch (error) {
      console.error('Error fetching payout history:', error);
      throw error;
    }
  },

  // Get member balance
  getBalance: async (): Promise<number> => {
    try {
      const response = await api.get('/wallet/balance');
      return response.data.balance || 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  },

  // Get point balance for a member
  getPointBalance: async (): Promise<number> => {
    try {
      const response = await api.get('/wallet/points-balance');
      return response.data.points || 0;
    } catch (error) {
      console.error('Error fetching points balance:', error);
      throw error;
    }
  },

  // Get earned badges for a member
  getEarnedBadges: async (): Promise<any[]> => {
    try {
      const response = await api.get('/gamification/badges/earned');
      return response.data.badges || [];
    } catch (error) {
      console.error('Error fetching earned badges:', error);
      throw error;
    }
  },

  // Get leaderboard data
  getLeaderboard: async (): Promise<any[]> => {
    try {
      const response = await api.get('/leaderboards');
      return response.data.leaderboard || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Get usage history
  getUsageHistory: async (): Promise<any[]> => {
    try {
      const response = await api.get('/analytics/usage-history');
      return response.data.history || [];
    } catch (error) {
      console.error('Error fetching usage history:', error);
      throw error;
    }
  },

  // Create a new payout
  createPayout: async (payoutData: any): Promise<any> => {
    try {
      const response = await api.post('/payout', payoutData);
      return response.data.payout;
    } catch (error) {
      console.error('Error creating payout:', error);
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async (): Promise<any[]> => {
    try {
      const response = await api.get('/payments/history');
      return response.data.payments || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Get customer management data
  getCustomerManagementData: async (): Promise<any> => {
    try {
      const response = await api.get('/customers/management');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer management data:', error);
      throw error;
    }
  },

  // Update customer information
  updateCustomer: async (customerId: string, customerData: any): Promise<any> => {
    try {
      const response = await api.put(`/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Get subscription plans
  getSubscriptionPlans: async (): Promise<any[]> => {
    try {
      const response = await api.get('/subscriptions/plans');
      return response.data.plans || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  // Subscribe to a plan
  subscribeToPlan: async (planId: string, paymentMethod: any): Promise<any> => {
    try {
      const response = await api.post('/subscriptions', { planId, paymentMethod });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      throw error;
    }
  },

  // Get credit management data
  getCreditManagementData: async (): Promise<any> => {
    try {
      const response = await api.get('/credits/management');
      return response.data;
    } catch (error) {
      console.error('Error fetching credit management data:', error);
      throw error;
    }
  },

  // Update credit information
  updateCredit: async (creditId: string, creditData: any): Promise<any> => {
    try {
      const response = await api.put(`/credits/${creditId}`, creditData);
      return response.data;
    } catch (error) {
      console.error('Error updating credit:', error);
      throw error;
    }
  },

  // Process payment
  processPayment: async (paymentData: any): Promise<any> => {
    try {
      const response = await api.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<any[]> => {
    try {
      const response = await api.get('/payments/methods');
      return response.data.methods || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Add payment method
  addPaymentMethod: async (methodData: any): Promise<any> => {
    try {
      const response = await api.post('/payments/methods', methodData);
      return response.data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },

  // Delete payment method
  deletePaymentMethod: async (methodId: string): Promise<any> => {
    try {
      const response = await api.delete(`/payments/methods/${methodId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  // Update payment method
  updatePaymentMethod: async (methodId: string, methodData: any): Promise<any> => {
    try {
      const response = await api.put(`/payments/methods/${methodId}`, methodData);
      return response.data;
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  },
};