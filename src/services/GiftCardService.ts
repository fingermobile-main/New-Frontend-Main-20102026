import React, {} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface GiftCard {id: string;
  code: string;
  amount: number;
  currency: string;
  status: "active" | "redeemed" | "expired";
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  redeemedBy?: string;
  redeemedDate?: string;
}

export interface GiftCardRedemption {id: string;
  giftCardId: string;
  userId: string;
  amount: number;
  timestamp: string;
  status: "success" | "failed";
}

class GiftCardService {
  private api = axios.create({baseURL: API_BASE_URL, headers: {
      'Content-Type': 'application/json'
    }
  });

  async validateCode(code: string): Promise<GiftCard> {
    const response = await this.api.post('/validate', { code });
    return response.data;
  }

  async redeemGiftCard(code: string, userId: string): Promise<GiftCardRedemption> {
    const response = await this.api.post('/redeem', { code, userId });
    return response.data;
  }

  async getGiftCardById(id: string): Promise<GiftCard> {
    const response = await this.api.get(`/${id}`);
    return response.data;
  }

  async getUserRedemptions(userId: string): Promise<GiftCardRedemption[]> {
    const response = await this.api.get(`/redemptions/user/${userId}`);
    return response.data;
  }

  async generateGiftCard(amount: number, issuer: string, expiryDays: number = 365): Promise<GiftCard> {
    const response = await this.api.post('/generate', { amount, issuer, expiryDays });
    return response.data;
  }

  async deactivateGiftCard(giftCardId: string): Promise<GiftCard> {
    const response = await this.api.post(`/${giftCardId}/deactivate`);
    return response.data;
  }

  async getActiveGiftCards(issuer?: string): Promise<GiftCard[]> {
    const response = await this.api.get('/active', {params: { issuer } });
    return response.data;
  }

  async getRedemptionStats(period: string = '30d'): Promise<{totalRedeemed: number;
  totalAmount: number;
  averageAmount: number;
  redemptionCount: number;
  }> {
    const response = await this.api.get('/stats/redemptions', {params: { period } });
    return response.data;
  }
}

export const giftCardService = new GiftCardService();
export default giftCardService;
