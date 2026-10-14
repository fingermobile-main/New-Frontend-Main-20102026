import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import {
  Product,
  CartItem,
  Order,
  Review,
  WishlistItem
} from '../types';
import { CURATED_STOREFRONT_PRODUCTS } from '../data/curatedStorefrontData';

interface MarketplaceContextType {
  products: Product[];
  cart: CartItem[];
  cartTotal: number;
  orders: Order[];
  reviews: Review[];
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
  handleAddToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  placeOrder: () => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'productId'>) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  fetchProducts: () => void;
  getProductById: (id: string) => Product | undefined;
}

export type { MarketplaceContextType };

export const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useAppContext();
  const [products, setProducts] = useState<Product[]>(CURATED_STOREFRONT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Centralized product transformer function - wrapped in useCallback to prevent dependency issues
  const loadProductsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { default: apiService } = await import('../services/apiService');
      const data = await apiService.get('/api/storefronts').catch(() => null);

      if (data && (Array.isArray(data) ? data.length > 0 : data?.storefronts?.length > 0)) {
        const rawList = Array.isArray(data) ? data : data.storefronts;
        const transformedProducts: Product[] = rawList.map((item: any) => ({
          id: item.id || `prod_${Date.now()}_${Math.random()}`,
          name: item.name || item.title || 'Product',
          description: item.description || '',
          price: item.price || 0,
          currency: item.currency || 'NGN',
          category: item.category || item.genre || 'General',
          platform: item.platform || 'General',
          imageUrl: item.image_url || item.thumbnail || item.imageUrl || '/images/default-video-thumbnail.jpg',
          images: item.image_url ? [item.image_url] : (item.images || []),
          rating: item.rating || 4.9,
          sellerId: item.seller_id || item.creatorId || item.authorId || 'unknown',
          sellerName: item.seller_name || item.sellerName || 'Creator',
          stock: item.stock || 100,
          salesCount: item.sales_count || item.saveCount || 0,
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
          ageRestricted: item.age_restricted || false,
          contentRating: item.content_rating || 'General'
        }));
        setProducts(transformedProducts);
      } else {
        // Use curated 10-products-per-category storefront catalog (50 total)
        setProducts(CURATED_STOREFRONT_PRODUCTS);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
      setProducts(CURATED_STOREFRONT_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies for useCallback

  // Run on Mount
  useEffect(() => {
    void loadProductsData();

    const savedCart = localStorage.getItem('marketplaceCart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem('marketplaceWishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loadProductsData]); // Added loadProductsData to dependency array

  // Sync Cart Updates
  useEffect(() => {
    localStorage.setItem('marketplaceCart', JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist Updates
  useEffect(() => {
    localStorage.setItem('marketplaceWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + ((item.product?.price || 0) * item.quantity),
      0
    );
  }, [cart]);

  const fetchProducts = () => {
    loadProductsData();
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    const existingItemIndex = cart.findIndex(
      (item) => item.product?.id === product.id
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity
      };
      setCart(updatedCart);
    } else {
      const newCartItem: CartItem = {
        id: `cart_${Date.now()}_${product.id}`,
        productId: product.id,
        product: product,
        quantity: quantity,
        price: product.price,
        currency: product.currency,
        addedAt: new Date().toISOString()
      };
      setCart([...cart, newCartItem]);
    }
    showToast(`${product.name} added to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product?.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.product?.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      showToast('Cart is empty', 'warning');
      return;
    }

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      memberId: 'current-user-id', // Placeholder - should come from auth context
      items: [...cart],
      totalAmount: cartTotal,
      currency: cart[0]?.product?.currency || 'USD',
      status: 'pending',
      paymentStatus: 'pending',
      placedAt: new Date().toISOString(),
      orderNumber: `ORD-${Date.now()}`,
      customerId: 'current-user-id', // Placeholder - should come from auth context
    };

    setOrders([...orders, newOrder]);
    setCart([]); // Clear cart after order
    showToast('Order placed successfully', 'success');
  };

  const addReview = (
    productId: string,
    review: Omit<Review, 'id' | 'productId'>
  ) => {
    const newReview: Review = {
      id: `review_${Date.now()}`,
      productId,
      ...review,
      createdAt: new Date().toISOString()
    };

    setReviews([...reviews, newReview]);
    showToast('Review added successfully', 'success');
  };

  const addToWishlist = (product: Product) => {
    if (!wishlist.some(item => item.productId === product.id)) {
      const wishlistItem: WishlistItem = {
        id: `wishlist_${Date.now()}_${product.id}`,
        productId: product.id,
        userId: 'current-user-id', // Placeholder - should come from auth context
        addedAt: new Date().toISOString()
      };
      setWishlist([...wishlist, wishlistItem]);
      showToast(`${product.name} added to wishlist`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter(item => item.productId !== productId));
    showToast('Item removed from wishlist', 'info');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        cart,
        cartTotal,
        orders,
        reviews,
        wishlist,
        loading,
        error,
        handleAddToCart,
        removeFromCart,
        updateCartQuantity,
        placeOrder,
        addReview,
        addToWishlist,
        removeFromWishlist,
        fetchProducts,
        getProductById
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
