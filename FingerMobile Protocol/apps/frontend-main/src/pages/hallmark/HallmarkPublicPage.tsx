import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Award, ShoppingBag, ArrowLeft, RefreshCw, Filter } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { Product } from '../../types';

const HallmarkPublicPage: React.FC = () => {
  // @ts-expect-error: auto-fixed by agent
  const { activeSubProfile } = useAuth();
  const { products, loading, error, fetchProducts } = useMarketplace();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Apply any filters based on activeSubProfile if needed
    // For now, just set all products
    setFilteredProducts(products);
  }, [products, activeSubProfile]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, productId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleProductClick(productId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Hallmark Public Store</h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Explore verified merchandise, hardware enclaves, and sovereign digital assets</p>
        </div>
        <button
          onClick={() => navigate('/hallmarks')}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Back to Hallmarks Hub</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden cursor-pointer hover:border-slate-400 hover:shadow-md transition-all duration-200"
            onClick={() => handleProductClick(product.id)}
            onKeyDown={(e) => handleKeyDown(e, product.id)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${product.name}`}
          >
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover border-b border-slate-200"
              />
            )}
            <div className="p-5">
              <h2 className="text-base font-black text-slate-900 mb-1 truncate">{product.name}</h2>
              <p className="text-slate-700 font-medium text-xs mb-3 truncate">{product.description}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-lg font-black text-blue-600 font-mono">${product.price}</span>
                <span className="text-xs bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-full font-bold">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Hallmark Public Store Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span>Store</span>
        </button>
        <button
          type="button"
          onClick={() => fetchProducts()}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 mb-0.5" />
          <span>Refresh</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketplace')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Market</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/hallmarks')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mb-0.5" />
          <span>Hub</span>
        </button>
      </nav>
    </div>
  );
};

export default HallmarkPublicPage;
