// Database Service for admin operations

import type { KYCRecord, KYBRecord } from '../kyc-verification-service.js';

interface AccessKey {
  id: string;
  seshatPageId: string;
  key: string;
  keyType: string;
  expiryDate: string;
  createdAt: string;
  revoked: boolean;
}

interface Coupon {
  id: string;
  seshatPageId: string;
  couponCode: string;
  prefix?: string;
  description?: string;
  discountPercentage?: number;
  discountAmount?: number;
  minPurchaseAmount?: number;
  maxUses?: number;
  validUntil?: string;
  createdAt: string;
}

class DBService {
  private kycRecords: Map<string, KYCRecord> = new Map();
  private kybRecords: Map<string, KYBRecord> = new Map();
  private accessKeys: Map<string, AccessKey> = new Map();
  private coupons: Map<string, Coupon> = new Map();

  async approveKYC(kycId: string, reviewerId: string, notes?: string): Promise<KYCRecord> {
    const record = this.kycRecords.get(kycId);
    
    if (!record) {
      throw new Error(`KYC record with id ${kycId} not found`);
    }

    record.status = 'approved';
    record.reviewedAt = new Date().toISOString();
    record.reviewerId = reviewerId;
    
    if (notes) {
      // Store notes in a property if needed
      console.log(`KYC approval notes: ${notes}`);
    }

    this.kycRecords.set(kycId, record);
    console.log(`Approved KYC record ${kycId} by reviewer ${reviewerId}`);

    return record;
  }

  async rejectKYC(kycId: string, reviewerId: string, reason: string): Promise<KYCRecord> {
    const record = this.kycRecords.get(kycId);
    
    if (!record) {
      throw new Error(`KYC record with id ${kycId} not found`);
    }

    record.status = 'rejected';
    record.reviewedAt = new Date().toISOString();
    record.reviewerId = reviewerId;
    record.rejectionReason = reason;

    this.kycRecords.set(kycId, record);
    console.log(`Rejected KYC record ${kycId} by reviewer ${reviewerId}: ${reason}`);

    return record;
  }

  async approveKYB(kybId: string, reviewerId: string, notes?: string): Promise<KYBRecord> {
    const record = this.kybRecords.get(kybId);
    
    if (!record) {
      throw new Error(`KYB record with id ${kybId} not found`);
    }

    record.status = 'approved';
    record.reviewedAt = new Date().toISOString();
    record.reviewerId = reviewerId;
    
    if (notes) {
      // Store notes in a property if needed
      console.log(`KYB approval notes: ${notes}`);
    }

    this.kybRecords.set(kybId, record);
    console.log(`Approved KYB record ${kybId} by reviewer ${reviewerId}`);

    return record;
  }

  async rejectKYB(kybId: string, reviewerId: string, reason: string): Promise<KYBRecord> {
    const record = this.kybRecords.get(kybId);
    
    if (!record) {
      throw new Error(`KYB record with id ${kybId} not found`);
    }

    record.status = 'rejected';
    record.reviewedAt = new Date().toISOString();
    record.reviewerId = reviewerId;
    record.rejectionReason = reason;

    this.kybRecords.set(kybId, record);
    console.log(`Rejected KYB record ${kybId} by reviewer ${reviewerId}: ${reason}`);

    return record;
  }

  async getKYBStatus(userId: string): Promise<{
    status: string;
    kybRecord?: KYBRecord | null;
  }> {
    // Find the KYB record for this user
    let kybRecord: KYBRecord | undefined;
    
    for (const record of this.kybRecords.values()) {
      if (record.userId === userId) {
        kybRecord = record;
        break;
      }
    }

    if (!kybRecord) {
      return { status: 'not_found', kybRecord: null };
    }

    return { status: kybRecord.status, kybRecord };
  }

  async getAccessKeys(seshatPageId: string): Promise<AccessKey[]> {
    const keys: AccessKey[] = [];
    
    for (const key of this.accessKeys.values()) {
      if (key.seshatPageId === seshatPageId) {
        keys.push(key);
      }
    }

    return keys;
  }

  async createAccessKeyRecord(seshatPageId: string, keyType: string, expiryDays?: number): Promise<AccessKey> {
    const id = 'access_key_' + Math.random().toString(36).substr(2, 10);
    const key = 'AK_' + Math.random().toString(36).substr(2, 12).toUpperCase();
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (expiryDays || 30));

    const newKey: AccessKey = {
      id,
      seshatPageId,
      key,
      keyType,
      expiryDate: expiryDate.toISOString(),
      createdAt: new Date().toISOString(),
      revoked: false
    };

    this.accessKeys.set(id, newKey);
    console.log(`Created access key ${key} for page ${seshatPageId}`);

    return newKey;
  }

  async revokeAccessKey(id: string): Promise<boolean> {
    const key = this.accessKeys.get(id);
    
    if (!key) {
      return false;
    }

    key.revoked = true;
    this.accessKeys.set(id, key);
    console.log(`Revoked access key ${id}`);

    return true;
  }

  async getCoupons(seshatPageId: string): Promise<Coupon[]> {
    const coupons: Coupon[] = [];
    
    for (const coupon of this.coupons.values()) {
      if (coupon.seshatPageId === seshatPageId) {
        coupons.push(coupon);
      }
    }

    return coupons;
  }

  async createCouponRecord(data: {
    seshatPageId: string;
    couponCode?: string;
    prefix?: string;
    description?: string;
    discountPercentage?: number;
    discountAmount?: number;
    minPurchaseAmount?: number;
    maxUses?: number;
    validUntil?: string;
  }): Promise<Coupon> {
    const id = 'coupon_' + Math.random().toString(36).substr(2, 10);
    const couponCode = data.couponCode || (data.prefix || 'SAVE') + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    const newCoupon: Coupon = {
      id,
      seshatPageId: data.seshatPageId,
      couponCode,
      prefix: data.prefix,
      description: data.description,
      discountPercentage: data.discountPercentage,
      discountAmount: data.discountAmount,
      minPurchaseAmount: data.minPurchaseAmount,
      maxUses: data.maxUses,
      validUntil: data.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
      createdAt: new Date().toISOString()
    };

    this.coupons.set(id, newCoupon);
    console.log(`Created coupon ${couponCode} for page ${data.seshatPageId}`);

    return newCoupon;
  }

  async redeemCoupon(code: string, userId: string): Promise<boolean> {
    // Find the coupon by code
    let coupon: Coupon | undefined;
    
    for (const c of this.coupons.values()) {
      if (c.couponCode === code) {
        coupon = c;
        break;
      }
    }

    if (!coupon) {
      console.log(`Coupon code ${code} not found`);
      return false;
    }

    // Check if coupon is valid (not expired, not exceeded max uses)
    if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
      console.log(`Coupon code ${code} has expired`);
      return false;
    }

    // In a real implementation, we would track usage counts
    // For this mock, we'll just return true

    console.log(`Redeemed coupon ${code} for user ${userId}`);
    return true;
  }
}

// Export singleton instance
export const dbService = new DBService();