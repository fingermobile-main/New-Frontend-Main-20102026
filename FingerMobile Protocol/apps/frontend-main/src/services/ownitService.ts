import React, {} from 'react';
/**
 * Ownit Service - Order Returns & Warranty Tracking
 * Handles product ownership, order management, returns, and warranty claims
 */

import { api } from './api';

// Types
export interface OwnitCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface OwnitEntry {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category_id?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  price_paid?: number; // Alias for purchase_price
  product_name?: string; // Display name for products,
  currency: string;
  owner_id: string;
  status: 'active' | 'sold' | 'lost' | 'stolen' | 'archived';
  location?: string;
  images: string[];
  receipt_url?: string;
  warranty_card_url?: string;
  warranty_start_date?: string;
  warranty_end_date?: string;
  warranty_provider?: string;
  warranty_type?: 'manufacturer' | 'extended' | 'third_party' | 'none';
  warranty_documents: string[];
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnitOrder {
  id: string;
  order_number: string;
  seller_name?: string;
  seller_contact?: string;
  order_date: string;
  delivery_date?: string;
  total_amount: number;
  currency: string;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'refunded' | 'cancelled';
  shipping_address?: any;
  tracking_number?: string;
  carrier?: string;
  shipping_status?: string;
  owner_id: string;
  status: 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
  invoice_url?: string;
  receipt_url?: string;
  items?: any[];
  created_at: string;
  updated_at: string;
}

export interface OwnitReturn {
  id: string;
  return_number: string;
  order_id: string;
  reason: string;
  reason_category: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'damaged_in_shipping' | 'other';
  description?: string;
  return_request_date: string;
  expected_pickup_date?: string;
  actual_return_date?: string;
  items: any[];
  refund_amount?: number;
  refund_method?: string;
  refund_status: 'pending' | 'approved' | 'processing' | 'completed' | 'denied';
  refund_processed_date?: string;
  return_shipping_label_url?: string;
  return_tracking_number?: string;
  status: 'requested' | 'approved' | 'in_transit' | 'received' | 'inspected' | 'completed' | 'denied';
  seller_notes?: string;
  customer_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnitWarrantyClaim {
  id: string;
  claim_number: string;
  entry_id: string;
  issue_description?: string;
  issue_category: 'manufacturing_defect' | 'wear_and_tear' | 'accidental_damage' | 'software_issue' | 'battery_issue' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  issue_discovered_date: string;
  claim_submitted_date: string;
  expected_resolution_date?: string;
  actual_resolution_date?: string;
  photos: string[];
  videos: string[];
  diagnostic_reports: string[];
  resolution_type?: 'repair' | 'replacement' | 'refund' | 'credit' | 'denied';
  resolution_description?: string;
  repair_cost?: number;
  covered_by_warranty: boolean;
  service_provider?: string;
  service_location?: string;
  appointment_date?: string;
  completion_date?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'in_progress' | 'completed' | 'denied' | 'appealed';
  claim_notes?: string;
  provider_response?: string;
  created_at: string;
  updated_at: string;
}

class OwnitService {
  private baseUrl = '/api/ownit';

  // Categories
  async getCategories(): Promise<OwnitCategory[]> {
    const response = await api.get(`${this.baseUrl}/categories`);
    return response.data;
  }

  // Entries (Products)
  async getEntries(params?: { limit?: number; offset?: number; category_id?: string; status?: string }): Promise<{ entries: OwnitEntry[];
  total: number }> {
    const response = await api.get(`${this.baseUrl}/entries`, { params });
    return response.data;
  }

  async getEntry(entryId: string): Promise<OwnitEntry> {
    const response = await api.get(`${this.baseUrl}/entries/${entryId}`);
    return response.data;
  }

  async createEntry(entryData: Partial<OwnitEntry>): Promise<OwnitEntry> {
    const response = await api.post(`${this.baseUrl}/entries`, entryData);
    return response.data;
  }

  async updateEntry(entryId: string, entryData: Partial<OwnitEntry>): Promise<OwnitEntry> {
    const response = await api.put(`${this.baseUrl}/entries/${entryId}`, entryData);
    return response.data;
  }

  async deleteEntry(entryId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/entries/${entryId}`);
  }

  // Orders
  async getOrders(params?: { limit?: number; offset?: number; status?: string }): Promise<{ orders: OwnitOrder[];
  total: number }> {
    const response = await api.get(`${this.baseUrl}/orders`, { params });
    return response.data;
  }

  async getOrder(orderId: string): Promise<OwnitOrder> {
    const response = await api.get(`${this.baseUrl}/orders/${orderId}`);
    return response.data;
  }

  async createOrder(orderData: Partial<OwnitOrder>): Promise<OwnitOrder> {
    const response = await api.post(`${this.baseUrl}/orders`, orderData);
    return response.data;
  }

  async updateOrder(orderId: string, orderData: Partial<OwnitOrder>): Promise<OwnitOrder> {
    const response = await api.put(`${this.baseUrl}/orders/${orderId}`, orderData);
    return response.data;
  }

  // Returns
  async getReturns(params?: { order_id?: string; status?: string }): Promise<OwnitReturn[]> {
    const response = await api.get(`${this.baseUrl}/returns`, { params });
    return response.data;
  }

  async createReturn(returnData: Partial<OwnitReturn>): Promise<OwnitReturn> {
    const response = await api.post(`${this.baseUrl}/returns`, returnData);
    return response.data;
  }

  async updateReturn(returnId: string, returnData: Partial<OwnitReturn>): Promise<OwnitReturn> {
    const response = await api.put(`${this.baseUrl}/returns/${returnId}`, returnData);
    return response.data;
  }

  // Warranty Claims
  async getWarrantyClaims(params?: { entry_id?: string; status?: string }): Promise<OwnitWarrantyClaim[]> {
    const response = await api.get(`${this.baseUrl}/warranty-claims`, { params });
    return response.data;
  }

  async createWarrantyClaim(claimData: Partial<OwnitWarrantyClaim>): Promise<OwnitWarrantyClaim> {
    const response = await api.post(`${this.baseUrl}/warranty-claims`, claimData);
    return response.data;
  }

  async updateWarrantyClaim(claimId: string, claimData: Partial<OwnitWarrantyClaim>): Promise<OwnitWarrantyClaim> {
    const response = await api.put(`${this.baseUrl}/warranty-claims/${claimId}`, claimData);
    return response.data;
  }

  // User's owned items
  async getUserEntries(userId: string): Promise<OwnitEntry[]> {
    const response = await api.get(`${this.baseUrl}/users/${userId}/entries`);
    return response.data;
  }

  // User's orders
  async getUserOrders(userId: string): Promise<OwnitOrder[]> {
    const response = await api.get(`${this.baseUrl}/users/${userId}/orders`);
    return response.data;
  }

  // Expiring warranties (next 30 days)
  async getExpiringWarranties(days = 30): Promise<OwnitEntry[]> {
    const response = await api.get(`${this.baseUrl}/warranties/expiring`, {params: { days } });
    return response.data;
  }
}

export const ownitService = new OwnitService();
