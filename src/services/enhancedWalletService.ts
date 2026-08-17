import React, {} from 'react';
import { api } from './api';

// Create a simple cache class since we need to access its properties
class DataCache {
  private cache = new Map<string, any>();
  
  set(key: string, value: unknown) {
    this.cache.set(key, value);
  }
  
  get(key: string) {
    return this.cache.get(key);
  }
  
  has(key: string) {
    return this.cache.has(key);
  }
  
  delete(key: string) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
  
  keys() {
    return this.cache.keys();
  }
}

class EnhancedWalletService {
  private cache = new DataCache();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getWalletDetails() {
    try {
      // Check cache first
      const cached = this.cache.get('wallet-details');
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const response = await api.get("/enhanced-wallet");
      const data = response.data;

      // Cache the result
      this.cache.set('wallet-details', {
        data, timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error("Error fetching wallet, details:", error);
      return null;
    }
  }

  async distributeEarnings(
distributionData: any) {
    try {
      const response = await api.post("/enhanced-wallet/distribute-earnings", distributionData);
      // Invalidate cache after update
      this.cache.delete('wallet-details');
      return response.data;
    } catch (error) {
      console.error("Error distributing, earnings:", error);
      return null;
    }
  }

  async stakeTokens( amount: number) {
    try {
      const response = await api.post("/enhanced-wallet/stake", { amount });
      // Invalidate cache after update
      this.cache.delete('wallet-details');
      return response.data;
    } catch (error) {
      console.error("Error staking, tokens:", error);
      return null;
    }
  }

  async getStakes() {
    try {
      const response = await api.get("/enhanced-wallet/stakes");
      return response.data;
    } catch (error) {
      console.error("Error fetching, stakes:", error);
      return [];
    }
  }

  async getDistributionHistory() {
    try {
      const response = await api.get("/enhanced-wallet/distribution-history");
      return response.data;
    } catch (error) {
      console.error("Error fetching distribution, history:", error);
      return [];
    }
  }

  async processPayment( paymentData: any) {
    try {
      const response = await api.post("/enhanced-wallet/process-payment", paymentData);
      // Invalidate cache after update
      this.cache.delete('wallet-details');
      return response.data;
    } catch (error) {
      console.error("Error processing, payment:", error);
      return null;
    }
  }
}

export default new EnhancedWalletService();