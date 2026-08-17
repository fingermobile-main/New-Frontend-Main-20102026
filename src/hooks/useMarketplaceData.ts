import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, CartItem, Order } from '../types';

interface MarketplaceData {products: Product[];
  cartItems: CartItem[];
  orders: Order[];
}

interface UseMarketplaceDataResult {products: Product[];
  cartItems: CartItem[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  addToCart: (
  productId: string,
  quantity?: number) => Promise<void>;
  removeFromCart: (
  productId: string) => Promise<void>;
  checkout: (
  paymentMethod: string) => Promise<Order | null>;
}

const useMarketplaceData = (): UseMarketplaceDataResult => {
  const [data, setData] = React.useState<MarketplaceData>({products: [],
  cartItems: [],
  orders: []
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchMarketplaceData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsResponse, cartResponse, ordersResponse] = await Promise.all([
        api.get<Product[]>("/marketplace/products"),
        api.get<CartItem[]>("/marketplace/cart"),
        api.get<Order[]>("/marketplace/orders")
      ]);

      setData({products: productsResponse.data || [],
  cartItems: cartResponse.data || [],
  orders: ordersResponse.data || []
      });
    } catch (err) {
      setError("Failed to fetch marketplace data.");
      console.error("Error fetching marketplace data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMarketplaceData();
  }, [fetchMarketplaceData]);

  const refreshData = React.useCallback(() => {
    fetchMarketplaceData();
  }, [fetchMarketplaceData]);

  const addToCart = React.useCallback(
    async (
  productId: string, quantity = 1) => {
      try {
        // In a real implementation, this would call ApiService to add item to cart
        console.info(
          `Adding product ${productId} to cart with quantity ${quantity}`,
        );
        // For now, we'll just simulate the action
      } catch (err) {
        setError("Failed to add item to cart.");
        console.error("Error adding to cart:", err);
      }
    },
    [],
  );

  const removeFromCart = React.useCallback(async (
  productId: string) => {
    try {
      // In a real implementation, this would call ApiService to remove item from cart
      console.info(`Removing product ${productId} from cart`);
      // For now, we'll just simulate the action
    } catch (err) {
      setError("Failed to remove item from cart.");
      console.error("Error removing from cart:", err);
    }
  }, []);

  const checkout = React.useCallback(
    async (
  paymentMethod: string): Promise<Order | null> => {
      try {
        // In a real implementation, this would call ApiService to create an order
        console.info(
          `Processing checkout with payment method: ${paymentMethod}`,
        );
        // For now, we'll just simulate the action
        return null;
      } catch (err) {
        setError("Failed to process checkout.");
        console.error("Error during checkout:", err);
        return null;
      }
    },
    [],
  );

  return {products: data.products,
  cartItems: data.cartItems,
  orders: data.orders,
  loading,
  error,
  refreshData,
  addToCart,
  removeFromCart,
  checkout
  };
};

export default useMarketplaceData;