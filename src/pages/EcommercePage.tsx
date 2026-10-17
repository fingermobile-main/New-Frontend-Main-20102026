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
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        
        setProducts(mockProducts);
        setOrders(mockOrders);
        setFilteredProducts(mockProducts);
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
      // In a real implementation, this would call the API to create a product
      console.log('Creating product:', newProduct);
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
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      // In a real implementation, this would call the API to delete a product
      console.log('Deleting product:', productId);
      setProducts(products.filter(product => product.id !== productId));
      setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      // In a real implementation, this would call the API to update an order
      console.log('Updating order status:', orderId, 'to', newStatus);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">E-commerce Management</h1>
            </div>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Status
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
                        No products found
                      </td>
                    </tr>
                  ) : (
                    (currentItems as Product[]).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-slate-700 line-clamp-1">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                          <span className={item.stockQuantity <= 10 ? 'text-red-600 font-bold' : 'text-gray-900'}>
                            {item.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => history.push(`/dashboard/ecommerce/products/${item.id}/view`)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-green-600 hover:text-green-900"
                              onClick={() => {
                                // Edit product
                                console.log('Edit product:', item.id);
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteProduct(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="relative">
                              <button className="text-gray-600 hover:text-gray-900">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                <button 
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => history.push(`/dashboard/ecommerce/products/${item.id}/edit`)}
                                >
                                  Edit Product
                                </button>
                                <button 
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => history.push(`/dashboard/ecommerce/products/${item.id}/analytics`)}
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
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => history.push(`/dashboard/ecommerce/orders/${order.id}/view`)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <div className="relative">
                              <button className="text-gray-600 hover:text-gray-900">
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
                    <button
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
                <button 
                  className="text-slate-700 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCreateProduct(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      min="0"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stockQuantity">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="stockQuantity"
                      min="0"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                      Category
                    </label>
                    <select
                      id="category"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newProduct.status}
                      onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sku">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommercePage;