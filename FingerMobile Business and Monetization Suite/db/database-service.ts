import { query, queryOne } from './postgres-client.js';
import type { AccessKey, Coupon, KYCRecord, KYBRecord } from '../types.js';

/**
 * Database Service for New Tables
 * Implements all placeholder methods from business-suite-service.ts
 */

export const dbService = {
  // ============================================================
  // Access Key Management
  // ============================================================
  
  async getAccessKeys(seshatPageId: string): Promise<AccessKey[]> {
    const result = await query(
      'SELECT * FROM access_keys WHERE seshat_page_id = $1 ORDER BY created_at DESC',
      [seshatPageId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      seshatPageId: row.seshat_page_id,
      keyToken: row.key_token,
      keyType: row.key_type,
      expiresAt: row.expires_at,
      isActive: row.is_active,
      createdAt: row.created_at,
    }));
  },

  async createAccessKeyRecord(
    seshatPageId: string,
    keyType: string,
    expiryDays: number = 30
  ): Promise<AccessKey | null> {
    // Generate access key using Guardian AI
    const { guardianAI } = await import('../guardian-ai-service.js');
    const { keyToken, expiresAt } = await guardianAI.createAccessKey(
      seshatPageId,
      keyType as 'FOLLOWERSHIP' | 'MEMBERSHIP',
      expiryDays
    );

    const result = await queryOne(
      `INSERT INTO access_keys (seshat_page_id, key_token, key_type, expires_at, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [seshatPageId, keyToken, keyType, expiresAt, true]
    );

    if (!result) return null;

    return {
      id: result.id,
      seshatPageId: result.seshat_page_id,
      keyToken: result.key_token,
      keyType: result.key_type,
      expiresAt: result.expires_at,
      isActive: result.is_active,
      createdAt: result.created_at,
    };
  },

  async revokeAccessKey(id: string): Promise<boolean> {
    const result = await query(
      'UPDATE access_keys SET is_active = false WHERE id = $1',
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  },

  // ============================================================
  // Coupon Management
  // ============================================================
  
  async getCoupons(seshatPageId: string): Promise<Coupon[]> {
    const result = await query(
      'SELECT * FROM coupons WHERE seshat_page_id = $1 ORDER BY created_at DESC',
      [seshatPageId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      seshatPageId: row.seshat_page_id,
      couponCode: row.coupon_code,
      description: row.description,
      discountPercentage: row.discount_percentage,
      discountAmount: row.discount_amount,
      minPurchaseAmount: row.min_purchase_amount,
      maxUses: row.max_uses,
      currentUses: row.current_uses,
      isRedeemed: row.is_redeemed,
      redeemedByUserId: row.redeemed_by_user_id,
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      createdAt: row.created_at,
    }));
  },

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
  }): Promise<Coupon | null> {
    // Generate coupon code if not provided
    let couponCode = data.couponCode;
    if (!couponCode) {
      const { guardianAI } = await import('../guardian-ai-service.js');
      couponCode = await guardianAI.createCoupon(data.seshatPageId, data.prefix);
    }

    const result = await queryOne(
      `INSERT INTO coupons (
        seshat_page_id, coupon_code, description, discount_percentage, 
        discount_amount, min_purchase_amount, max_uses, current_uses,
        is_redeemed, valid_from, valid_until, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, NOW()
      ) RETURNING *`,
      [
        data.seshatPageId,
        couponCode,
        data.description || null,
        data.discountPercentage || null,
        data.discountAmount || null,
        data.minPurchaseAmount || 0,
        data.maxUses || 1,
        0, // current_uses
        false, // is_redeemed
        data.validUntil || null,
      ]
    );

    if (!result) return null;

    return {
      id: result.id,
      seshatPageId: result.seshat_page_id,
      couponCode: result.coupon_code,
      description: result.description,
      discountPercentage: result.discount_percentage,
      discountAmount: result.discount_amount,
      minPurchaseAmount: result.min_purchase_amount,
      maxUses: result.max_uses,
      currentUses: result.current_uses,
      isRedeemed: result.is_redeemed,
      redeemedByUserId: result.redeemed_by_user_id,
      validFrom: result.valid_from,
      validUntil: result.valid_until,
      createdAt: result.created_at,
    };
  },

  async redeemCoupon(code: string, userId: string): Promise<{
    success: boolean;
    message: string;
    coupon?: Coupon;
  }> {
    // Check if coupon exists and is valid
    const couponResult = await queryOne(
      'SELECT * FROM coupons WHERE coupon_code = $1',
      [code]
    );

    if (!couponResult) {
      return {
        success: false,
        message: 'Coupon not found',
      };
    }

    // Check if already redeemed
    if (couponResult.is_redeemed) {
      return {
        success: false,
        message: 'Coupon has already been redeemed',
      };
    }

    // Check usage limit
    if (couponResult.current_uses >= couponResult.max_uses) {
      return {
        success: false,
        message: 'Coupon usage limit reached',
      };
    }

    // Check validity period
    const now = new Date();
    const validFrom = new Date(couponResult.valid_from);
    const validUntil = couponResult.valid_until ? new Date(couponResult.valid_until) : null;

    if (now < validFrom) {
      return {
        success: false,
        message: 'Coupon is not yet valid',
      };
    }

    if (validUntil && now > validUntil) {
      return {
        success: false,
        message: 'Coupon has expired',
      };
    }

    // Redeem the coupon
    const updateResult = await query(
      `UPDATE coupons 
       SET is_redeemed = true, redeemed_by_user_id = $1, current_uses = current_uses + 1
       WHERE coupon_code = $2
       RETURNING *`,
      [userId, code]
    );

    if (updateResult.rowCount === 0) {
      return {
        success: false,
        message: 'Failed to redeem coupon',
      };
    }

    const updatedCoupon = updateResult.rows[0];

    return {
      success: true,
      message: 'Coupon redeemed successfully',
      coupon: {
        id: updatedCoupon.id,
        seshatPageId: updatedCoupon.seshat_page_id,
        couponCode: updatedCoupon.coupon_code,
        description: updatedCoupon.description,
        discountPercentage: updatedCoupon.discount_percentage,
        discountAmount: updatedCoupon.discount_amount,
        minPurchaseAmount: updatedCoupon.min_purchase_amount,
        maxUses: updatedCoupon.max_uses,
        currentUses: updatedCoupon.current_uses,
        isRedeemed: updatedCoupon.is_redeemed,
        redeemedByUserId: updatedCoupon.redeemed_by_user_id,
        validFrom: updatedCoupon.valid_from,
        validUntil: updatedCoupon.valid_until,
        createdAt: updatedCoupon.created_at,
      },
    };
  },

  // ============================================================
  // KYC/KYB Status Lookup
  // ============================================================
  
  async getKYCStatus(userId: string): Promise<{
    status: string;
    kycRecord?: KYCRecord | null;
  }> {
    const result = await queryOne(
      'SELECT * FROM kyc_records WHERE user_id = $1',
      [userId]
    );

    if (!result) {
      return {
        status: 'NOT_SUBMITTED',
        kycRecord: null,
      };
    }

    const kycRecord: KYCRecord = {
      id: result.id,
      userId: result.user_id,
      fullLegalName: result.full_legal_name,
      dateOfBirth: result.date_of_birth,
      isAbove22Years: result.is_above_22_years,
      nationality: result.nationality,
      idDocumentType: result.id_document_type,
      idDocumentNumber: result.id_document_number,
      biometricFaceHash: result.biometric_face_hash,
      addressLine1: result.address_line1,
      addressLine2: result.address_line2,
      city: result.city,
      stateProvince: result.state_province,
      postalCode: result.postal_code,
      countryCode: result.country_code,
      status: result.status,
      reviewedBy: result.reviewed_by || [],
      reviewNotes: result.review_notes,
      submittedAt: result.submitted_at,
      reviewedAt: result.reviewed_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    return {
      status: result.status,
      kycRecord,
    };
  },

  async getKYBStatus(userId: string): Promise<{
    status: string;
    kybRecord?: KYBRecord | null;
  }> {
    const result = await queryOne(
      'SELECT * FROM kyb_records WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (!result) {
      return {
        status: 'NOT_SUBMITTED',
        kybRecord: null,
      };
    }

    const kybRecord: KYBRecord = {
      id: result.id,
      userId: result.user_id,
      businessLegalName: result.business_legal_name,
      businessRegistrationNumber: result.business_registration_number,
      businessType: result.business_type,
      taxId: result.tax_id,
      incorporationDate: result.incorporation_date,
      registeredAddress: result.registered_address,
      businessEmail: result.business_email,
      businessPhone: result.business_phone,
      websiteUrl: result.website_url,
      industryCategory: result.industry_category,
      annualRevenueRange: result.annual_revenue_range,
      employeeCountRange: result.employee_count_range,
      documentsJson: result.documents_json,
      status: result.status,
      reviewedBy: result.reviewed_by || [],
      reviewNotes: result.review_notes,
      submittedAt: result.submitted_at,
      reviewedAt: result.reviewed_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    return {
      status: result.status,
      kybRecord,
    };
  },

  // ============================================================
  // Admin KYC/KYB Approval/Rejection
  // ============================================================
  
  async approveKYC(kycId: string, reviewerId: string, notes?: string): Promise<boolean> {
    const result = await query(
      `UPDATE kyc_records 
       SET status = 'APPROVED', reviewed_by = array_append(COALESCE(reviewed_by, ARRAY[]::uuid[]), $2::uuid),
           review_notes = COALESCE($3, ''), reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [kycId, reviewerId, notes || '']
    );
    
    return (result.rowCount ?? 0) > 0;
  },

  async rejectKYC(kycId: string, reviewerId: string, reason: string): Promise<boolean> {
    const result = await query(
      `UPDATE kyc_records 
       SET status = 'REJECTED', reviewed_by = array_append(COALESCE(reviewed_by, ARRAY[]::uuid[]), $2::uuid),
           review_notes = $3, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [kycId, reviewerId, reason]
    );
    
    return (result.rowCount ?? 0) > 0;
  },

  async approveKYB(kybId: string, reviewerId: string, notes?: string): Promise<boolean> {
    const result = await query(
      `UPDATE kyb_records 
       SET status = 'APPROVED', reviewed_by = array_append(COALESCE(reviewed_by, ARRAY[]::uuid[]), $2::uuid),
           review_notes = COALESCE($3, ''), reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [kybId, reviewerId, notes || '']
    );
    
    return (result.rowCount ?? 0) > 0;
  },

  async rejectKYB(kybId: string, reviewerId: string, reason: string): Promise<boolean> {
    const result = await query(
      `UPDATE kyb_records 
       SET status = 'REJECTED', reviewed_by = array_append(COALESCE(reviewed_by, ARRAY[]::uuid[]), $2::uuid),
           review_notes = $3, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [kybId, reviewerId, reason]
    );
    
    return (result.rowCount ?? 0) > 0;
  },
};
