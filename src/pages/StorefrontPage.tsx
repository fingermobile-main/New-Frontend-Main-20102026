import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import {
  StorefrontIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  CartIcon,
  HeartIcon,
  StarIcon,
  ChartBarIcon,
  CubeIcon,
  CurrencyDollarIcon
} from '../icons';
import { toast } from 'react-toastify';
import { storefrontService, Storefront, StorefrontProduct, InventoryItem } from '../services/storefrontService';

// Types for Storefront features
type StorefrontFilters = {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "newest" | "price_asc" | "price_desc" | "rating_desc" | "popular";
  inStock: boolean;
};

type StorefrontAnalytics = {
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  avgRating: number;
  lowStockItems: number;
  topSellingProducts: Product[];
  revenueChart: { date: string; revenue: number }[];
};

type InventoryAlert = {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  status: 'low' | 'out' | 'critical';
};

const StorefrontPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { user } = useAuth();
  
  // State management
  const [storefronts, setStorefronts] = React.useState<Storefront[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [filters, setFilters] = React.useState<StorefrontFilters>({
    query: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest',
    inStock: false
  });
  const [analytics, setAnalytics] = React.useState<StorefrontAnalytics | null>(null);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = React.useState<InventoryAlert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('newest');
  const [showFilters, setShowFilters] = React.useState(false);
  const [cart, setCart] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState<'browse' | 'my-store' | 'inventory' | 'analytics'>('browse');
  const [showProductForm, setShowProductForm] = React.useState(false);
  const [showRestockForm, setShowRestockForm] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [userStorefront, setUserStorefront] = React.useState<Storefront | null>(null);

  // Load data on mount
  React.useEffect(() => {
    loadInitialData();
  }, []);

  // Apply filters when they change
  React.useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load storefronts
      const storefrontsResponse = await apiService.get('/api/storefronts');
      setStorefronts(storefrontsResponse.data.storefronts || []);
      
      // Load products
      const productsResponse = await apiService.get('/api/products?limit=100');
      setProducts(productsResponse.data.products || []);
      
      // Load user's storefront if authenticated
      if (user) {
        try {
          const userStorefronts = await storefrontService.getUserStorefronts(user.id);
          if (userStorefronts && userStorefronts.length > 0) {
            setUserStorefront(userStorefronts[0]);
            
            // Load inventory for user's storefront
            const inventoryResponse = await storefrontService.getInventory(userStorefronts[0].id);
            setInventory(inventoryResponse || []);
            
            // Load alerts
            const alertsResponse = await storefrontService.getLowStockAlerts(userStorefronts[0].id);
            setAlerts(alertsResponse.map((item: InventoryItem) => ({
              id: item.productId,
              productId: item.productId,
              productName: item.productName,
              currentStock: item.quantity,
              threshold: item.reorderPoint,
              status: item.quantity === 0 ? 'out' : item.quantity < item.reorderPoint ? 'low' : 'critical'
            })));
          }
        } catch (err) {
          console.info('User may not have a storefront yet');
        }
      }
      
      showToast('Welcome to Storefronts - Your Digital Marketplace', 'success');
    } catch (error) {
      console.error('Error loading Storefront data:', error);
      showToast('Failed to load storefront data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply search query
    if (filters.query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        p.description?.toLowerCase().includes(filters.query.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Apply price range
    filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    
    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => (p.stock || 0) > 0);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setSelectedCategory(category);
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sortBy: sort as any }));
    setSortBy(sort);
  };

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, { ...product, quantity: 1 }]);
    showToast(`${product.name} added to cart`, 'success');
  };

  const createProduct = async (productData: Partial<StorefrontProduct>) => {
    if (!user || !userStorefront) {
      showToast('Please create a storefront first', 'warning');
      return;
    }
    
    try {
      const product = await storefrontService.createProduct(userStorefront.id, productData);
      // Convert StorefrontProduct to Product for display
      const productForDisplay: Product = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category || 'other',
        images: product.images,
        stock: product.stock,
        rating: 0,
        reviews: [],
        currency: 'USD',
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
      setProducts(prev => [productForDisplay, ...prev]);
      setShowProductForm(false);
      showToast('Product created successfully', 'success');
    } catch (error) {
      console.error('Error creating product:', error);
      showToast('Failed to create product', 'error');
    }
  };

  const restockProduct = async (productId: string, quantity: number) => {
    if (!user || !userStorefront) {
      showToast('Please login to update inventory', 'warning');
      return;
    }
    
    try {
      await storefrontService.restockProduct(productId, quantity);
      showToast('Inventory updated successfully', 'success');
      
      // Reload inventory
      const inventoryResponse = await storefrontService.getInventory(userStorefront.id);
      setInventory(inventoryResponse || []);
    } catch (error) {
      console.error('Error updating inventory:', error);
      showToast('Failed to update inventory', 'error');
    }
  };

  // Product Form Component
  const ProductForm = () => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">Add New Product</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createProduct({
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          price: parseFloat(formData.get('price') as string),
          category: formData.get('category') as string,
          stock: parseInt(formData.get('stock') as string),
          images: []
        });
      }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input id="productName" type="text" name="name" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="productDescription" name="description" rows={3} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input id="price" type="number" name="price" step="0.01" required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input id="stock" type="number" name="stock" required className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="category" name="category" className="w-full px-3 py-2 border rounded-lg">
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="books">Books & Media</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Create Product
          </button>
          <button type="button" onClick={() => setShowProductForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  // Restock Form Component
  const RestockForm = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">Restock: {product.name}</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        restockProduct(
          product.id,
          parseInt(formData.get('quantity') as string)
        );
        setShowRestockForm(false);
        setSelectedProduct(null);
      }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
            <p className="text-2xl font-bold">{product.stock}</p>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Add Quantity</label>
            <input id="quantity" type="number" name="quantity" min="1" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="restockNotes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea id="restockNotes" name="notes" rows={2} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., New shipment from supplier" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Update Stock
          </button>
          <button type="button" onClick={() => { setShowRestockForm(false); setSelectedProduct(null); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <StorefrontIcon className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Storefronts</h1>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Marketplace</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FilterIcon className="w-6 h-6 text-gray-600" />
                </button>
                
                <div className="relative">
                  <CartIcon className="w-6 h-6 text-gray-600" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'browse', label: 'Browse', icon: StorefrontIcon },
                { id: 'my-store', label: 'My Store', icon: CubeIcon },
                { id: 'inventory', label: 'Inventory', icon: ChartBarIcon },
                { id: 'analytics', label: 'Analytics', icon: CurrencyDollarIcon }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Browse Tab */}
          {activeTab === 'browse' && (
            <div>
              {/* Filters Bar */}
              {showFilters && (
                <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="all">All Categories</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home & Garden</option>
                        <option value="sports">Sports & Outdoors</option>
                        <option value="books">Books & Media</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="newest">Newest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating_desc">Highest Rated</option>
                        <option value="popular">Most Popular</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* My Store Tab */}
          {activeTab === 'my-store' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Store Products</h2>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add New Product
                </button>
              </div>
              
              {showProductForm && <ProductForm />}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {products.filter(p => (p.stock || 0) > 0).map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Product Image</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowRestockForm(true);
                        }}
                        className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't added any products yet.</p>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Add your first product
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
              
              {/* Inventory Alerts */}
              {alerts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Stock Alerts</h3>
                  <div className="space-y-3">
                    {alerts.map(alert => (
                      <div key={alert.id} className={`p-4 rounded-lg border ${
                        alert.status === 'critical' ? 'bg-red-50 border-red-200' :
                        alert.status === 'out' ? 'bg-orange-50 border-orange-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{alert.productName}</p>
                            <p className="text-sm text-gray-600">
                              Current Stock: {alert.currentStock} / Threshold: {alert.threshold}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              const product = products.find(p => p.id === alert.productId);
                              if (product) {
                                setSelectedProduct(product);
                                setShowRestockForm(true);
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Restock Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Inventory Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.sku || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.quantity === 0 ? 'bg-red-100 text-red-800' :
                            item.quantity < item.reorderPoint ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.quantity === 0 ? 'Out of Stock' :
                             item.quantity < item.reorderPoint ? 'Low Stock' :
                             'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              const prod = products.find(p => p.id === item.productId);
                              if (prod) {
                                setSelectedProduct(prod);
                                setShowRestockForm(true);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Restock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Store Analytics</h2>
              
              {analytics ? (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Products</p>
                          <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts}</p>
                        </div>
                        <CubeIcon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                          <p className="text-3xl font-bold text-green-600">${analytics.totalRevenue.toFixed(2)}</p>
                        </div>
                        <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-3xl font-bold text-purple-600">{analytics.totalOrders}</p>
                        </div>
                        <ChartBarIcon className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Avg Rating</p>
                          <p className="text-3xl font-bold text-yellow-600">{analytics.avgRating.toFixed(1)}</p>
                        </div>
                        <StarIcon className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Top Selling Products */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                    <div className="space-y-4">
                      {analytics.topSellingProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Sold</p>
                            <p className="font-bold text-blue-600">{product.reviews?.length || 0}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">Analytics data not available. Start selling to see insights!</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Storefronts Marketplace</h3>
                <p className="text-gray-400 text-sm">
                  Your complete e-commerce solution. Manage products, track inventory, and grow your business.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Features</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Product Management</li>
                  <li>✓ Inventory Tracking</li>
                  <li>✓ Real-time Analytics</li>
                  <li>✓ Automated Alerts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Email: support@storefronts.com</li>
                  <li>Phone: 1-800-STOREFRONT</li>
                  <li>Live Chat Available</li>
                  <li>Mon-Fri: 9AM - 6PM EST</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>© 2026 Storefronts Marketplace. All rights reserved. | Privacy Policy | Terms of Service</p>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default StorefrontPage;
