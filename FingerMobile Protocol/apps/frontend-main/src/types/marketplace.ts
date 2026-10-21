import React, {} from 'react';
import { Product, Order, CartItem, Review, WishlistItem } from './models';

// Re-export types from models for convenience
export type { WishlistItem };

// Define missing types that are not in models.ts
// Renamed to MarketplaceReview to avoid duplicate export conflict with models.ts
export interface MarketplaceReview {id: string;
  productId: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// Renamed to MarketplaceWishlistItem to avoid duplicate export conflict with models.ts
export interface MarketplaceWishlistItem {id: string;
  productId: string;
  product: Product;
  addedAt: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface MarketplaceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?:
    | 'rating'
    | 'newest'
    | 'price_asc'
    | 'price_desc'
    | 'name_asc'
    | 'name_desc';
  page?: number;
  limit?: number;
  seller?: string;
  rating?: number;
  inStock?: boolean;
}

// Removed duplicate Product interface declaration

// Removed duplicate CartItem interface declaration

// Removed duplicate Order interface declaration

export interface MarketplaceOrderItem {id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

// Removed duplicate Review interface declaration

// Removed duplicate WishlistItem interface declaration

export interface Category {id: number;
  name: string;
  description?: string;
  image_url: string;
}

export interface Promotion {id: number;
  product_id: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface MarketplaceContextType {products: Product[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  reviews: Review[];
  loadingProducts: boolean;
  loadingCart: boolean;
  loadingWishlist: boolean;
  error: string | null;
  getProductById: (
  productId: string) => Product | undefined;
  addToCart: (
  product: Product,
  quantity: number) => void;
  updateCartItem: (
  productId: string,
  quantity: number) => void;
  clearCart: () => void;
  removeFromCart: (
  productId: string) => void;
  addToWishlist: (
  product: Product) => void;
  removeFromWishlist: (
  productId: string) => void;
  fetchReviews: (
  productId: string) => Promise<Review[]>;
  createOrder: (
  shippingAddress: string,
  paymentMethod: string,
  ) => Promise<Order>;
}

// Empty export to prevent isolated modules error
export {};
