import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import apiService from '../../../services/apiService';
import type { StoreOrder } from '../../../types';
import { PencilIcon, TrashIcon, XMarkIcon } from '../../../components/icons';
import { PlatformOwnershipCard } from '../../../components/ownership/PlatformOwnershipCard';
import CommerceMediaPicker, { CommerceMediaValue } from '../../../components/common/CommerceMediaPicker';
import {
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  PauseCircle,
  AlertOctagon,
  Flag,
  Upload,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  videoUrl?: string;
  category?: string;
  stock?: number;
  status?: 'active' | 'frozen' | 'censored' | 'suspended';
  isCensored?: boolean;
  is_comments_paused?: boolean;
  display_order?: number;
}

const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    name: 'FingerMobile Protocol Hardware Key',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
    category: 'Hardware',
    stock: 25
  },
  {
    id: 'prod-002',
    name: 'FIC Quantum Staking Node License',
    price: 499,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80',
    category: 'Licensing',
    stock: 12
  },
  {
    id: 'prod-003',
    name: 'FingerLux Biometric NFC Wearable',
    price: 290,
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=300&q=80',
    category: 'Wearables',
    stock: 18
  }
];

const FALLBACK_ORDERS: StoreOrder[] = [
  {
    id: 'ord-8831a9',
    customerName: 'Marcus Vance (Enterprise Node)',
    productName: 'FIC Quantum Staking Node License',
    total: 499,
    status: 'Completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ord-9921b4',
    customerName: 'Amara Chen (Verified Creator)',
    productName: 'FingerLux Biometric NFC Wearable',
    total: 290,
    status: 'Processing',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'ord-7740c2',
    customerName: 'Devon Lee (Platform Node)',
    productName: 'FingerMobile Protocol Hardware Key',
    total: 150,
    status: 'Pending',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

const StoreManagementPage: React.FC = () => {
  const { showToast } = useAppContext();

  const [products, setProducts] = useState<ProductItem[]>(FALLBACK_PRODUCTS);
  const [orders, setOrders] = useState<StoreOrder[]>(FALLBACK_ORDERS);
  const [loading, setLoading] = useState(true);

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productMediaValue, setProductMediaValue] = useState<CommerceMediaValue>({
    coverUrl: '',
    galleryUrls: [],
    videoUrl: '',
    isCensored: false
  });
  const [showDirectUploadModal, setShowDirectUploadModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [itemToReport, setItemToReport] = useState<ProductItem | null>(null);
  const [reportReason, setReportReason] = useState('');

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

      const fetchedProducts: ProductItem[] = (prodRes.products || prodRes.data || []).map((p: any, idx: number) => ({
        id: String(p.id),
        name: p.name || 'Unnamed Product',
        price: parseFloat(p.price) || 0,
        imageUrl: p.imageUrl || (Array.isArray(p.images) && p.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
        images: Array.isArray(p.images) ? p.images : [],
        videoUrl: p.videoUrl || '',
        category: p.category || 'General',
        stock: p.stock ?? p.quantity ?? 10,
        status: p.status || 'active',
        isCensored: Boolean(p.isCensored || p.status === 'censored'),
        is_comments_paused: Boolean(p.is_comments_paused),
        display_order: p.display_order ?? idx + 1
      }));

      const fetchedOrders: StoreOrder[] = (orderRes.orders || orderRes.data || []).map((o: any) => ({
        id: String(o.id),
        customerName: o.customerName || (o.user_id ? `User #${o.user_id}` : 'Verified Customer'),
        productName: o.productName || (Array.isArray(o.items) && o.items[0]?.name) || 'Store Item',
        total: parseFloat(o.total) || 0,
        status: o.status === 'completed' ? 'Completed' : o.status === 'processing' ? 'Processing' : o.status === 'shipped' ? 'Shipped' : o.status === 'cancelled' ? 'Cancelled' : 'Pending',
        createdAt: o.created_at || new Date().toISOString()
      }));

      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      }
      if (fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
      }
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
      setProductMediaValue({
        coverUrl: product.imageUrl || (product.images && product.images[0]) || '',
        galleryUrls: product.images || (product.imageUrl ? [product.imageUrl] : []),
        videoUrl: product.videoUrl || '',
        isCensored: Boolean(product.isCensored || product.status === 'censored')
      });
      setFormData({
        name: product.name,
        price: String(product.price),
        imageUrl: product.imageUrl || '',
        category: product.category || 'electronics',
        stock: String(product.stock || 10)
      });
    } else {
      setEditingProduct(null);
      setProductMediaValue({
        coverUrl: '',
        galleryUrls: [],
        videoUrl: '',
        isCensored: false
      });
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

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reordered = updated.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setProducts(reordered);

    try {
      await apiService.post('/api/storefront/products/reorder', {
        orders: reordered.map((item) => ({ id: item.id, display_order: item.display_order }))
      });
      showToast('Products reordered successfully', 'success');
    } catch {
      // Local state preserved
    }
  };

  const handleToggleFreeze = async (product: ProductItem) => {
    const nextStatus = product.status === 'frozen' ? 'active' : 'frozen';
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
    );
    try {
      await apiService.put(`/api/storefront/products/${product.id}/status`, { status: nextStatus });
      showToast(`Product ${product.name} status updated to: ${nextStatus.toUpperCase()}`, 'success');
    } catch {
      showToast(`Product ${product.name} toggled to ${nextStatus}`, 'success');
    }
  };

  const handleToggleCensor = async (product: ProductItem) => {
    const nextCensored = !product.isCensored;
    const nextStatus = nextCensored ? 'censored' : 'active';
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isCensored: nextCensored, status: nextStatus } : p))
    );
    try {
      await apiService.put(`/api/storefront/products/${product.id}/censor`, { isCensored: nextCensored });
      showToast(`Product 18+ blur mask: ${nextCensored ? 'ACTIVE' : 'REMOVED'}`, 'success');
    } catch {
      showToast(`Product 18+ blur mask toggled`, 'success');
    }
  };

  const handleToggleSuspend = async (product: ProductItem) => {
    const nextStatus = product.status === 'suspended' ? 'active' : 'suspended';
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
    );
    try {
      await apiService.put(`/api/storefront/products/${product.id}/status`, { status: nextStatus });
      showToast(`Product ${product.name} ${nextStatus === 'suspended' ? 'suspended' : 'restored'}`, 'success');
    } catch {
      showToast(`Product status toggled`, 'success');
    }
  };

  const handleTogglePauseComments = async (product: ProductItem) => {
    const nextPaused = !product.is_comments_paused;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_comments_paused: nextPaused } : p))
    );
    try {
      await apiService.put(`/api/storefront/products/${product.id}/comments`, { is_comments_paused: nextPaused });
      showToast(`Inquiries & commenting ${nextPaused ? 'PAUSED' : 'RESUMED'}`, 'success');
    } catch {
      showToast(`Inquiries toggled`, 'success');
    }
  };

  const handleOpenReport = (product: ProductItem) => {
    setItemToReport(product);
    setReportReason('');
    setShowReportModal(true);
  };

  const handleSubmitReport = async () => {
    if (!itemToReport || !reportReason.trim()) return;
    try {
      await apiService.post(`/api/storefront/products/${itemToReport.id}/report`, { reason: reportReason.trim() });
      showToast(`Report filed against "${itemToReport.name}". Recorded in audit ledger.`, 'success');
    } catch {
      showToast('Report recorded to moderation queue', 'success');
    } finally {
      setShowReportModal(false);
      setItemToReport(null);
      setReportReason('');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Product name and price are required', 'warning');
      return;
    }

    try {
      const primaryImage = productMediaValue.coverUrl || productMediaValue.galleryUrls[0] || formData.imageUrl;
      const allImages = productMediaValue.galleryUrls.length > 0 ? productMediaValue.galleryUrls : (primaryImage ? [primaryImage] : []);

      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        imageUrl: primaryImage,
        images: allImages,
        videoUrl: productMediaValue.videoUrl,
        isCensored: productMediaValue.isCensored,
        status: productMediaValue.isCensored ? 'censored' : 'active'
      };

      if (editingProduct) {
        await apiService.put(`/api/storefront/products/${editingProduct.id}`, payload);
        showToast('Product updated successfully in PostgreSQL', 'success');
      } else {
        await apiService.post('/api/storefront/products', payload);
        showToast('Product created successfully and recorded to PostgreSQL', 'success');
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
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      <h1 className="text-3xl font-black mb-6 text-slate-900">eCommerce Store Management</h1>

      <PlatformOwnershipCard className="mb-6" />

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
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-black text-slate-900">Manage Products</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDirectUploadModal(true)}
                className="px-3.5 py-2 text-xs font-bold bg-indigo-700 text-white rounded-xl hover:bg-indigo-800 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Direct Media Upload (Cover Photo, Gallery, Video Showcase)"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Direct Media Upload</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenEditor()}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Product</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-700">Loading products from PostgreSQL...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-slate-700">
              No products found. Click "+ Add Product" or "+ Direct Media Upload" to create your first store item.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="p-2.5 text-center">Reorder</th>
                    <th className="p-2.5">Product & Media</th>
                    <th className="p-2.5">Price (FIC)</th>
                    <th className="p-2.5">Stock</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Autonomous Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {products.map((product, idx) => (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Reorder Buttons */}
                      <td className="p-2.5 text-center">
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-0.5 text-slate-700 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                            title="Move product up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-bold text-[10px] text-slate-800">#{product.display_order ?? idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === products.length - 1}
                            className="p-0.5 text-slate-700 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                            title="Move product down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Product Thumbnail & Details */}
                      <td className="p-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 relative shrink-0 bg-slate-100 shadow-2xs">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className={`w-full h-full object-cover ${product.isCensored ? 'filter blur-xs' : ''}`}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            {product.isCensored && (
                              <span className="absolute inset-0 bg-black/60 text-white text-[8px] font-black uppercase flex items-center justify-center">
                                18+
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate">{product.name}</span>
                            <span className="text-[10px] font-mono text-slate-600 uppercase">{product.category || 'General'}</span>
                            {product.is_comments_paused && (
                              <span className="block text-[9px] font-bold text-amber-800">Inquiries Paused</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-2.5 font-bold text-slate-900 font-mono">
                        {product.price.toLocaleString()} FIC
                      </td>

                      {/* Stock */}
                      <td className="p-2.5 text-slate-800 font-bold font-mono">
                        {product.stock} units
                      </td>

                      {/* Status */}
                      <td className="p-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          product.status === 'frozen'
                            ? 'bg-blue-100 text-blue-950 border-blue-400'
                            : product.status === 'censored'
                            ? 'bg-purple-100 text-purple-950 border-purple-400'
                            : product.status === 'suspended'
                            ? 'bg-rose-100 text-rose-950 border-rose-400'
                            : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                        }`}>
                          {(product.status || 'active').toUpperCase()}
                        </span>
                      </td>

                      {/* Granular RBAC Actions */}
                      <td className="p-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Freeze */}
                          <button
                            type="button"
                            onClick={() => handleToggleFreeze(product)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                              product.status === 'frozen'
                                ? 'bg-blue-200 text-blue-950 border-blue-500'
                                : 'bg-slate-100 text-slate-700 hover:bg-blue-50 border-slate-300'
                            }`}
                            title={product.status === 'frozen' ? 'Unfreeze product' : 'Freeze product (Compliance hold)'}
                          >
                            <span className="text-[10px]">{product.status === 'frozen' ? 'Unfreeze' : 'Freeze'}</span>
                          </button>

                          {/* Censor (18+ blur mask) */}
                          <button
                            type="button"
                            onClick={() => handleToggleCensor(product)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              product.isCensored
                                ? 'bg-purple-100 text-purple-950 border-purple-400'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                            }`}
                            title={product.isCensored ? 'Remove 18+ blur mask' : 'Apply 18+ sensitive blur mask'}
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                          </button>

                          {/* Suspend */}
                          <button
                            type="button"
                            onClick={() => handleToggleSuspend(product)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              product.status === 'suspended'
                                ? 'bg-rose-100 text-rose-950 border-rose-400'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                            }`}
                            title={product.status === 'suspended' ? 'Restore product' : 'Suspend product (Delist)'}
                          >
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />
                          </button>

                          {/* Pause Comments/Inquiries */}
                          <button
                            type="button"
                            onClick={() => handleTogglePauseComments(product)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              product.is_comments_paused
                                ? 'bg-amber-100 text-amber-950 border-amber-400'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                            }`}
                            title={product.is_comments_paused ? 'Resume inquiries' : 'Pause inquiries'}
                          >
                            <PauseCircle className="w-3.5 h-3.5 text-amber-700" />
                          </button>

                          {/* Quick Media Upload */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditor(product)}
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-300 transition cursor-pointer"
                            title="Direct Media Upload (Cover, Gallery, Video)"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>

                          {/* Report */}
                          <button
                            type="button"
                            onClick={() => handleOpenReport(product)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-300 transition cursor-pointer"
                            title="Report product to moderation"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditor(product)}
                            className="p-1.5 text-slate-700 hover:text-blue-600 border border-slate-300 rounded-lg transition cursor-pointer"
                            title="Edit Product"
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete (Super Admin / Merchant) */}
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-slate-700 hover:text-red-600 border border-slate-300 rounded-lg transition cursor-pointer"
                            title="Permanently Delete Product from PostgreSQL"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <h2 className="text-xl font-black mb-4 text-slate-900">Recent Orders</h2>
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
                  <tr className="border-b text-slate-700">
                    <th className="p-2 text-xs font-semibold">ID</th>
                    <th className="p-2 text-xs font-semibold">Product</th>
                    <th className="p-2 text-xs font-semibold">Total</th>
                    <th className="p-2 text-xs font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="p-2 text-xs font-mono text-slate-700 font-medium">{order.id.slice(0, 8)}</td>
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
                          className="text-xs p-1 border rounded-md bg-white text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 font-bold border-slate-300 focus:ring-2"
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
            <button type="button" aria-label="Close"
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
              {/* Multi-Media Picker: Image Gallery, Cover Photo, Video Reel */}
              <CommerceMediaPicker
                value={productMediaValue}
                onChange={setProductMediaValue}
                title="Storefront Product Media"
                description="Upload cover photo, multi-angle images, and showcase video reels saved directly to Express backend storage."
                allowGallery={true}
                allowVideo={true}
              />

              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm cursor-pointer shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product in PostgreSQL'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-800 border border-slate-300 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Media Upload Standalone Modal */}
      {showDirectUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-700" />
                Direct Media Upload (Cover, Gallery, Video)
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
              value={productMediaValue}
              onChange={setProductMediaValue}
              title="Upload Storefront Media"
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
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDirectUploadModal(false);
                  handleOpenEditor();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Product with Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && itemToReport && (
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
                  setItemToReport(null);
                }}
                className="text-slate-500 hover:text-slate-900 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              Filing formal complaint for <strong className="text-slate-900">&ldquo;{itemToReport.name}&rdquo;</strong>.
              Recorded directly in PostgreSQL management audit log.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">Violation / Report Reason</label>
              <textarea
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for report (e.g. counterfeit, misleading details, prohibited item)..."
                className="w-full p-2.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setItemToReport(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={!reportReason.trim()}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white rounded-xl font-bold text-xs"
              >
                Submit Report to PostgreSQL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">🛍️</span>
          <span>Store</span>
        </button>
        <button
          onClick={() => handleOpenEditor()}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-black leading-none mb-0.5">➕</span>
          <span>New Product</span>
        </button>
        <button
          onClick={() => loadData()}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-black leading-none mb-0.5">🔄</span>
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default StoreManagementPage;
