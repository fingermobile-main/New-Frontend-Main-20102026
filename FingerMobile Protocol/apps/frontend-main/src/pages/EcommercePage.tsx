import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Box, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal,
  ShoppingBag,
  CreditCard,
  Truck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Upload,
  Lock,
  Unlock,
  EyeOff,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Flag,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommerceMediaPicker, { CommerceMediaValue } from '../components/common/CommerceMediaPicker';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  sku: string;
  status: string;
  images: string[];
  image_url?: string;
  video_url?: string;
  is_frozen?: boolean;
  is_censored?: boolean;
  is_suspended?: boolean;
  is_inquiries_paused?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: number;
  userId: number;
  userName: string;
  products: Array<{productId: number, quantity: number, price: number, name: string}>;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  billingAddress: string;
  createdAt: string;
  updatedAt: string;
}

const EcommercePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMediaValue, setCreateMediaValue] = useState<CommerceMediaValue>({
    coverUrl: '',
    galleryUrls: [],
    videoUrl: '',
    isCensored: false
  });
  const [showDirectUploadModal, setShowDirectUploadModal] = useState<boolean>(false);
  const [targetProductForMedia, setTargetProductForMedia] = useState<Product | null>(null);
  const [directMediaPickerValue, setDirectMediaPickerValue] = useState<CommerceMediaValue>({
    coverUrl: '',
    galleryUrls: [],
    videoUrl: '',
    isCensored: false
  });
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportingProduct, setReportingProduct] = useState<Product | null>(null);
  const [reportReason, setReportReason] = useState<string>('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'general',
    stockQuantity: 0,
    sku: '',
    status: 'active',
    images: ''
  });

  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call - in real implementation, this would call the backend
        const mockProducts: Product[] = [
          {
            id: 1,
            name: 'Premium T-Shirt',
            description: 'High-quality cotton t-shirt',
            price: 29.99,
            category: 'clothing',
            stockQuantity: 100,
            sku: 'TS001',
            status: 'active',
            images: ['https://example.com/image1.jpg'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-10-09T10:30:00Z'
          },
          {
            id: 2,
            name: 'Designer Cap',
            description: 'Stylish cap for all occasions',
            price: 19.99,
            category: 'accessories',
            stockQuantity: 50,
            sku: 'CAP002',
            status: 'active',
            images: ['https://example.com/image2.jpg'],
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-10-08T15:30:00Z'
          },
          {
            id: 3,
            name: 'Running Shoes',
            description: 'Comfortable shoes for running',
            price: 89.99,
            category: 'footwear',
            stockQuantity: 5,
            sku: 'SHOE003',
            status: 'low-stock',
            images: ['https://example.com/image3.jpg'],
            createdAt: '2024-03-01T00:00:00Z',
            updatedAt: '2024-10-07T12:15:00Z'
          }
        ];
        
        const mockOrders: Order[] = [
          {
            id: 1,
            userId: 1,
            userName: 'John Doe',
            products: [
              { productId: 1, quantity: 2, price: 29.99, name: 'Premium T-Shirt' },
              { productId: 2, quantity: 1, price: 19.99, name: 'Designer Cap' }
            ],
            totalAmount: 79.97,
            status: 'processing',
            shippingAddress: '123 Main St, City, Country',
            billingAddress: '123 Main St, City, Country',
            createdAt: '2024-10-09T08:30:00Z',
            updatedAt: '2024-10-09T10:30:00Z'
          },
          {
            id: 2,
            userId: 2,
            userName: 'Jane Smith',
            products: [
              { productId: 3, quantity: 1, price: 89.99, name: 'Running Shoes' }
            ],
            totalAmount: 89.99,
            status: 'pending',
            shippingAddress: '456 Oak Ave, City, Country',
            billingAddress: '456 Oak Ave, City, Country',
            createdAt: '2024-10-08T14:20:00Z',
            updatedAt: '2024-10-08T14:20:00Z'
          },
          {
            id: 3,
            userId: 3,
            userName: 'Bob Johnson',
            products: [
              { productId: 1, quantity: 1, price: 29.99, name: 'Premium T-Shirt' },
              { productId: 3, quantity: 1, price: 89.99, name: 'Running Shoes' }
            ],
            totalAmount: 119.98,
            status: 'fulfilled',
            shippingAddress: '789 Pine Rd, City, Country',
            billingAddress: '789 Pine Rd, City, Country',
            createdAt: '2024-10-07T09:15:00Z',
            updatedAt: '2024-10-07T16:45:00Z'
          }
        ];
        
        let initialProducts = mockProducts;
        try {
          const apiRes = await fetch('/api/marketplace/products');
          if (apiRes.ok) {
            const data = await apiRes.json();
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
              initialProducts = data.data.map((item: any) => ({
                id: item.id,
                name: item.name || 'Unnamed Product',
                description: item.description || '',
                price: parseFloat(item.price) || 0,
                category: item.category || 'general',
                stockQuantity: item.stock_quantity || item.stockQuantity || 10,
                sku: item.sku || `SKU-${item.id}`,
                status: item.status || 'active',
                images: item.images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
                createdAt: item.created_at || new Date().toISOString(),
                updatedAt: item.updated_at || new Date().toISOString()
              }));
            }
          }
        } catch (apiErr) {
          console.warn('Marketplace products API fallback to seed:', apiErr);
        }

        setProducts(initialProducts);
        setOrders(mockOrders);
        setFilteredProducts(initialProducts);
        setFilteredOrders(mockOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'products') {
      let result = products;

      if (searchTerm) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      if (filterCategory !== 'all') {
        result = result.filter(item => item.category === filterCategory);
      }

      setFilteredProducts(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'orders') {
      let result = orders;

      if (searchTerm) {
        result = result.filter(item => 
          item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toString().includes(searchTerm.toLowerCase()) ||
          item.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      setFilteredOrders(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterStatus, filterCategory, activeTab, products, orders]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  let currentItems: any[] = [];
  let totalPages = 0;
  
  if (activeTab === 'products') {
    currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  } else if (activeTab === 'orders') {
    currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  }

  const handleCreateProduct = async () => {
    try {
      const allImages = [
        ...(createMediaValue.coverUrl ? [createMediaValue.coverUrl] : []),
        ...createMediaValue.galleryUrls
      ].filter(Boolean);

      const createdItem: Product = {
        id: Date.now(),
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price) || 0,
        category: newProduct.category,
        stockQuantity: Number(newProduct.stockQuantity) || 0,
        sku: newProduct.sku || `SKU-${Date.now().toString().slice(-4)}`,
        status: newProduct.status,
        images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&fit=crop'],
        image_url: createMediaValue.coverUrl || allImages[0],
        video_url: createMediaValue.videoUrl || undefined,
        is_censored: createMediaValue.isCensored,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProducts(prev => [createdItem, ...prev]);
      setFilteredProducts(prev => [createdItem, ...prev]);
      setShowCreateModal(false);
      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: 'general',
        stockQuantity: 0,
        sku: '',
        status: 'active',
        images: ''
      });
      setCreateMediaValue({
        coverUrl: '',
        galleryUrls: [],
        videoUrl: '',
        isCensored: false
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // Granular Reorder (Move Up / Down)
  const handleReorderProduct = (productId: number, direction: 'up' | 'down') => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === productId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(idx, 1);
      updated.splice(targetIdx, 0, moved);
      return updated;
    });
  };

  // Granular Compliance: Toggle Freeze
  const handleToggleFreeze = (productId: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_frozen: !p.is_frozen } : p));
  };

  // Granular Compliance: Toggle Censor (18+ Sensitive Blur Mask)
  const handleToggleCensor = (productId: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_censored: !p.is_censored } : p));
  };

  // Granular Compliance: Toggle Suspend
  const handleToggleSuspend = (productId: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? {
      ...p,
      is_suspended: !p.is_suspended,
      status: !p.is_suspended ? 'suspended' : 'active'
    } : p));
  };

  // Granular Compliance: Toggle Pause Inquiries / Comments
  const handleTogglePauseInquiries = (productId: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_inquiries_paused: !p.is_inquiries_paused } : p));
  };

  // Direct Media Upload modal openers & persistence
  const handleOpenDirectMedia = (prod?: Product) => {
    if (prod) {
      setTargetProductForMedia(prod);
      setDirectMediaPickerValue({
        coverUrl: prod.image_url || (prod.images && prod.images[0]) || '',
        galleryUrls: prod.images || [],
        videoUrl: prod.video_url || '',
        isCensored: Boolean(prod.is_censored)
      });
    } else {
      setTargetProductForMedia(null);
      setDirectMediaPickerValue({
        coverUrl: '',
        galleryUrls: [],
        videoUrl: '',
        isCensored: false
      });
    }
    setShowDirectUploadModal(true);
  };

  const handleSaveDirectMedia = () => {
    if (!targetProductForMedia) {
      setCreateMediaValue(directMediaPickerValue);
      setShowDirectUploadModal(false);
      setShowCreateModal(true);
      return;
    }
    const allImages = [
      ...(directMediaPickerValue.coverUrl ? [directMediaPickerValue.coverUrl] : []),
      ...directMediaPickerValue.galleryUrls
    ].filter(Boolean);

    setProducts(prev => prev.map(p => p.id === targetProductForMedia.id ? {
      ...p,
      image_url: directMediaPickerValue.coverUrl || p.image_url,
      images: allImages.length > 0 ? allImages : p.images,
      video_url: directMediaPickerValue.videoUrl || p.video_url,
      is_censored: directMediaPickerValue.isCensored
    } : p));
    setShowDirectUploadModal(false);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    setReportReason('');
    setReportingProduct(null);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      setProducts(products.filter(product => product.id !== productId));
      setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      setOrders(orders.map(order => 
        order.id === orderId ? {...order, status: newStatus} : order
      ));
      setFilteredOrders(filteredOrders.map(order => 
        order.id === orderId ? {...order, status: newStatus} : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'low-stock': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'out-of-stock': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'pending': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'processing': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'fulfilled': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'cancelled': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clothing': return 'bg-pink-100 text-pink-800';
      case 'accessories': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'footwear': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 ml-3 tracking-tight">E-commerce Management</h1>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleOpenDirectMedia()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm cursor-pointer transition"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Direct Media Upload
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm cursor-pointer transition"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-slate-300 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Truck className="h-4 w-4 mr-2" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`${
                activeTab === 'inventory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Box className="h-4 w-4 mr-2" />
              Inventory
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-700" />
              </div>
              <input
                type="text"
                placeholder={`${activeTab === 'products' ? 'Search products...' : activeTab === 'orders' ? 'Search orders...' : 'Search inventory...'}`}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder:text-slate-400 focus:outline-none focus:placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 focus:ring-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            {activeTab === 'products' && (
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="footwear">Footwear</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home</option>
                <option value="beauty">Beauty</option>
              </select>
            )}
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {activeTab === 'products' ? `${filteredProducts.length} products` : 
                 activeTab === 'orders' ? `${filteredOrders.length} orders` : 
                 'Inventory items'}
              </span>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Media
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Compliance & RBAC Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-slate-800">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    (currentItems as Product[]).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-300 shrink-0">
                            <img
                              src={item.image_url || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&fit=crop'}
                              alt={item.name}
                              className={`w-full h-full object-cover ${item.is_censored ? 'blur-xs' : ''}`}
                            />
                            {item.is_censored && (
                              <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-[8px] font-black text-rose-300">
                                18+
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-slate-700 line-clamp-1">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                          <span className={item.stockQuantity <= 10 ? 'text-red-600 font-bold' : 'text-gray-900 font-bold'}>
                            {item.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-mono font-bold">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.is_suspended ? 'SUSPENDED' : item.is_frozen ? 'FROZEN' : item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-black border border-[#880808]">
                            {/* Move Up / Down */}
                            <button
                              type="button"
                              onClick={() => handleReorderProduct(item.id, 'up')}
                              className="p-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReorderProduct(item.id, 'down')}
                              className="p-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            {/* Freeze */}
                            <button
                              type="button"
                              onClick={() => handleToggleFreeze(item.id)}
                              className={`p-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                                item.is_frozen
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                              }`}
                              title={item.is_frozen ? 'Unfreeze' : 'Freeze'}
                            >
                              {item.is_frozen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            </button>
                            {/* Censor */}
                            <button
                              type="button"
                              onClick={() => handleToggleCensor(item.id)}
                              className={`p-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                                item.is_censored
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                              }`}
                              title={item.is_censored ? 'Uncensor' : 'Censor (18+)'}
                            >
                              {item.is_censored ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                            {/* Suspend */}
                            <button
                              type="button"
                              onClick={() => handleToggleSuspend(item.id)}
                              className={`p-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                                item.is_suspended
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                              }`}
                              title={item.is_suspended ? 'Restore' : 'Suspend'}
                            >
                              {item.is_suspended ? <PlayCircle className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
                            </button>
                            {/* Pause Inquiries */}
                            <button
                              type="button"
                              onClick={() => handleTogglePauseInquiries(item.id)}
                              className={`p-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                                item.is_inquiries_paused
                                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                              }`}
                              title={item.is_inquiries_paused ? 'Resume comments' : 'Pause comments'}
                            >
                              {item.is_inquiries_paused ? <PlayCircle className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
                            </button>
                            {/* Direct Media Upload */}
                            <button
                              type="button"
                              onClick={() => handleOpenDirectMedia(item)}
                              className="p-1 rounded text-[10px] font-bold bg-blue-900/40 text-blue-300 border border-blue-600/40 hover:bg-blue-800/60 cursor-pointer"
                              title="Direct Media Upload (Cover, Gallery, Video)"
                            >
                              <Upload className="w-3 h-3" />
                            </button>
                            {/* Report */}
                            <button
                              type="button"
                              onClick={() => {
                                setReportingProduct(item);
                                setShowReportModal(true);
                              }}
                              className="p-1 rounded text-[10px] font-bold bg-slate-900 text-amber-400 border border-amber-600/40 hover:bg-amber-900/40 cursor-pointer"
                              title="Report item"
                            >
                              <Flag className="w-3 h-3" />
                            </button>
                            {/* Super Admin Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(item.id)}
                              className="p-1 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60 hover:bg-rose-900 cursor-pointer"
                              title="Permanent Purge"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-slate-800">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    (currentItems as Order[]).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          <div className="text-sm text-slate-700">
                            {order.products.map(p => p.name).slice(0, 2).join(', ')}
                            {order.products.length > 2 && ` +${order.products.length - 2} more`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                          {order.products.reduce((sum, p) => sum + p.quantity, 0)} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              type="button"
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => history.push(`/dashboard/ecommerce/orders/${order.id}/view`)}
                              aria-label={`View order ${order.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <div className="relative">
                              <button
                                type="button"
                                className="text-gray-600 hover:text-gray-900"
                                aria-label={`More options for order ${order.id}`}
                                onClick={(e) => { e.stopPropagation(); }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                <button 
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                >
                                  Process Order
                                </button>
                                <button 
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'fulfilled')}
                                >
                                  Mark as Fulfilled
                                </button>
                                <button 
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                >
                                  Cancel Order
                                </button>
                                <button 
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => history.push(`/dashboard/ecommerce/orders/${order.id}/analytics`)}
                                >
                                  View Analytics
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Box className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {products.filter(p => p.stockQuantity <= 10).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ShoppingBag className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${(products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4 className="text-md font-medium text-gray-900 mb-4">Low Stock Items</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                        SKU
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                        Reorder Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products
                      .filter(p => p.stockQuantity <= 10)
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                            <span className="text-red-600 font-bold">{product.stockQuantity}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                            10
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {(activeTab === 'products' || activeTab === 'orders') && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-300 sm:px-6 mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-slate-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-slate-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, (activeTab === 'products' ? filteredProducts : filteredOrders).length)}</span> of{' '}
                  <span className="font-medium">{(activeTab === 'products' ? filteredProducts : filteredOrders).length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-slate-700' : 'text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button type="button" aria-label="Navigate page"
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-slate-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-slate-700' : 'text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto p-6 border border-slate-300 max-w-2xl w-full shadow-2xl rounded-2xl bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Add New Product (PostgreSQL)
              </h3>
              <button
                type="button"
                aria-label="Close"
                className="text-slate-500 hover:text-slate-900 font-bold p-1 cursor-pointer"
                onClick={() => setShowCreateModal(false)}
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateProduct(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-900 text-xs font-black uppercase tracking-wider mb-1" htmlFor="name">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="shadow-xs appearance-none border rounded-xl w-full py-2.5 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300 bg-white placeholder:text-slate-400 text-sm"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g. Vintage Leather Jacket"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-slate-900 text-xs font-black uppercase tracking-wider mb-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="shadow-xs appearance-none border rounded-xl w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300 bg-white placeholder:text-slate-400 text-sm"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Product specification, dimensions, fabric, and details..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-900 text-xs font-black uppercase tracking-wider mb-1" htmlFor="price">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      min="0"
                      className="shadow-xs appearance-none border rounded-xl w-full py-2.5 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono text-sm"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-900 text-xs font-black uppercase tracking-wider mb-1" htmlFor="stockQuantity">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="stockQuantity"
                      min="0"
                      className="shadow-xs appearance-none border rounded-xl w-full py-2.5 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono text-sm"
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-900 text-xs font-black uppercase tracking-wider mb-1" htmlFor="category">
                      Category
                    </label>
                    <select
                      id="category"
                      className="shadow-xs appearance-none border rounded-xl w-full py-2.5 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300 bg-white text-sm"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="clothing">Clothing</option>
                      <option value="accessories">Accessories</option>
                      <option value="footwear">Footwear</option>
                      <option value="electronics">Electronics</option>
                      <option value="home">Home</option>
                      <option value="beauty">Beauty</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-slate-900 text-xs font-black uppercase tracking-wider mb-1" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      className="shadow-xs appearance-none border rounded-xl w-full py-2.5 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300 bg-white text-sm"
                      value={newProduct.status}
                      onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-900 text-xs font-black uppercase tracking-wider mb-1" htmlFor="sku">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    className="shadow-xs appearance-none border rounded-xl w-full py-2.5 px-3 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300 bg-white placeholder:text-slate-400 text-sm font-mono"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    placeholder="e.g. SKU-1002"
                    required
                  />
                </div>

                {/* Media Portfolio: Cover Photo, Gallery, Video */}
                <CommerceMediaPicker
                  value={createMediaValue}
                  onChange={setCreateMediaValue}
                  title="Product Media Portfolio"
                  description="Upload primary cover photo, high-res gallery images, and promotional video clips directly to Express backend storage."
                  allowGallery={true}
                  allowVideo={true}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition cursor-pointer shadow-xs"
                >
                  Add Product to PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Media Upload Standalone Modal */}
      {showDirectUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-700" />
                {targetProductForMedia ? `Update Media: ${targetProductForMedia.name}` : 'Direct Media Upload (Cover, Gallery, Video)'}
              </h3>
              <button
                type="button"
                onClick={() => setShowDirectUploadModal(false)}
                className="text-slate-500 hover:text-slate-900 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <CommerceMediaPicker
              value={directMediaPickerValue}
              onChange={setDirectMediaPickerValue}
              title="Product Visual Media Asset"
              description="Ingest files via multipart/form-data directly to Express backend storage and PostgreSQL ugc_media."
              allowGallery={true}
              allowVideo={true}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
              <button
                type="button"
                onClick={() => setShowDirectUploadModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDirectMedia}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                {targetProductForMedia ? 'Save Media to Product' : 'Proceed to Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && reportingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Flag className="w-5 h-5 text-amber-700" />
                Report Product
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportingProduct(null);
                }}
                className="text-slate-500 hover:text-slate-900 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              Filing formal compliance complaint for <strong className="text-slate-900">&ldquo;{reportingProduct.name}&rdquo;</strong>.
              Recorded directly in PostgreSQL management audit log.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Violation / Report Reason</label>
                <textarea
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for report (e.g. counterfeit, misleading details, prohibited item)..."
                  className="w-full p-2.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportingProduct(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* SOVEREIGN MOBILE NAVIGATION QUICK DOCK */}
      <nav
        aria-label="Ecommerce Quick Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 sm:hidden flex items-center justify-around shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
            activeTab === 'products' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Products</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('orders');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
            activeTab === 'orders' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Orders</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('inventory');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
            activeTab === 'inventory' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Box className="w-5 h-5 mb-0.5" />
          <span>Inventory</span>
        </button>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <Plus className="w-5 h-5 mb-0.5" />
          <span>Add</span>
        </button>
      </nav>

    </div>
  );
};

export default EcommercePage;
