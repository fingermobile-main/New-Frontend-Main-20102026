/*
 * FingerMobile Protocol™ - Member Storefronts & Merchant Dashboard
 * Independent Scaffold: Member Subscription Stores with Quota Management (MB/GB),
 * Product/Goods/Services Showcase Quotas, Mini Merchant Dashboard, Inventory Alerts,
 * Orders, Sales Analytics, Merchant Community Polls, and AI Copilot.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import apiService from '../services/apiService';
import CommerceVisualSearchModal from '../components/commerce/CommerceVisualSearchModal';
import {
  SearchIcon,
  PlusIcon
} from '../icons';
import {
  Store,
  Sparkles,
  Camera,
  Bot,
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Percent,
  TrendingUp,
  Clock,
  ShieldCheck,
  Send,
  ArrowRight,
  HardDrive,
  Pencil,
  Trash2,
  Download
} from 'lucide-react';

export interface StorefrontItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  business_type?: string;
  cover_image_url?: string;
  banner_url?: string;
  logo_url?: string;
  rating?: number;
  follower_count?: number;
  product_count?: number;
  subscription_tier?: 'free' | 'growth' | 'pro' | 'enterprise';
  storage_quota_mb?: number;
  used_storage_mb?: number;
  product_quota?: number;
  currency?: string;
  is_verified?: boolean;
}

export interface StorefrontProductItem {
  id: string;
  storefront_id?: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  currency: string;
  category: string;
  goods_type: 'physical' | 'digital' | 'service';
  sku: string;
  size?: string;
  sizes_available?: string[];
  stock: number;
  inventory_id?: string;
  quantity?: number;
  reorder_point?: number;
  sales_count?: number;
  image_url?: string;
  images?: string[];
  likes?: number;
  dislikes?: number;
  poll_data?: {
    question: string;
    options: { id: number; text: string; votes: number }[];
  };
  hasVoted?: boolean;
}

export interface StorefrontOrder {
  id: string;
  productName: string;
  buyerName: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  status: string;
  trackingCode?: string;
  date: string;
}

interface StorefrontOrderRecord {
  id: string | number;
  product_name?: string | null;
  customer_name?: string | null;
  buyer_name?: string | null;
  items?: Array<{ quantity?: number | string }>;
  total?: number | string | null;
  total_price?: number | string | null;
  currency?: string | null;
  status?: string | null;
  tracking_number?: string | null;
  tracking_code?: string | null;
  created_at?: string | null;
}

const SUBSCRIPTION_TIERS = [
  {
    tier: 'free',
    name: 'Starter Merchant',
    monthlyPrice: 0,
    storageMB: 5120, // 5 GB
    productLimit: 25,
    commissionBps: '5.0%',
    badge: 'Standard',
    features: ['5 GB Asset Cloud Storage', 'Up to 25 Showcase Products', 'Standard Settlement (14-day hold)', 'Community Directory Listing']
  },
  {
    tier: 'growth',
    name: 'Growth Merchant',
    monthlyPrice: 15,
    storageMB: 25600, // 25 GB
    productLimit: 100,
    commissionBps: '3.5%',
    badge: 'Popular',
    features: ['25 GB Asset Cloud Storage', 'Up to 100 Showcase Products', 'Accelerated Settlement (10-day hold)', 'Custom Promotional Codes & Polls']
  },
  {
    tier: 'pro',
    name: 'Professional Merchant',
    monthlyPrice: 45,
    storageMB: 102400, // 100 GB
    productLimit: 500,
    commissionBps: '2.0%',
    badge: 'High Volume',
    features: ['100 GB Asset Cloud Storage', 'Up to 500 Showcase Products', 'Priority 7-Day Settlement', 'Verified Gold Merchant Badge & Dancia-4Tv Livestreaming']
  },
  {
    tier: 'enterprise',
    name: 'Sovereign Franchise',
    monthlyPrice: 120,
    storageMB: 512000, // 500 GB
    productLimit: 99999,
    commissionBps: '0.75%',
    badge: 'Unlimited',
    features: ['500 GB Dedicated Storage', 'Unlimited Showcase Catalog', 'Ultra-Fast 3-Day Escrow Release', 'Custom Domain Routing & API Webhooks']
  }
];

const StorefrontPage: React.FC = () => {
  const { showToast } = useAppContext();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'browse-mall' | 'my-dashboard' | 'catalog' | 'inventory' | 'orders' | 'promotions' | 'storage-quotas'>('browse-mall');

  // Stores and products data
  const [storefronts, setStorefronts] = useState<StorefrontItem[]>([]);
  const [products, setProducts] = useState<StorefrontProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter
  const [showVisualSearchModal, setShowVisualSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGoodsType, setSelectedGoodsType] = useState<'all' | 'physical' | 'digital' | 'service'>('all');

  // Mini Merchant State
  const [currentTier, setCurrentTier] = useState<string>('growth');
  const [usedStorageMB] = useState<number>(3420);
  const [totalStorageMB, setTotalStorageMB] = useState<number>(25600); // 25 GB
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [showRestockModal, setShowRestockModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<StorefrontProductItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProductItem | null>(null);
  const [inventorySearch, setInventorySearch] = useState<string>('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low-stock' | 'physical' | 'digital' | 'service'>('all');

  // Product Form state
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    description: '',
    category: 'Goods & Merchandise',
    goods_type: 'physical' as 'physical' | 'digital' | 'service',
    sku: '',
    size: 'Standard',
    stock: 25,
    price: 45,
    discount_price: 35,
    reorder_point: 5,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80'
  });

  // Orders State
  const [orders, setOrders] = useState<StorefrontOrder[]>([]);

  // AI Storefront Copilot state
  const [showAiCopilot, setShowAiCopilot] = useState<boolean>(false);
  const [copilotQuery, setCopilotQuery] = useState<string>('');
  const [copilotMessages, setCopilotMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Hello Merchant! I am your Storefront AI Copilot. I can draft high-converting product descriptions, recommend optimal pricing based on community demand, or write promotional copy.'
    }
  ]);

  // Load Storefronts and Products from API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [storesRes, prodsRes, ordersRes] = await Promise.all([
        apiService.get<{ storefronts?: StorefrontItem[]; stores?: StorefrontItem[]; data?: StorefrontItem[] | { storefronts?: StorefrontItem[] } }>('/api/storefront/stores'),
        apiService.get<{ products?: StorefrontProductItem[]; data?: StorefrontProductItem[] | { products?: StorefrontProductItem[] } }>('/api/storefront/products'),
        apiService.get<{ orders?: StorefrontOrderRecord[]; data?: StorefrontOrderRecord[] }>('/api/storefront/orders')
      ]);

      const nestedStores = Array.isArray(storesRes.data) ? storesRes.data : storesRes.data?.storefronts || [];
      const nestedProducts = Array.isArray(prodsRes.data) ? prodsRes.data : prodsRes.data?.products || [];
      const stores = storesRes.storefronts || storesRes.stores || nestedStores;
      const productRows = prodsRes.products || nestedProducts;
      const orderRows = ordersRes.orders || (Array.isArray(ordersRes.data) ? ordersRes.data : []);
      const loadedStores = Array.isArray(stores) ? stores : [];
      const loadedProducts = Array.isArray(productRows) ? productRows : [];

      setStorefronts(loadedStores);
      setProducts(loadedProducts);
      setOrders(Array.isArray(orderRows) ? orderRows.map(order => ({
        id: String(order.id),
        productName: String(order.product_name || 'Storefront order'),
        buyerName: String(order.customer_name || order.buyer_name || 'Customer'),
        quantity: Array.isArray(order.items) ? order.items.reduce((quantity, item) => quantity + Number(item.quantity || 0), 0) : 1,
        totalPrice: Number(order.total || order.total_price || 0),
        currency: String(order.currency || 'FIC'),
        status: String(order.status || 'pending').toLowerCase(),
        trackingCode: String(order.tracking_number || order.tracking_code || ''),
        date: order.created_at ? new Date(order.created_at).toISOString().slice(0, 10) : ''
      })) : []);
    } catch {
      setStorefronts([]);
      setProducts([]);
      setOrders([]);
      showToast('Unable to load storefront data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedGoodsType !== 'all') {
      list = list.filter(p => p.goods_type === selectedGoodsType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, selectedGoodsType, searchQuery]);

  // Handle Poll Voting in Storefront Product
  const handleVotePoll = (productId: string, optionId: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId || !p.poll_data) return p;
        const updated = p.poll_data.options.map(o =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        );
        return { ...p, hasVoted: true, poll_data: { ...p.poll_data, options: updated } };
      })
    );
    showToast('Vote registered on Storefront Ledger!', 'success');
  };

  // Handle Add Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const storefrontId = storefronts[0]?.id;
    if (!storefrontId) {
      showToast('Create a storefront before adding products.', 'error');
      return;
    }
    try {
      await apiService.post('/api/storefront/products', {
        store_id: storefrontId,
        name: newProductForm.name,
        description: newProductForm.description,
        short_description: newProductForm.description,
        price: newProductForm.price,
        compare_at_price: newProductForm.discount_price,
        category: newProductForm.category,
        sku: newProductForm.sku,
        images: newProductForm.image_url ? [newProductForm.image_url] : [],
        stock: newProductForm.stock,
        reorder_point: newProductForm.reorder_point,
        goods_type: newProductForm.goods_type
      });
      await loadData();
      setShowProductModal(false);
      showToast(`Added "${newProductForm.name}" to your Storefront.`, 'success');
    } catch {
      showToast('Unable to create the product. Please try again.', 'error');
    }
  };

  // Quick stock adjustment (+/-)
  const handleQuickAdjustStock = async (productId: string, delta: number) => {
    const product = products.find(item => item.id === productId);
    if (!product?.inventory_id) {
      showToast('Inventory record is unavailable for this product.', 'error');
      return;
    }
    try {
      await apiService.post(`/api/storefront/inventory/${product.inventory_id}/adjust`, {
        delta,
        reason: 'Merchant quick stock adjustment'
      });
      await loadData();
      showToast(`Stock adjusted (${delta > 0 ? '+' : ''}${delta})`, 'success');
    } catch {
      showToast('Unable to adjust stock. Please try again.', 'error');
    }
  };

  const handleRestockInventory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct?.inventory_id) {
      showToast('Inventory record is unavailable for this product.', 'error');
      return;
    }
    const formData = new FormData(event.currentTarget);
    const quantity = Number(formData.get('addQty'));
    if (!Number.isInteger(quantity) || quantity < 1) {
      showToast('Enter a whole number of units to restock.', 'error');
      return;
    }
    try {
      await apiService.post(`/api/storefront/inventory/${selectedProduct.inventory_id}/adjust`, {
        delta: quantity,
        reason: 'Merchant product restock'
      });
      await loadData();
      showToast(`Restocked +${quantity} units for ${selectedProduct.name}.`, 'success');
      setShowRestockModal(false);
    } catch {
      showToast('Unable to restock this product. Please try again.', 'error');
    }
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: StorefrontProductItem) => {
    setEditingProduct({ ...prod });
    setShowEditModal(true);
  };

  // Save Product Updates
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await apiService.put(`/api/storefront/products/${editingProduct.id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        status: 'active'
      });
      await loadData();
      setShowEditModal(false);
      showToast(`Updated "${editingProduct.name}" successfully.`, 'success');
    } catch {
      showToast('Unable to update the product. Please try again.', 'error');
    }
  };

  // Delete Product Listing
  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from your store?`)) {
      apiService.delete(`/api/storefront/products/${productId}`)
        .then(() => loadData())
        .then(() => showToast(`Removed "${productName}" from storefront inventory.`, 'info'))
        .catch(() => showToast('Unable to delete the product. Please try again.', 'error'));
    }
  };

  // Export Inventory CSV
  const handleExportInventoryCsv = () => {
    const headers = ['SKU,Name,Category,Type,Price (FIC),Stock,Reorder Point,Sales Count'];
    const rows = products.map(p =>
      `"${p.sku}","${p.name.replace(/"/g, '""')}","${p.category}","${p.goods_type}",${p.price},${p.stock},${p.reorder_point || 5},${p.sales_count || 0}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `storefront_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported inventory ledger CSV!', 'success');
  };

  // Filtered inventory list
  const filteredInventoryProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        p.category.toLowerCase().includes(inventorySearch.toLowerCase());

      if (!matchesSearch) return false;
      if (inventoryFilter === 'low-stock') return p.stock <= (p.reorder_point || 5);
      if (inventoryFilter === 'physical') return p.goods_type === 'physical';
      if (inventoryFilter === 'digital') return p.goods_type === 'digital';
      if (inventoryFilter === 'service') return p.goods_type === 'service';
      return true;
    });
  }, [products, inventorySearch, inventoryFilter]);

  // AI Copilot Query Handler
  const handleSendCopilotQuery = () => {
    if (!copilotQuery.trim()) return;
    const userMsg = { sender: 'user' as const, text: copilotQuery };
    setCopilotMessages(prev => [...prev, userMsg]);
    setCopilotQuery('');

    setTimeout(() => {
      let reply = 'Consider pricing this at 35 FIC with a promotional 10% discount for first-week buyers. That drives conversion while preserving your 97% net margin.';
      if (copilotQuery.toLowerCase().includes('description')) {
        reply = 'Headline: Handcrafted Perfection. Copy: "Engineered for creators who refuse to compromise on quality. Woven with sustainable materials and backed by FingerMobile Protocol authenticity guarantee."';
      } else if (copilotQuery.toLowerCase().includes('sku') || copilotQuery.toLowerCase().includes('stock')) {
        reply = 'Best practice: Group physical goods with size suffixes (e.g., SKU-BAG-MED-16) and set your reorder point to at least 5 units to avoid stockouts.';
      }
      setCopilotMessages(prev => [...prev, { sender: 'ai' as const, text: reply }]);
    }, 600);
  };

  return (
    <MainLayout pageTitle="Member Storefronts | FingerMobile Protocol™">
      <div className="min-h-screen bg-slate-900 text-slate-100 w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/20 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                <Store className="w-3.5 h-3.5" /> Member Subscription Stores & Merchant Mall
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Storefronts <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Mall & Dashboard</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Create and manage your sovereign customer-facing shop. Upload products, physical goods, and bookable services with guaranteed cloud storage quotas and 97% creator payout retention.
              </p>
            </div>

            {/* Quick Metrics & Storage Meter */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 flex flex-col sm:flex-row items-center gap-5 shrink-0">
              <div>
                <div className="flex justify-between items-center text-xs mb-1 gap-4">
                  <span className="text-slate-300 font-medium font-semibold flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-blue-400" /> Storage Quota:
                  </span>
                  <span className="font-mono text-blue-300 font-bold">
                    {(usedStorageMB / 1024).toFixed(2)} GB / {(totalStorageMB / 1024).toFixed(0)} GB
                  </span>
                </div>
                <div className="w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: `${(usedStorageMB / totalStorageMB) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-300 font-medium mt-1 block">Tier: <strong className="text-slate-300 uppercase">{currentTier}</strong> (3.5% fee)</span>
              </div>

              <button
                onClick={() => setActiveTab('my-dashboard')}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" /> Open Merchant Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Universal AI Search Engine Tool Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-1/2">
                <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 font-medium" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stores, merchant products, goods, services, or SKU..."
                  className="w-full min-h-[44px] pl-12 pr-32 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-300 font-medium focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowVisualSearchModal(true)}
                  className="absolute right-1.5 top-1.5 min-h-[36px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition shadow-2xs cursor-pointer"
                  title="Search products by image or photo"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Image</span> Search
                </button>
              </div>

              {/* Goods Type Filter */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
                {[
                  { id: 'all', label: 'All Catalog' },
                  { id: 'physical', label: 'Physical Goods' },
                  { id: 'digital', label: 'Digital Assets' },
                  { id: 'service', label: 'Bookable Services' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedGoodsType(type.id as any)}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center shrink-0 ${
                      selectedGoodsType === type.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 font-medium hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Independent Storefront Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'browse-mall', label: 'Browse Storefronts Mall', icon: Store },
              { id: 'my-dashboard', label: 'Mini Merchant Dashboard', icon: Package },
              { id: 'catalog', label: 'Product & Service Catalog', icon: Layers, count: products.length },
              { id: 'inventory', label: 'Inventory & Stock Alerts', icon: AlertTriangle },
              { id: 'orders', label: 'Orders & Fulfillment', icon: Clock, count: orders.length },
              { id: 'promotions', label: 'Promotions & Polls', icon: Percent },
              { id: 'storage-quotas', label: 'Storage Quotas & Plans', icon: HardDrive }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center justify-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 font-medium hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: BROWSE STOREFRONTS MALL */}
          {activeTab === 'browse-mall' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storefronts.map((store) => (
                  <div
                    key={store.id}
                    className="rounded-3xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition-all overflow-hidden flex flex-col shadow-xl"
                  >
                    <div className="relative h-52 bg-slate-900">
                      <img
                        src={store.cover_image_url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80'}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-950/80 text-blue-300 backdrop-blur-md border border-blue-500/30">
                          {store.business_type || 'Boutique'}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center gap-1">
                          ★ {store.rating || 4.9}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white">{store.name}</h3>
                          {store.is_verified && (
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        {store.tagline && (
                          <p className="text-xs font-semibold text-blue-400 mb-2">{store.tagline}</p>
                        )}
                        <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                          {store.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-xs text-slate-300 font-medium">
                          <span>{store.product_count || 12} Products</span> • <span>{store.follower_count || 1500} Followers</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('catalog')}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          Visit Store <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MINI MERCHANT DASHBOARD */}
          {activeTab === 'my-dashboard' && (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-300 font-medium uppercase">Gross Sales</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">4,820 FIC</h3>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">+18.4% from last month</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-300 font-medium uppercase">Net Creator Payout</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-blue-400">4,675.4 FIC</h3>
                  <span className="text-[11px] text-slate-300 font-medium mt-1 block">97% Retained (3% Protocol Fee)</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-300 font-medium uppercase">Active Products</span>
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{products.length} / 100</h3>
                  <span className="text-[11px] text-purple-400 mt-1 block">Quota: 100 max slots</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-300 font-medium uppercase">Storage Used</span>
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{(usedStorageMB / 1024).toFixed(1)} GB</h3>
                  <span className="text-[11px] text-cyan-400 mt-1 block">Of {(totalStorageMB / 1024).toFixed(0)} GB allocated</span>
                </div>
              </div>

              {/* Quick Actions & AI Copilot Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-950 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cyan-400" /> AI Storefront Copilot
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Generate high-converting product descriptions, optimize pricing against market trends, or setup automatic reorder alerts.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" /> Add Product / Service
                  </button>
                  <button
                    onClick={() => setShowAiCopilot(true)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Ask AI Copilot
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & SERVICES CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Merchant Product & Service Catalog</h2>
                  <p className="text-xs text-slate-300 font-medium">All showcase listings published by your store</p>
                </div>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" /> Add Listing
                </button>
              </div>

              {loading ? (
                <p className="py-10 text-center text-slate-300">Loading storefront catalog...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="h-48 bg-slate-900 relative">
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-950/80 text-blue-300 border border-blue-500/20">
                            {p.goods_type}
                          </span>
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 text-slate-300">
                            {p.sku}
                          </span>
                        </div>
                        <div className="p-5 space-y-3">
                          <h3 className="font-bold text-white text-base">{p.name}</h3>
                          <p className="text-xs text-slate-300 font-medium line-clamp-2">{p.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium">Size / Variant: <strong className="text-slate-300">{p.size}</strong></span>
                            <span className="text-slate-300 font-medium">Stock: <strong className="text-emerald-400">{p.stock} units</strong></span>
                          </div>

                          {/* Interactive Poll if exists */}
                          {p.poll_data && (
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                              <span className="font-semibold text-blue-300 block mb-1.5">{p.poll_data.question}</span>
                              <div className="space-y-1.5">
                                {p.poll_data.options.map((opt) => (
                                  <button
                                    key={opt.id}
                                    onClick={() => handleVotePoll(p.id, opt.id)}
                                    className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-blue-500/10 text-[11px] text-slate-300 flex justify-between border border-slate-800"
                                  >
                                    <span>{opt.text}</span>
                                    <span className="font-mono text-blue-400 font-bold">{opt.votes}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-slate-900 flex items-center justify-between">
                        <div>
                          {p.discount_price ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black text-emerald-400">{p.discount_price} FIC</span>
                              <span className="text-xs text-slate-300 font-medium line-through">{p.price} FIC</span>
                            </div>
                          ) : (
                            <span className="text-lg font-black text-white">{p.price} FIC</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setShowRestockModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold"
                            title="Restock"
                          >
                          Restock
                          </button>
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Edit Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 font-medium hover:text-rose-400 transition"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INVENTORY & STOCK ALERTS */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Top Inventory Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 font-medium uppercase block mb-1">Total SKUs</span>
                  <div className="text-xl font-black text-white">{products.length}</div>
                  <span className="text-[10px] text-slate-300 font-medium">Active catalog items</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 font-medium uppercase block mb-1">Total Stock</span>
                  <div className="text-xl font-black text-emerald-400">
                    {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
                  </div>
                  <span className="text-[10px] text-emerald-500/80">Available units</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 font-medium uppercase block mb-1">Low Stock Alerts</span>
                  <div className="text-xl font-black text-amber-400">
                    {products.filter(p => p.stock <= (p.reorder_point || 5) && p.stock > 0).length}
                  </div>
                  <span className="text-[10px] text-amber-500/80">At or below reorder threshold</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 font-medium uppercase block mb-1">Out of Stock</span>
                  <div className="text-xl font-black text-rose-400">
                    {products.filter(p => (p.stock || 0) === 0).length}
                  </div>
                  <span className="text-[10px] text-rose-500/80">Needs immediate replenishment</span>
                </div>
              </div>

              {/* Inventory Management Table & Controls */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Merchant Inventory Self-Management</h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Real-time SKU tracking, quick stock adjustments, and automated reorder threshold alerts.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportInventoryCsv}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2"
                      title="Export CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => setShowProductModal(true)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <SearchIcon className="w-4 h-4 text-slate-300 font-medium absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      placeholder="Search by SKU, item name, or category..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-300 font-medium focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {(['all', 'low-stock', 'physical', 'digital', 'service'] as const).map((filterKey) => (
                      <button
                        key={filterKey}
                        onClick={() => setInventoryFilter(filterKey)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition capitalize ${
                          inventoryFilter === filterKey
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-900 text-slate-300 font-medium hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {filterKey === 'all' ? 'All Items' : filterKey.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {filteredInventoryProducts.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800/80">
                      <p className="text-slate-300 font-medium text-xs">No inventory items match your current filter or search criteria.</p>
                    </div>
                  ) : (
                    filteredInventoryProducts.map((p) => {
                      const isLow = p.stock <= (p.reorder_point || 5) && p.stock > 0;
                      const isOut = (p.stock || 0) === 0;
                      return (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-700 transition"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <img
                              src={p.image_url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=120&q=80'}
                              alt={p.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-mono text-xs font-bold text-slate-300">{p.sku}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 font-medium border border-slate-700">
                                  {p.goods_type}
                                </span>
                                {isOut ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    Out of Stock
                                  </span>
                                ) : isLow ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Low Stock Alert
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Optimal
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium mt-1">
                                <span>Price: <strong className="text-slate-300 font-mono">{p.price} FIC</strong></span>
                                <span>Reorder threshold: <strong className="text-slate-300 font-medium font-mono">{p.reorder_point || 5} units</strong></span>
                                <span>Sales: <strong className="text-slate-300 font-medium font-mono">{p.sales_count || 0}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                            {/* Stock Indicator */}
                            <div className="text-right mr-2">
                              <span className="text-[10px] text-slate-300 font-medium block uppercase font-bold">In Stock</span>
                              <span className={`text-base font-black font-mono ${isOut ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {p.stock} units
                              </span>
                            </div>

                            {/* Quick Adjust Buttons */}
                            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                              <button
                                onClick={() => handleQuickAdjustStock(p.id, -1)}
                                disabled={p.stock <= 0}
                                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 rounded-lg text-xs font-mono font-bold transition"
                                title="Decrease stock by 1"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleQuickAdjustStock(p.id, 5)}
                                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold transition"
                                title="Increase stock by 5"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => handleQuickAdjustStock(p.id, 10)}
                                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold transition"
                                title="Increase stock by 10"
                              >
                                +10
                              </button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setShowRestockModal(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
                              >
                                Restock
                              </button>
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                title="Edit Product Details"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 font-medium hover:text-rose-400 transition"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS & FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-2">Customer Orders & Shipping Tracking</h3>
                <p className="text-xs text-slate-300 font-medium mb-6">
                  Manage shipments, dispatch tracking codes, and view escrow settlements.
                </p>

                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-blue-400 font-bold">{ord.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                            {ord.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{ord.productName} (x{ord.quantity})</h4>
                        <span className="text-xs text-slate-300 font-medium">Buyer: <strong>{ord.buyerName}</strong> • Tracking: <span className="font-mono text-slate-300">{ord.trackingCode}</span></span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-emerald-400">{ord.totalPrice} {ord.currency}</span>
                        <button
                          onClick={() => showToast(`Dispatched tracking updates for ${ord.id}`, 'success')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROMOTIONS & POLLS */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-2">Storefront Promotions & Community Polls</h3>
                <p className="text-xs text-slate-300 font-medium mb-6">
                  Engage your customer base with limited-time discount codes and interactive product polls.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold uppercase text-blue-400 block mb-2">Active Promo Code</span>
                    <div className="p-3 bg-slate-950 rounded-xl font-mono text-sm text-emerald-400 font-black border border-slate-800 flex justify-between items-center">
                      <span>FINGER-FALL-15</span>
                      <span className="text-xs text-slate-300 font-medium">15% Off (32 Uses)</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold uppercase text-blue-400 block mb-2">Active Community Poll</span>
                    <p className="text-xs font-semibold text-white mb-2">Which instrument bundle should we record next?</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>African Talking Drum</span>
                        <span className="font-mono text-emerald-400 font-bold">58%</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Neo-Soul Electric Piano</span>
                        <span className="font-mono text-blue-400 font-bold">42%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: STORAGE QUOTAS & SUBSCRIPTION PLANS */}
          {activeTab === 'storage-quotas' && (
            <div className="space-y-8">
              <div className="p-6 rounded-3xl bg-slate-950 border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-2">Storefront Subscription Tiers & Storage Quotas</h3>
                <p className="text-xs text-slate-300 font-medium mb-6">
                  Choose a subscription tier with your required asset storage quota and product showcase limits.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SUBSCRIPTION_TIERS.map((tier) => (
                    <div
                      key={tier.tier}
                      className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                        currentTier === tier.tier
                          ? 'bg-blue-950/30 border-blue-500 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-sm text-white">{tier.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                            {tier.badge}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-white mb-1">
                          ${tier.monthlyPrice} <span className="text-xs font-normal text-slate-300 font-medium">/ mo</span>
                        </h4>
                        <span className="text-xs text-cyan-400 font-semibold block mb-4">
                          {(tier.storageMB / 1024).toFixed(0)} GB Cloud Storage • {tier.commissionBps} fee
                        </span>

                        <ul className="space-y-2 text-xs text-slate-300 mb-6">
                          {tier.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentTier(tier.tier);
                          setTotalStorageMB(tier.storageMB);
                          showToast(`Subscribed to ${tier.name}!`, 'success');
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                          currentTier === tier.tier
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {currentTier === tier.tier ? 'Current Active Tier' : 'Upgrade Plan'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ADD PRODUCT MODAL */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Add Product, Goods or Service</h3>
                <button type="button" onClick={() => setShowProductModal(false)} className="text-slate-300 font-medium hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. Masterclass Stems or Handcrafted Leather Bag"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Goods Type</label>
                    <select
                      value={newProductForm.goods_type}
                      onChange={(e: any) => setNewProductForm({ ...newProductForm, goods_type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="physical">Physical Goods</option>
                      <option value="digital">Digital Asset</option>
                      <option value="service">Bookable Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">SKU</label>
                    <input
                      type="text"
                      value={newProductForm.sku}
                      onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                      placeholder="e.g. STR-PROD-01"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Base Price (FIC)</label>
                    <input
                      type="number"
                      required
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Promo Price</label>
                    <input
                      type="number"
                      value={newProductForm.discount_price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, discount_price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    placeholder="Provide details, dimensions, specifications, or deliverables..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                  >
                    Publish to Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* RESTOCK MODAL */}
        {showRestockModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base">Restock: {selectedProduct.name}</h3>
                <button type="button" onClick={() => setShowRestockModal(false)} className="text-slate-300 font-medium hover:text-white">✕</button>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">Current Stock: </span>
                <strong className="text-emerald-400 font-mono text-sm">{selectedProduct.stock} units</strong>
              </div>

              <form onSubmit={handleRestockInventory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-medium mb-1">Additional Units</label>
                  <input
                    type="number"
                    name="addQty"
                    defaultValue={10}
                    required
                    min={1}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowRestockModal(false)} className="flex-1 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl">Confirm Restock</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT PRODUCT MODAL */}
        {showEditModal && editingProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Edit Listing: {editingProduct.name}</h3>
                <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-300 font-medium hover:text-white">✕</button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Goods Type</label>
                    <select
                      value={editingProduct.goods_type}
                      onChange={(e: any) => setEditingProduct({ ...editingProduct, goods_type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="physical">Physical Goods</option>
                      <option value="digital">Digital Asset</option>
                      <option value="service">Bookable Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">SKU</label>
                    <input
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Price (FIC)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Promo Price</label>
                    <input
                      type="number"
                      value={editingProduct.discount_price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, discount_price: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Current Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value), quantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Reorder Point Threshold</label>
                    <input
                      type="number"
                      value={editingProduct.reorder_point || 5}
                      onChange={(e) => setEditingProduct({ ...editingProduct, reorder_point: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI STOREFRONT COPILOT DRAWER */}
        {showAiCopilot && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 z-50 p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Storefront AI Copilot</h3>
              </div>
              <button type="button" onClick={() => setShowAiCopilot(false)} className="text-slate-300 font-medium hover:text-white">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {copilotMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'ai'
                      ? 'bg-slate-950 border border-slate-800 text-slate-300'
                      : 'bg-blue-600/20 text-blue-200 border border-blue-500/30 ml-6'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 flex gap-2 border-t border-slate-800">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCopilotQuery()}
                placeholder="Ask pricing, copy, or stock advice..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button type="button" aria-label="Send"
                onClick={handleSendCopilotQuery}
                className="p-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
          <button
            onClick={() => setActiveTab('browse-mall')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
              activeTab === 'browse-mall' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Mall"
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Mall</span>
          </button>
          <button
            onClick={() => setActiveTab('my-dashboard')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
              activeTab === 'my-dashboard' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Merchant"
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Merchant</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
              activeTab === 'catalog' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Catalog"
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Catalog</span>
          </button>
          <button
            onClick={() => setShowAiCopilot(prev => !prev)}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
              showAiCopilot ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Copilot"
          >
            <Bot className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Copilot</span>
          </button>
        </div>
        {/* Sovereign Commerce Visual Search Modal */}
        <CommerceVisualSearchModal
          isOpen={showVisualSearchModal}
          onClose={() => setShowVisualSearchModal(false)}
          initialStore="storefront"
        />
      </div>
    </MainLayout>
  );
};

export default StorefrontPage;
