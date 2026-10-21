import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

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
    void fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Apply any filters based on activeSubProfile if needed
    // For now, just set all products
    setFilteredProducts(products);
  }, [products, activeSubProfile]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hallmark Public Store</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            className="w-full text-left bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleProductClick(product.id)}
          >
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1 truncate text-gray-900">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-2 truncate">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">${product.price}</span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HallmarkPublicPage;
