import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../contexts/MarketplaceContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Store
} from 'lucide-react';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    // eslint-disable-next-line no-unused-vars
    getProductById,
    handleAddToCart
  } = useMarketplace();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    // Apply filters and sorting
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
    case 'price-low':
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-high':
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'rating':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'name':
    default:
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Our Products</h1>
        <p className="text-slate-700 font-medium text-xs sm:text-sm mt-1 sm:mt-2">
          Discover our wide range of products tailored just for you
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
        <div className="w-full md:w-auto relative">
          <input
            id="product-search-input"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 min-h-[44px] px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 font-bold border-slate-300 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            id="category-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-h-[44px] flex-1 sm:flex-none px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 font-bold border-slate-300"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-h-[44px] flex-1 sm:flex-none px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 font-bold border-slate-300"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product, 1)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-700 font-medium">No products found matching your criteria</p>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Catalog"
        >
          <ShoppingBag className="w-5 h-5 text-blue-400" />
          <span className="text-[10px] font-semibold mt-0.5">Catalog</span>
        </button>
        <button
          onClick={() => {
            const el = document.getElementById('product-search-input');
            el?.focus();
          }}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5 text-indigo-400" />
          <span className="text-[10px] font-semibold mt-0.5">Search</span>
        </button>
        <button
          onClick={() => {
            const el = document.getElementById('category-filter-select');
            el?.focus();
          }}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Filter"
        >
          <SlidersHorizontal className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-semibold mt-0.5">Filter</span>
        </button>
        <button
          onClick={() => navigate('/storefront')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Stores"
        >
          <Store className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-semibold mt-0.5">Stores</span>
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
