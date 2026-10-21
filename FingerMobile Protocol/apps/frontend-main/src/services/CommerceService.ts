import React, {} from 'react';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  recipientPhone?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  inventory: number;
  category?: string;
  tags?: string[];
  images: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentMethodId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutData {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethodId: string;
  couponCode?: string;
}

export interface CouponValidationResult {
  valid: boolean;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  finalAmount: number;
}

export interface TrackingHistoryNode {
  status: string;
  timestamp: string;
  location?: string;
}

export interface OrderTrackingPayload {
  status: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  history: TrackingHistoryNode[];
}

export interface SalesAnalyticsPayload {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Product[];
  conversionRate: number;
}

class CommerceService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/commerce`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Security Interceptor to append tokens from storage transparently if available
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public async getProducts(category?: string, limit: number = 20): Promise<Product[]> {
    const response = await this.api.get<Product[]>('/products', { params: { category, limit } });
    return response.data;
  }

  public async getProductById(productId: string): Promise<Product> {
    const response = await this.api.get<Product>(`/products/${productId}`);
    return response.data;
  }

  public async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await this.api.post<Product>('/products', productData);
    return response.data;
  }

  public async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    const response = await this.api.put<Product>(`/products/${productId}`, updates);
    return response.data;
  }

  public async deleteProduct(productId: string): Promise<void> {
    await this.api.delete(`/products/${productId}`);
  }

  public async getCart(userId: string): Promise<CartItem[]> {
    const response = await this.api.get<CartItem[]>(`/cart/${userId}`);
    return response.data;
  }

  public async addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItem[]> {
    const response = await this.api.post<CartItem[]>(`/cart/${userId}/add`, { productId, quantity });
    return response.data;
  }

  public async removeFromCart(userId: string, productId: string): Promise<CartItem[]> {
    const response = await this.api.post<CartItem[]>(`/cart/${userId}/remove`, { productId });
    return response.data;
  }

  public async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<CartItem[]> {
    const response = await this.api.put<CartItem[]>(`/cart/${userId}/quantity`, { productId, quantity });
    return response.data;
  }

  public async clearCart(userId: string): Promise<void> {
    await this.api.delete(`/cart/${userId}`);
  }

  public async checkout(data: CheckoutData): Promise<Order> {
    const response = await this.api.post<Order>('/checkout', data);
    return response.data;
  }

  public async getOrderById(orderId: string): Promise<Order> {
    const response = await this.api.get<Order>(`/orders/${orderId}`);
    return response.data;
  }

  public async getUserOrders(userId: string, limit: number = 20): Promise<Order[]> {
    const response = await this.api.get<Order[]>(`/orders/user/${userId}`, { params: { limit } });
    return response.data;
  }

  public async cancelOrder(orderId: string): Promise<Order> {
    const response = await this.api.post<Order>(`/orders/${orderId}/cancel`);
    return response.data;
  }

  public async trackOrder(orderId: string): Promise<OrderTrackingPayload> {
    const response = await this.api.get<OrderTrackingPayload>(`/orders/${orderId}/tracking`);
    return response.data;
  }

  public async applyCoupon(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const response = await this.api.post<CouponValidationResult>('/coupons/validate', { code, cartTotal });
    return response.data;
  }

  public async getSalesAnalytics(sellerId: string, period: string = '30d'): Promise<SalesAnalyticsPayload> {
    const response = await this.api.get<SalesAnalyticsPayload>(`/analytics/${sellerId}`, { params: { period } });
    return response.data;
  }
}

export const commerceService = new CommerceService();
export default commerceService;
