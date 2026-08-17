import React, {} from 'react';
import { api } from './api';
import * as MockMarketplaceService from '../__mocks__/marketplaceService';
import {
  Product,
  Order,
  CartItem
} from '../types';
import { MarketplaceFilters } from '../types/marketplace';

// Define missing types
export interface Category {id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  imageUrl?: string;
}

export interface Review {id: string;
  productId: string;
  memberId: string;
  rating: number;
  title: string;
  comment: string;
  helpfulCount: number;
  createdAt: string;
}

export interface WishlistItem {id: string;
  productId: string;
  memberId: string;
  addedAt: string;
}

export interface Promotion {id: string;
  title: string;
  description?: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  minimumOrderValue?: number;
}

class MarketplaceService {
  private baseUrl: string;

  constructor(baseUrl = "/marketplace") {
    this.baseUrl = baseUrl;
  }

  // Product Management
  async getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
    sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
    page?: number;
    limit?: number;
  }): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get(
        `${this.baseUrl}/products?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProductById(
  id: string): Promise<Product> {
    try {
      const response = await api.get(`${this.baseUrl}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async createProduct(
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    try {
      const response = await api.post(
        `${this.baseUrl}/products`,
        productData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(
  id: string,
productData: Partial<Product>,
  ): Promise<Product> {
    try {
      const response = await api.put(
        `${this.baseUrl}/products/${id}`,
        productData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(
  id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get(`${this.baseUrl}/categories`);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Cart Management
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/cart`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }

  async addToCart(
  productId: string, quantity = 1): Promise<CartItem[]> {
    try {
      const response = await api.post(`${this.baseUrl}/cart`, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async updateCartItem(
  productId: string,
quantity: number,
  ): Promise<CartItem[]> {
    try {
      const response = await api.put(`${this.baseUrl}/cart/${productId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating cart item ${productId}:`, error);
      throw error;
    }
  }

  async removeFromCart(
  productId: string): Promise<CartItem[]> {
    try {
      const response = await api.delete(`${this.baseUrl}/cart/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing from cart ${productId}:`, error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/cart`);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get(`${this.baseUrl}/orders`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  async getOrderById(
  id: number): Promise<Order> {
    try {
      const response = await api.get(`${this.baseUrl}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  }

  async createOrder(
  items: {productId: string;
  quantity: number }[],
paymentMethod: string,
  ): Promise<Order> {
    try {
      const response = await api.post(`${this.baseUrl}/orders`, {
        items,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async updateOrderStatus(
  orderId: string,
status: Order["status"],
  ): Promise<Order> {
    try {
      const response = await api.patch(`${this.baseUrl}/orders/${orderId}`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId},
status:`, error);
      throw error;
    }
  }

  // Reviews
  async getReviews(
  productId: string): Promise<Review[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/products/${productId}/reviews`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  }

  async addReview(
  productId: string,
reviewData: Omit<Review, "id" | "created_at" | "product_id" | "member_id">,
  ): Promise<Review> {
    try {
      const response = await api.post(
        `${this.baseUrl}/products/${productId}/reviews`,
        reviewData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding review for product ${productId}:`, error);
      throw error;
    }
  }

  // Wishlist
  async getWishlist(): Promise<WishlistItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/wishlist`);
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  }

  async addToWishlist(
  productId: string): Promise<WishlistItem[]> {
    try {
      const response = await api.post(`${this.baseUrl}/wishlist`, {
        productId
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding product ${productId} to,
wishlist:`, error);
      throw error;
    }
  }

  async removeFromWishlist(
  productId: string): Promise<WishlistItem[]> {
    try {
      const response = await api.delete(
        `${this.baseUrl}/wishlist/${productId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing from cart ${productId}:`, error);
      throw error;
    }
  }

  // Promotions
  async getActivePromotions(): Promise<Promotion[]> {
    try {
      const response = await api.get(`${this.baseUrl}/promotions/active`);
      return response.data;
    } catch (error) {
      console.error("Error fetching active promotions:", error);
      throw error;
    }
  }

  // Search
  async searchProducts(
  query: string,
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
    },
  ): Promise<Product[]> {
    try {
      const params = new URLSearchParams({ query });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get(
        `${this.baseUrl}/search?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }
}

export default new MarketplaceService();