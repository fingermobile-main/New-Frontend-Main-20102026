import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import apiService from '../../../services/apiService';
import type { StoreOrder } from '../../../types';
import { PencilIcon, TrashIcon, XMarkIcon } from '../../../components/icons';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

const StoreManagementPage: React.FC = () => {
  const { showToast } = useAppContext();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    category: 'electronics',
    stock: '10'
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes] = await Promise.all([
        apiService.get('/api/storefront/products').catch(() => ({ products: [] })),
        apiService.get('/api/storefront/orders').catch(() => ({ orders: [] }))
      ]);

      const fetchedProducts: ProductItem[] = (prodRes.products || prodRes.data || []).map((p: any) => ({
        id: String(p.id),
        name: p.name || 'Unnamed Product',
        price: parseFloat(p.price) || 0,
        imageUrl: p.imageUrl || (Array.isArray(p.images) && p.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
        category: p.category || 'General',
        stock: p.stock ?? p.quantity ?? 10
      }));

      const fetchedOrders: StoreOrder[] = (orderRes.orders || orderRes.data || []).map((o: any) => ({
        id: String(o.id),
        customerName: o.customerName || (o.user_id ? `User #${o.user_id}` : 'Verified Customer'),
        productName: o.productName || (Array.isArray(o.items) && o.items[0]?.name) || 'Store Item',
        total: parseFloat(o.total) || 0,
        status: o.status === 'completed' ? 'Completed' : o.status === 'processing' ? 'Processing' : o.status === 'shipped' ? 'Shipped' : o.status === 'cancelled' ? 'Cancelled' : 'Pending',
        createdAt: o.created_at || new Date().toISOString()
      }));

      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
    } catch {
      showToast('Failed to load store management records', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenEditor = (product?: ProductItem) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: String(product.price),
        imageUrl: product.imageUrl || '',
        category: product.category || 'electronics',
        stock: String(product.stock || 10)
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        imageUrl: '',
        category: 'electronics',
        stock: '10'
      });
    }
    setIsEditorOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Product name and price are required', 'warning');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        images: formData.imageUrl ? [formData.imageUrl] : []
      };

      if (editingProduct) {
        await apiService.put(`/api/storefront/products/${editingProduct.id}`, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await apiService.post('/api/storefront/products', payload);
        showToast('Product created successfully', 'success');
      }
      setIsEditorOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiService.delete(`/api/storefront/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product deleted successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: StoreOrder['status']) => {
    try {
      await apiService.put(`/api/storefront/orders/${orderId}/status`, {
        status: newStatus.toLowerCase()
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const totalRevenue = orders.reduce(
    (acc, order) => (order.status === 'Completed' ? acc + order.total : acc),
    0
  );
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
  }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">eCommerce Store Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString()} FIC`}
          icon="💰"
        />
        <StatCard title="Total Orders" value={orders.length} icon="📦" />
        <StatCard title="Pending Orders" value={pendingOrders} icon="⏳" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Manage Products</h2>
            <button
              onClick={() => handleOpenEditor()}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              + Add Product
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-700">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-slate-700">
              No products found. Click "+ Add Product" to create your first store item.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="p-2 text-sm font-semibold">Product</th>
                    <th className="p-2 text-sm font-semibold">Price (FIC)</th>
                    <th className="p-2 text-sm font-semibold">Stock</th>
                    <th className="p-2 text-sm font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50/50">
                      <td className="p-2 flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover border border-slate-200"
                        />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </td>
                      <td className="p-2 font-semibold text-gray-800">{product.price.toLocaleString()}</td>
                      <td className="p-2 text-gray-600 text-sm">{product.stock}</td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => handleOpenEditor(product)}
                          className="p-2 text-gray-500 hover:text-blue-600 transition"
                          title="Edit Product"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-500 hover:text-red-600 transition"
                          title="Delete Product"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Orders</h2>
          <div className="overflow-x-auto max-h-96">
            {loading ? (
              <div className="py-12 text-center text-slate-700">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-slate-700 text-sm">
                No orders recorded yet.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="p-2 text-xs font-semibold">ID</th>
                    <th className="p-2 text-xs font-semibold">Product</th>
                    <th className="p-2 text-xs font-semibold">Total</th>
                    <th className="p-2 text-xs font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="p-2 text-xs font-mono text-gray-600">{order.id.slice(0, 8)}</td>
                      <td className="p-2 text-xs text-gray-800 font-medium">{order.productName}</td>
                      <td className="p-2 text-xs font-semibold text-gray-900">
                        {order.total.toLocaleString()} FIC
                      </td>
                      <td className="p-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as StoreOrder['status']
                            )
                          }
                          className="text-xs p-1 border rounded-md bg-white text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 font-bold border-slate-300"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Product Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-4 right-4 text-slate-700 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  placeholder="e.g., Wireless Earbuds"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (FIC)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
                    placeholder="25.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 font-bold border-slate-300 bg-white"
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Living</option>
                  <option value="collectibles">Collectibles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  placeholder="https://..."
                />
              </div>
              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagementPage;
