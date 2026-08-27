import React, { useState } from 'react';
import { Search, ShoppingCart, Package, Truck } from 'lucide-react';

const MarketplacePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cartItems, setCartItems] = useState<number>(2);

  const categories = ['All', 'Fashion', 'Electronics', 'Beauty', 'Art', 'Gems'];
  
  const products = [
    {
      id: 1,
      name: 'Luxe Desk Chair',
      seller: '@fingerlux',
      price: '₦128,000',
      image: 'https://images.unsplash.com/photo-1524758870432-af57e54afa26?w=400&q=60',
      discount: null
    },
    {
      id: 2,
      name: 'Pro Gamer Kit',
      seller: '@gamerhub',
      price: '₦89,900',
      originalPrice: '₦112k',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=60',
      discount: '-20%'
    },
    {
      id: 3,
      name: 'Studio Headphones',
      seller: '@beatwave',
      price: '₦54,000',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=60',
      discount: null
    },
    {
      id: 4,
      name: 'Silk Collection',
      seller: '@fingerlux',
      price: '₦76,500',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=60',
      discount: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 border-b border-gray-700 mb-6">
        <span className="font-bold text-lg text-orange-400">FingerMarket</span>
        <div className="relative flex-1 max-w-md ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            placeholder="Search products & sellers" 
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm outline-none focus:border-orange-500"
          />
        </div>
        <div className="flex-1"></div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 text-sm font-semibold">
          <ShoppingCart className="h-4 w-4" />
          Cart 
          <span className="text-xs text-orange-400">({cartItems})</span>
        </button>
      </header>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activeCategory === category
                ? 'bg-orange-500 text-gray-900'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="aspect-square bg-gray-700 relative">
              <img 
                src={product.image} 
                className="w-full h-full object-cover" 
                alt={product.name} 
              />
              {product.discount && (
                <span className="absolute text-xs px-1.5 py-0.5 rounded bg-orange-500 text-gray-900 mt-2 ml-2">
                  {product.discount}
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-gray-400">{product.seller}</p>
              <p className="text-orange-400 text-base font-bold mt-1">
                {product.price}
                {product.originalPrice && (
                  <span className="text-xs line-through text-gray-400 ml-1">
                    {product.originalPrice}
                  </span>
                )}
              </p>
              <button className="mt-2 w-full py-1.5 rounded-lg bg-orange-500 text-gray-900 text-xs font-bold">
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;