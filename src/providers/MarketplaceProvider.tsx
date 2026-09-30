import React, { ReactNode, createContext, useContext, useState } from 'react';

interface MarketplaceContextType {
  products: any[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCartItems(prevItems => [...prevItems, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <MarketplaceContext.Provider value={{
      products,
      setProducts,
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
