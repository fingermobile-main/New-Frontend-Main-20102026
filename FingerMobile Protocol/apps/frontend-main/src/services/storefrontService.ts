/**
 * FINGERMOBILE MONETIZATION & INVENTORY MANAGEMENT ENGINE
 * PROTOCOL: Storefront Service Core v2.4 (Enterprise Pipeline Archetype)
 * SECURITY: Transaction Hold/Escrow Escapes, Operational Taxation Routing, and Audited Ledger Safety.
 */

// ==========================================
// 📋 STRICT DOMAIN SCHEMAS & INTERFACES
// ==========================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

export interface Storefront {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  logo_url?: string;
  banner_url?: string;
  theme_colors?: ThemeColors;
  email?: string;
  phone?: string;
  website_url?: string;
  social_links?: SocialLinks;
  address?: Record<string, any>;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  business_type: 'individual' | 'boutique' | 'brand' | 'marketplace' | 'dropshipper';
  tax_id?: string;
  established_date?: string;
  currency: string;
  timezone: string;
  language: string;
  is_active: boolean;
  is_verified: boolean;
  verification_badge?: 'basic' | 'verified' | 'premium' | 'enterprise';
  analytics_enabled: boolean;
  // Monetization Meta Configuration
  subscription_tier: 'free' | 'growth' | 'pro' | 'enterprise';
  platform_fee_override_bps?: number; // Custom platform fee basis points (100 bps = 1%)
}

export interface StorefrontProduct {
  id: string;
  storefront_id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  category?: string;
  images: string[];
  stock: number;
  sku?: string;
  track_inventory?: boolean;
  status: 'active' | 'draft' | 'archived';
  unit_cost: number; // For structural margin calculations
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  unitCostSnapshot: number;
}

export interface OrderFinancialSplit {
  grossAmount: number;
  taxAmount: number;
  shippingFee: number;
  platformCommissionFee: number; // Computed marketplace cut
  merchantEarningsNet: number;    // Payout net due to vendor ledger
  escrowReleaseTimestamp: string; // Dynamic cooling-off period protection date
}

export interface StorefrontOrder {
  id: string;
  storefrontId: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  financials: OrderFinancialSplit;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payoutStatus: 'escrow' | 'released' | 'clawed_back' | 'settled';
  shippingAddress?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  lastRestocked?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  warehouse_location?: string;
  unit_cost?: number;
  supplier_id?: string;
  available_quantity?: number;
  reserved_quantity?: number;
  reorder_point?: number;
}

export interface StorefrontInventoryLog {
  id: string;
  inventory_id: string;
  change_type: 'restock' | 'sale' | 'return' | 'adjustment' | 'transfer' | 'damaged' | 'lost';
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  reference_type?: string;
  reference_id?: string;
  reason?: string;
  performed_by?: string;
  notes?: string;
  created_at: string;
}

export interface StorefrontAnalyticsDaily {
  id: string;
  storefront_id: string;
  date: string;
  page_views: number;
  unique_visitors: number;
  orders_count: number;
  total_revenue: number;
  net_platform_earnings: number; // Monetization visibility tracking
  average_order_value: number;
  conversion_rate: number;
  add_to_cart_count: number;
  cart_abandonment_rate: number;
  top_product_id?: string;
  top_product_revenue?: number;
  new_customers: number;
  returning_customers: number;
}

export interface StorefrontAnalyticsEvent {
  id: string;
  storefront_id: string;
  event_type: string;
  event_data?: Record<string, any>;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  product_id?: string;
  revenue?: number;
  currency: string;
  created_at: string;
}

export interface GetStorefrontsResponse {
  storefronts: Storefront[];
  total: number;
}

export interface GetLogsResponse {
  logs: StorefrontInventoryLog[];
  total: number;
}

export interface FinancialPerformanceSummary {
  grossGMV: number;
  netMerchantPayouts: number;
  accumulatedPlatformCut: number;
  refundVolume: number;
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  totalVisitors: number;
  conversionRate: number;
  financialPerformance: FinancialPerformanceSummary;
  today: {
    revenue: number;
    orders: number;
    visitors: number;
  };
  low_stock_count: number;
}

import apiService from './apiService';

// ==========================================
// 🚀 STOREFRONT & MONETIZATION ENGINE SERVICE
// ==========================================

class StorefrontService {
  constructor() {
    // Relying on central apiService
  }

  // --- MONETIZATION LOGIC AND FINANCIAL MATRIX FORMULAS ---

  /**
   * Evaluates the active platform commission rate based on merchant context subscription tier matrix
   * Base Fees: Free Tier (5.0%), Growth (3.5%), Pro (2.0%), Enterprise (0.75%)
   */
  public calculatePlatformCommissionBasisPoints(storefront: Storefront): number {
    if (storefront.platform_fee_override_bps !== undefined) {
      return storefront.platform_fee_override_bps;
    }
    switch (storefront.subscription_tier) {
    case 'enterprise': return 75;  // 0.75%
    case 'pro':        return 200; // 2.0%
    case 'growth':     return 350; // 3.5%
    case 'free':
    default:           return 500; // 5.0%
    }
  }

  /**
   * Generates a structural transaction split for incoming merchant checkout vectors
   * Adheres to strict decimal pricing modeling to shield calculations from floating-point arithmetic errors
   */
  public generateFinancialOrderSplit(
    grossPayloadAmount: number,
    taxAmount: number,
    shippingFee: number,
    storefront: Storefront
  ): OrderFinancialSplit {
    const platformBps = this.calculatePlatformCommissionBasisPoints(storefront);

    // Platform cut logic captures base percentage out of the pure product subtotal pool
    const productSubtotal = Math.max(0, grossPayloadAmount - taxAmount - shippingFee);
    const platformCommissionFee = Math.round((productSubtotal * platformBps) / 10000);
    const merchantEarningsNet = Math.max(0, grossPayloadAmount - platformCommissionFee);

    // Administrative Escrow Escapes: Add safe release buffers based on tier configurations (e.g., Enterprise settles sooner)
    const holdDays = storefront.subscription_tier === 'enterprise' ? 3 : 14;
    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + holdDays);

    return {
      grossAmount: grossPayloadAmount,
      taxAmount,
      shippingFee,
      platformCommissionFee,
      merchantEarningsNet,
      escrowReleaseTimestamp: releaseDate.toISOString()
    };
  }

  // --- ADMINISTRATIVE VENDOR REPOSITORIES STOREFRONTS ---

  async getStorefronts(params?: { limit?: number; offset?: number; is_verified?: boolean }): Promise<GetStorefrontsResponse> {
    const response = await apiService.get('/api/storefront/', { params });
    return response;
  }

  async getStorefront(slug: string): Promise<Storefront> {
    const response = await apiService.get(`/api/storefront/${slug}`);
    return response;
  }

  async createStorefront(storefrontData: Partial<Storefront>): Promise<Storefront> {
    const response = await apiService.post('/api/storefront/', storefrontData);
    return response;
  }

  async updateStorefront(storefrontId: string, storefrontData: Partial<Storefront>): Promise<Storefront> {
    const response = await apiService.put(`/api/storefront/${storefrontId}`, storefrontData);
    return response;
  }

  async deleteStorefront(storefrontId: string): Promise<void> {
    await apiService.delete(`/api/storefront/${storefrontId}`);
  }

  // --- PRODUCT MANAGEMENT OPERATIONS ---

  async getProducts(storefrontId: string, status?: string): Promise<StorefrontProduct[]> {
    const response = await apiService.get(`/api/storefront/products/${storefrontId}`, { params: { status } });
    return response;
  }

  async getProduct(productId: string): Promise<StorefrontProduct> {
    const response = await apiService.get(`/api/storefront/products/detail/${productId}`);
    return response;
  }

  async createProduct(storefrontId: string, productData: Partial<StorefrontProduct>): Promise<StorefrontProduct> {
    const response = await apiService.post(`/api/storefront/products/${storefrontId}`, productData);
    return response;
  }

  async updateProduct(productId: string, updates: Partial<StorefrontProduct>): Promise<StorefrontProduct> {
    const response = await apiService.put(`/api/storefront/products/${productId}`, updates);
    return response;
  }

  async deleteProduct(productId: string): Promise<void> {
    await apiService.delete(`/api/storefront/products/${productId}`);
  }

  // --- TRANSACTIONAL & ADMINISTRATIVE ORDERS MANAGEMENT ---

  async getOrders(storefrontId: string, status?: string): Promise<StorefrontOrder[]> {
    const response = await apiService.get(`/api/storefront/orders/${storefrontId}`, { params: { status } });
    return response;
  }

  async getOrderById(orderId: string): Promise<StorefrontOrder> {
    const response = await apiService.get(`/api/storefront/orders/detail/${orderId}`);
    return response;
  }

  async updateOrderStatus(orderId: string, status: StorefrontOrder['status']): Promise<StorefrontOrder> {
    const response = await apiService.put(`/api/storefront/orders/${orderId}/status`, { status });
    return response;
  }

  /**
   * Administrative Earnings Clawback System
   * Processes order returns or structural cancellation loops, returning escrow funds back to consumer pools
   */
  async processOrderClawback(orderId: string, reason: string): Promise<StorefrontOrder> {
    const response = await apiService.post(`/api/storefront/orders/${orderId}/clawback`, { reason });
    return response;
  }

  // --- COMPLEX INVENTORY RECONCILIATION CHANNELS ---

  async getInventory(storefrontId: string): Promise<InventoryItem[]> {
    const response = await apiService.get(`/api/storefront/inventory/${storefrontId}`);
    return response;
  }

  async restockProduct(productId: string, quantity: number): Promise<InventoryItem> {
    const response = await apiService.post(`/api/storefront/inventory/${productId}/restock`, { quantity });
    return response;
  }

  async getLowStockAlerts(storefrontId: string, threshold = 10): Promise<InventoryItem[]> {
    const response = await apiService.get(`/api/storefront/inventory/${storefrontId}/low-stock`, { params: { threshold } });
    return response;
  }

  async getInventoryLogs(inventoryId: string, params?: { limit?: number; offset?: number }): Promise<GetLogsResponse> {
    const response = await apiService.get(`/api/storefront/inventory/${inventoryId}/logs`, { params });
    return response;
  }

  async updateInventory(inventoryId: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await apiService.put(`/api/storefront/inventory/${inventoryId}`, updates);
    return response;
  }

  async restockInventory(inventoryId: string, quantity: number, notes?: string): Promise<InventoryItem> {
    const response = await apiService.post(`/api/storefront/inventory/${inventoryId}/restock`, { quantity, notes });
    return response;
  }

  // --- ANALYTICS AND ACCOUNTING LEDGERS ---

  async getDailyAnalytics(storefrontId: string, params?: { start_date?: string; end_date?: string }): Promise<StorefrontAnalyticsDaily[]> {
    const response = await apiService.get(`/api/storefront/${storefrontId}/analytics/daily`, { params });
    return response;
  }

  async getRealTimeEvents(storefrontId: string, params?: { limit?: number; event_type?: string }): Promise<StorefrontAnalyticsEvent[]> {
    const response = await apiService.get(`/api/storefront/${storefrontId}/analytics/events`, { params });
    return response;
  }

  async getDashboardStats(storefrontId: string): Promise<DashboardStats> {
    const response = await apiService.get(`/api/storefront/stats/${storefrontId}`);
    return response;
  }

  async getUserStorefronts(userId: string): Promise<Storefront[]> {
    const response = await apiService.get(`/api/storefront/users/${userId}/storefronts`);
    return response;
  }
}

export const storefrontService = new StorefrontService();
export default storefrontService;
