import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useMarketplace } from '../contexts/MarketplaceContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openModal } = useAppContext();
  
  const { 
    products, 
    loading: marketplaceLoading,
    getProductById,
    handleAddToCart
  } = useMarketplace();

  // Find the product based on the URL id
  const product = products.find(p => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('gray');

  const colors = [
    { name: 'gray', value: '#6b7280' },
    { name: 'gold', value: '#e8cf8f' },
    { name: 'black', value: '#333333' }
  ];


  const handleAddToCartClick = () => {
    if (product && handleAddToCart) {
      handleAddToCart(product, quantity);
    }
    openModal('cart');
  };


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800">
            <img 
              src="https://images.unsplash.com/photo-1524758870432-af57e54afa26?w=700&q=60" 
              alt="Premium product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <span className="text-xs text-orange-400">FINGERLUX · LUXURY</span>
          <h1 className="text-2xl font-bold mt-1">Luxe Desk Chair</h1>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-orange-400">★★★★★</span>
            <span className="text-xs text-gray-400">4.8 · 214 reviews</span>
          </div>
          
          <p className="text-2xl font-bold text-orange-400 mt-3">₦128,000</p>
          
          <p className="text-gray-300 mt-3 leading-relaxed">
            Ergonomic, hand-finished. Ships within 48h across Nigeria via the FingerMobile checkout rail.
          </p>
          
          <div className="mt-5 space-y-3">
            <label className="text-xs text-gray-400">COLOUR</label>
            <div className="flex gap-2">
              {colors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color.name 
                      ? 'border-orange-500' 
                      : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                />
              ))}
            </div>
            
            <label className="text-xs text-gray-400">QTY</label>
            <div className="flex gap-2 items-center">
              <button 
                className="grid w-8 h-8 place-items-center rounded-lg border border-gray-700"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="text-sm">{quantity}</span>
              <button 
                className="grid w-8 h-8 place-items-center rounded-lg border border-gray-700"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <button className="flex-1 py-3 rounded-xl bg-orange-500 text-gray-900 text-sm font-bold">
              Add to cart
            </button>
            <button className="px-5 py-3 rounded-xl border border-gray-700 text-sm font-semibold">
              <Heart className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-4 bg-gray-800 border border-gray-700 rounded-xl p-3.5 text-xs text-gray-400">
            ORDER SVC · POST /checkout<br/>
            escrow ● settled via Wallet ✓
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;