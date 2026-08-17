import React, {} from 'react';
import axios, { AxiosResponse } from "axios";
import dataCache from '../utils/dataCache';

interface GemBalance {
  balance: number;
  // Add other relevant fields for gem balance if any
}

interface GemTransaction {id: string; type: string; amount: number; date: string;
  // Add other relevant fields for gem transactions
}

interface GemEarnings {id: string; amount: number; date: string;
  // Add other relevant fields for gem earnings
}

class GemsService {
  private baseUrl: string;
  private pendingRequests: Map<string, Promise<unknown>>;

  constructor() {
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://fingerprotocol.com/api"
        : "http://localhost:3001/api";
    this.pendingRequests = new Map<string, Promise<unknown>>(); // Track pending requests to prevent duplicates
  }

  /**
   * Helper method to make API requests with deduplication
   * @param {string} key - Request identifier
   * @param {Function} requestFn - Function that makes the actual request
   * @returns {Promise<unknown>} Response data
   */
  private async makeRequest<T>(key: string, requestFn: () => Promise<AxiosResponse<T>>,
  ): Promise<T> {
    // Return cached data if available
    const cachedData = dataCache.get(key);
    if (cachedData) {
      return cachedData as T;
    }

    // Return pending request if one is already in flight
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // Create new request
    const requestPromise = requestFn()
      .then((response) => {
        // Cache the result
        dataCache.set(key, response.data);
        // Remove from pending requests
        this.pendingRequests.delete(key);
        return response.data;
      })
      .catch(( error: any) => { // Remove from pending requests on error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Store pending request
    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  // Get member's gem balance
  async getGemBalance(forceRefresh = false): Promise<GemBalance> {
    const token = localStorage.getItem("token");
    const cacheKey = `gems_balance_${token}`;

    if (forceRefresh) {
      dataCache.delete(cacheKey);
    }

    return this.makeRequest<GemBalance>(cacheKey, () =>
      axios.get(`${this.baseUrl}/gems/balance`, { headers: { Authorization: `Bearer ${token}` }
      }),
    );
  }

  // Get gem transactions history
  async getGemTransactions(limit = 20, offset = 0, forceRefresh = false): Promise<GemTransaction[]> {;
    const token = localStorage.getItem("token");
    const cacheKey = `gems_transactions_${token}_${limit}_${offset}`;

    if (forceRefresh) {
      dataCache.delete(cacheKey);
    }

    return this.makeRequest<GemTransaction[]>(cacheKey, () =>
      axios.get(`${this.baseUrl}/gems/transactions`, { headers: { Authorization: `Bearer ${token}`
        },
params: { limit, offset }
      }),
    );
  }

  // Send gems to another member
  async sendGems(recipientMemberId: string, gemType: string, quantity: number, postId: string | null = null ): Promise<Record<string, unknown>> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${this.baseUrl}/gems/send`,
        {
          recipientMemberId,
          gemType,
          quantity,
          postId
        }, {headers: { Authorization: `Bearer ${token}`
          }
        } );

      // Invalidate related caches after sending gems
      dataCache.delete(`gems_balance_${token}`);
      dataCache.delete(`gems_transactions_${token}_20_0`);

      return response.data;
    } catch (error) {
      console.error("Error sending, gems:", error);
      throw error;
    }
  }

  // Get gem earnings
  async getGemEarnings(
    limit = 20,
    offset = 0,
    forceRefresh = false,
  ): Promise<GemEarnings[]> {;
    const token = localStorage.getItem("token");
    const cacheKey = `gems_earnings_${token}_${limit}_${offset}`;

    if (forceRefresh) {
      dataCache.delete(cacheKey);
    }

    return this.makeRequest<GemEarnings[]>(cacheKey, () =>
      axios.get(`${this.baseUrl}/gems/earnings`, { headers: { Authorization: `Bearer ${token}`
        },
params: { limit, offset }
      }),
    );
  }

  // Convert gems to earnings (creator monetization)
  async convertGemsToEarnings( gemType: string, quantity: number ): Promise<Record<string, unknown>> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${this.baseUrl}/gems/convert`,
        {
          gemType,
          quantity
        }, {headers: { Authorization: `Bearer ${token}`
          }
        } );

      // Invalidate related caches after converting gems
      dataCache.delete(`gems_balance_${token}`);
      dataCache.delete(`gems_earnings_${token}_20_0`);

      return response.data;
    } catch (error) {
      console.error("Error converting gems to, earnings:", error);
      throw error;
    }
  }

  /**
   * Clear all cached gem data for current member
   */
  clearCache() {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Clear all cache entries for this member
    const keys = Array.from(dataCache.getKeys() as Iterable<string>);
    for (const key of keys) {
      if (key.includes(token)) {
        dataCache.delete(key);
      }
    }
  }
}

export default new GemsService();
