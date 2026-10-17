import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Store,
  Flame,
  Coins,
  Package,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
  Copy,
  Check,
  Truck,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  DollarSign,
  X,
  Award
} from 'lucide-react';
import { CURATED_FLAGSHIP_PRODUCTS } from '../../data/curatedMarketplaceData';
import { CURATED_STOREFRONT_PRODUCTS } from '../../data/curatedStorefrontData';
import { FlagshipProduct } from '../../pages/MarketplacePage';
import { Product } from '../../types';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemTitle: string;
  category: string;
  amountFic: number;
  amountNgn: number;
  paymentMethod: 'FIC_TRANSFER' | 'ALTERNATIVE_BANK_NGN' | 'CARD_FIAT';
  status: 'PROCESSING' | 'IN_TRANSIT' | 'DELIVERED' | 'ESCROW_RELEASED';
  trackingNumber: string;
  date: string;
  vendorName: string;
}

interface VendorItem {
  id: string;
  name: string;
  owner: string;
  tier: 'FLAMINGO_VIP' | 'SOVEREIGN_CERTIFIED' | 'STANDARD_CREATOR';
  rating: number;
  salesCount: number;
  gmvFic: number;
  gmvNgn: number;
  status: 'ACTIVE' | 'PENDING_REVIEW' | 'SUSPENDED';
  category: string;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-001',
    orderNumber: 'FMP-ORD-9021',
    customerName: 'Kelechi Okafor',
    customerEmail: 'k.okafor@fingermobile.io',
    itemTitle: 'FingerMobile Protocol Sovereign Keycard V3',
    category: 'Hardware & Security',
    amountFic: 300.0,
    amountNgn: 150000,
    paymentMethod: 'FIC_TRANSFER',
    status: 'ESCROW_RELEASED',
    trackingNumber: 'TRK-FMP-882910-NG',
    date: '2026-10-13 14:22',
    vendorName: 'FingerMobile Protocol Hardware Lab'
  },
  {
    id: 'ord-002',
    orderNumber: 'FMP-ORD-9022',
    customerName: 'Fatima Al-Mansoor',
    customerEmail: 'fatima.m@gulftech.ae',
    itemTitle: 'Afrobeat Sovereign Master Stem Pack Vol. 1',
    category: 'Music & Audio',
    amountFic: 50.0,
    amountNgn: 25000,
    paymentMethod: 'FIC_TRANSFER',
    status: 'DELIVERED',
    trackingNumber: 'DIGITAL-INSTANT-DOWNLOAD',
    date: '2026-10-13 13:45',
    vendorName: 'Alex Johnson Audio Labs'
  },
  {
    id: 'ord-003',
    orderNumber: 'FMP-ORD-9023',
    customerName: 'Chinedu Eze',
    customerEmail: 'chinedu.eze@enuguhub.com',
    itemTitle: 'Autonomous Sentinel IoT Gateway Bridge',
    category: 'Hardware & Security',
    amountFic: 960.0,
    amountNgn: 480000,
    paymentMethod: 'ALTERNATIVE_BANK_NGN',
    status: 'IN_TRANSIT',
    trackingNumber: 'TRK-DHL-448291-EXP',
    date: '2026-10-13 11:30',
    vendorName: 'FingerMobile Protocol Hardware Lab'
  },
  {
    id: 'ord-004',
    orderNumber: 'FMP-ORD-9024',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@londonmedia.uk',
    itemTitle: 'The Sovereign Creator Manifesto & Handbook',
    category: 'Books & Literature',
    amountFic: 17.0,
    amountNgn: 8500,
    paymentMethod: 'FIC_TRANSFER',
    status: 'ESCROW_RELEASED',
    trackingNumber: 'DIGITAL-EPUB-VAULT',
    date: '2026-10-13 10:15',
    vendorName: 'Dr. Chukwuma Publishing'
  },
  {
    id: 'ord-005',
    orderNumber: 'FMP-ORD-9025',
    customerName: 'Emeka Nwosu',
    customerEmail: 'emeka@nwosuholding.ng',
    itemTitle: 'Titanium Cold Storage Seed Vault Capsule',
    category: 'Hardware & Security',
    amountFic: 240.0,
    amountNgn: 120000,
    paymentMethod: 'ALTERNATIVE_BANK_NGN',
    status: 'PROCESSING',
    trackingNumber: 'TRK-FMP-PENDING',
    date: '2026-10-13 09:05',
    vendorName: 'FingerMobile Protocol Hardware Lab'
  }
];

const INITIAL_VENDORS: VendorItem[] = [
  {
    id: 'ven-001',
    name: 'FingerMobile Protocol Flagship Store',
    owner: 'Mbah Israel Obinna (SuperAdmin)',
    tier: 'FLAMINGO_VIP',
    rating: 5.0,
    salesCount: 1420,
    gmvFic: 426000,
    gmvNgn: 213000000,
    status: 'ACTIVE',
    category: 'Flagship Hardware & Protocol Assets'
  },
  {
    id: 'ven-002',
    name: 'Alex Johnson Audio Labs',
    owner: 'Alex Johnson',
    tier: 'FLAMINGO_VIP',
    rating: 4.98,
    salesCount: 342,
    gmvFic: 17100,
    gmvNgn: 8550000,
    status: 'ACTIVE',
    category: 'Music & Audio'
  },
  {
    id: 'ven-003',
    name: 'Dr. Chukwuma Publishing',
    owner: 'Dr. Ifeanyi Chukwuma',
    tier: 'SOVEREIGN_CERTIFIED',
    rating: 4.95,
    salesCount: 189,
    gmvFic: 3213,
    gmvNgn: 1606500,
    status: 'ACTIVE',
    category: 'Books & Literature'
  },
  {
    id: 'ven-004',
    name: 'NeoLagos 3D Studio',
    owner: 'Tunde Bakare',
    tier: 'SOVEREIGN_CERTIFIED',
    rating: 4.91,
    salesCount: 96,
    gmvFic: 6720,
    gmvNgn: 3360000,
    status: 'ACTIVE',
    category: 'Digital Art & 3D'
  },
  {
    id: 'ven-005',
    name: 'Sovereign Merch Apparel',
    owner: 'Ngozi Adeyemi',
    tier: 'STANDARD_CREATOR',
    rating: 4.88,
    salesCount: 140,
    gmvFic: 4900,
    gmvNgn: 2450000,
    status: 'ACTIVE',
    category: 'Apparel & Merch'
  }
];

const MasterEcommerceConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flagship' | 'storefronts' | 'burn' | 'orders' | 'vendors'>('flagship');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Data states
  const [flagshipProducts, setFlagshipProducts] = useState<FlagshipProduct[]>(CURATED_FLAGSHIP_PRODUCTS);
  const [storefrontProducts] = useState<Product[]>(CURATED_STOREFRONT_PRODUCTS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [vendors] = useState<VendorItem[]>(INITIAL_VENDORS);

  // Burn calculator states
  const [calcInputFic, setCalcInputFic] = useState('1000');
  const [calcSelectedCurrency, setCalcSelectedCurrency] = useState<'FIC' | 'NGN'>('FIC');

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<FlagshipProduct | null>(null);
  const [restockAmount, setRestockAmount] = useState('50');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  // Restock action
  const handleRestockProduct = () => {
    if (!selectedProduct) return;
    const added = parseInt(restockAmount, 10) || 0;
    setFlagshipProducts(prev =>
      prev.map(p =>
        p.id === selectedProduct.id
          ? { ...p, stock_quantity: (p.stock_quantity || 0) + added }
          : p
      )
    );
    showToast(`Restocked ${added} units for ${selectedProduct.name}`);
    setIsRestockModalOpen(false);
  };

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderItem['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    showToast(`Order ${orderId} updated to ${nextStatus}`);
  };

  // Filtered Flagship Products
  const filteredFlagship = useMemo(() => {
    return flagshipProducts.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'ALL' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [flagshipProducts, searchQuery, categoryFilter]);

  // Filtered Storefront Products
  const filteredStorefront = useMemo(() => {
    return storefrontProducts.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sellerName && p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        categoryFilter === 'ALL' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [storefrontProducts, searchQuery, categoryFilter]);

  // Unique categories for filtering
  const flagshipCategories = useMemo(() => {
    const set = new Set(flagshipProducts.map(p => p.category));
    return Array.from(set);
  }, [flagshipProducts]);

  const storefrontCategories = useMemo(() => {
    const set = new Set(storefrontProducts.map(p => p.category));
    return Array.from(set);
  }, [storefrontProducts]);

  // Burn calculator calculations
  const parsedAmount = parseFloat(calcInputFic) || 0;
  const ficValue = calcSelectedCurrency === 'FIC' ? parsedAmount : parsedAmount / 500;
  const ngnValue = calcSelectedCurrency === 'FIC' ? parsedAmount * 500 : parsedAmount;
  const burnAmountFic = ficValue * 0.10;
  const burnAmountNgn = ngnValue * 0.10;
  const creatorPayoutFic = ficValue * 0.85;
  const protocolFeeFic = ficValue * 0.05;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 text-white border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <ShoppingBag className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-white">
                    E-Commerce & Storefronts Master Console
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500 text-white">
                    [FingerMobile™Protocol]
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  Dual-Currency Settlement Engine (FIC / ₦), 90 Multi-Vendor Catalog SKUs, 10% Permanent Burn Controller & Order Escrow
                </p>
              </div>
            </div>
          </div>

          {/* Quick External Links & Reload */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="/marketplace"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-slate-700 border border-white/10 flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Marketplace
            </a>
            <a
              href="/storefronts"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-slate-700 border border-white/10 flex items-center gap-1.5 transition"
            >
              <Store className="w-3.5 h-3.5" />
              Live Storefronts
            </a>
            <button
              onClick={() => showToast('Refreshed inventory and order synchronization')}
              className="p-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-slate-700 border border-white/10 transition"
            >
              <span title="Sync catalog">
                <RefreshCw className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>

        {/* 5 Executive Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Total Active SKUs</span>
              <Package className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-black text-white mt-1">90 Items</div>
            <div className="text-[10px] text-slate-400">30 Flagship + 60 Stores</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Gross Merchandise Value</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-400 mt-1">₦48.65M</div>
            <div className="text-[10px] text-slate-400">~97,300 FIC Settled</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>10% Protocol Burn</span>
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-black text-rose-400 mt-1">4,865.00 FIC</div>
            <div className="text-[10px] text-slate-400">Burned to 0x...dEaD</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified Vendors</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-400 mt-1">18 Vendors</div>
            <div className="text-[10px] text-slate-400">Flamingo VIP Tier Active</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Infinite Coin Peg</span>
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-black text-cyan-400 mt-1">₦500 / $0.50</div>
            <div className="text-[10px] text-slate-400">Dual-Currency Standard</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 overflow-x-auto">
        {[
          { id: 'flagship', label: `Flagship Marketplace (${flagshipProducts.length})`, icon: ShieldCheck },
          { id: 'storefronts', label: `Creator Storefronts (${storefrontProducts.length})`, icon: Store },
          { id: 'burn', label: 'Dual Currency & 10% Burn Engine', icon: Flame },
          { id: 'orders', label: `Orders & Escrow (${orders.length})`, icon: Truck },
          { id: 'vendors', label: `Vendor Governance (${vendors.length})`, icon: Award },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setCategoryFilter('ALL');
              setSearchQuery('');
            }}
            className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: FLAGSHIP MARKETPLACE */}
      {activeTab === 'flagship' && (
        <div className="p-6 space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search flagship products by name, category, SKU..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 font-bold border-slate-300 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-700" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-xs py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-medium font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Categories ({flagshipProducts.length})</option>
                {flagshipCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Flagship Catalog Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] uppercase font-black tracking-wider text-slate-700 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Flagship Item</th>
                  <th className="py-3 px-4">Category / SKU</th>
                  <th className="py-3 px-4 text-right">FIC Price</th>
                  <th className="py-3 px-4 text-right">₦ FIAT Equiv</th>
                  <th className="py-3 px-4 text-center">Stock Units</th>
                  <th className="py-3 px-4">Authenticity Hash</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFlagship.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl || prod.images?.[0]}
                          alt={prod.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{prod.name}</div>
                          <div className="text-[10px] text-slate-700 truncate max-w-xs">{prod.tagline}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        {prod.category}
                      </span>
                      <div className="text-[10px] font-mono text-slate-700 mt-1">{prod.sku}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black font-mono text-orange-600 dark:text-orange-400">
                      {prod.priceFic.toLocaleString()} FIC
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-700 dark:text-slate-300">
                      ₦{(prod.priceFic * 500).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (prod.stock_quantity || 0) > 50
                          ? 'bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-50 text-emerald-950 dark:bg-amber-950 dark:text-amber-300'
                      }border border-emerald-400 font-black`}>
                        {prod.stock_quantity} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px]">
                      {prod.authenticity_ledger_hash ? (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 truncate max-w-[110px]" title={prod.authenticity_ledger_hash}>
                            {prod.authenticity_ledger_hash.slice(0, 10)}...{prod.authenticity_ledger_hash.slice(-6)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(prod.authenticity_ledger_hash || '', prod.id)}
                            className="p-1 text-slate-700 hover:text-slate-600 rounded transition"
                          >
                            <span title="Copy authenticity hash">
                              {copiedHash === prod.id ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(prod);
                          setIsRestockModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
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

      {/* TAB 2: CREATOR STOREFRONTS CATALOG */}
      {activeTab === 'storefronts' && (
        <div className="p-6 space-y-6">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search creator items by name, creator, category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 font-bold border-slate-300 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-700" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-xs py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-medium font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Categories ({storefrontProducts.length})</option>
                {storefrontCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Storefront Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStorefront.map(item => {
              const ficPrice = item.price / 500;
              const burnFic = ficPrice * 0.10;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.imageUrl || item.images?.[0]}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold text-amber-500">★ {item.rating}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1 truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-700 truncate">{item.sellerName || 'Verified Merchant'}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-slate-900 dark:text-white font-mono">
                        ₦{item.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-orange-500">
                        {ficPrice.toLocaleString()} FIC
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-700">10% Protocol Burn</div>
                      <div className="text-[11px] font-mono font-bold text-rose-500">
                        -{burnFic.toFixed(2)} FIC
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DUAL CURRENCY & 10% BURN ENGINE */}
      {activeTab === 'burn' && (
        <div className="p-6 space-y-6">
          {/* Tokenomics Policy Overview */}
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-rose-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-orange-500 text-white">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Sovereign 10% FIC Burn & Peg Protocol Mechanism
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Permanent deflationary policy under the FingerMobile Protocol Act: Every platform e-commerce transaction automatically incinerates 10% of the settled FIC.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-700">Creator Revenue Split</div>
                <div className="text-2xl font-black text-emerald-500 mt-1">85.0%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Instant settlement to Creator FIC Wallet</div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-700">Deflationary Protocol Burn</div>
                <div className="text-2xl font-black text-rose-500 mt-1">10.0%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Permanent burn to dead address (0x0...dEaD)</div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-700">Protocol Operations Pool</div>
                <div className="text-2xl font-black text-blue-500 mt-1">5.0%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Network upkeep & node validation reward</div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Interactive Transaction Settlement Calculator
                </h4>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  Enter Purchase Amount:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={calcInputFic}
                    onChange={e => setCalcInputFic(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                  <select
                    value={calcSelectedCurrency}
                    onChange={e => setCalcSelectedCurrency(e.target.value as any)}
                    className="px-3 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="FIC">FIC (Infinite Coin)</option>
                    <option value="NGN">NGN (Nigerian Naira)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Equivalent Valuation:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {ficValue.toLocaleString()} FIC ≈ ₦{ngnValue.toLocaleString()} ($
                    {(ficValue * 0.5).toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between py-1 text-emerald-600 dark:text-emerald-400">
                  <span>Creator Receives (85%):</span>
                  <span className="font-mono font-bold">
                    {creatorPayoutFic.toFixed(2)} FIC (₦{(creatorPayoutFic * 500).toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between py-1 text-rose-600 dark:text-rose-400">
                  <span>Burned Immediately (10%):</span>
                  <span className="font-mono font-bold">
                    -{burnAmountFic.toFixed(2)} FIC (-₦{burnAmountNgn.toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between py-1 text-blue-600 dark:text-blue-400">
                  <span>Platform Operations (5%):</span>
                  <span className="font-mono font-bold">
                    {protocolFeeFic.toFixed(2)} FIC (₦{(protocolFeeFic * 500).toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            {/* Verifiable On-Chain Burn History */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  Recent Protocol Burn Proofs (Ledger)
                </h4>
                <span className="text-[10px] font-mono text-emerald-500">Live Validator Verified</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { tx: '0x8b19...74a2', amount: '30.00 FIC', item: 'Sovereign Keycard V3', time: '14:22 UTC' },
                  { tx: '0x3f91...10c8', amount: '5.00 FIC', item: 'Afrobeat Master Stem', time: '13:45 UTC' },
                  { tx: '0x94bb...83e1', amount: '96.00 FIC', item: 'Autonomous IoT Sentinel', time: '11:30 UTC' },
                  { tx: '0x12dc...65a0', amount: '1.70 FIC', item: 'Sovereign Creator Handbook', time: '10:15 UTC' },
                  { tx: '0x718a...229f', amount: '24.00 FIC', item: 'Cold Storage Vault', time: '09:05 UTC' },
                ].map((burn, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">{burn.tx}</div>
                      <div className="text-[10px] text-slate-700">{burn.item} • {burn.time}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                        -{burn.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS & ESCROW FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Active Order Book & Escrow Tracking</h3>
              <p className="text-xs text-slate-700">Multi-vendor orders settled via FIC and Nigerian Alternative Bank Rails</p>
            </div>
            <button
              onClick={() => showToast('Order receipts exported to PDF archive')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
            >
              Export Order Book
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] uppercase font-black tracking-wider text-slate-700 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order # / Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Item & Vendor</th>
                  <th className="py-3 px-4 text-right">Settlement Amount</th>
                  <th className="py-3 px-4 text-center">Payment Rail</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{o.orderNumber}</div>
                      <div className="text-[10px] text-slate-700">{o.date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{o.customerName}</div>
                      <div className="text-[10px] text-slate-700 font-mono">{o.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{o.itemTitle}</div>
                      <div className="text-[10px] text-slate-700 truncate">{o.vendorName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="font-black text-orange-600 dark:text-orange-400">{o.amountFic} FIC</div>
                      <div className="text-[10px] text-slate-700">₦{o.amountNgn.toLocaleString()}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        o.paymentMethod === 'FIC_TRANSFER'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {o.paymentMethod === 'FIC_TRANSFER' ? 'FIC SOVEREIGN' : 'ALT BANK NGN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'ESCROW_RELEASED'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300'
                          : o.status === 'DELIVERED'
                            ? 'bg-blue-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-blue-950 dark:text-blue-300'
                            : o.status === 'IN_TRANSIT'
                              ? 'bg-cyan-100 text-emerald-950 dark:bg-cyan-950 dark:text-cyan-300'
                              : 'bg-amber-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-amber-950 dark:text-amber-300'
                      }font-black`}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {o.status !== 'ESCROW_RELEASED' ? (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'ESCROW_RELEASED')}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                        >
                          Release Escrow
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-700 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: VENDOR STOREFRONT GOVERNANCE */}
      {activeTab === 'vendors' && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Storefront Vendor Registry & Flamingo Tier</h3>
              <p className="text-xs text-slate-700">Verified platform merchant accreditation and fee exemption controls</p>
            </div>
            <button
              onClick={() => showToast('Vendor accreditation report generated')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition shadow-xs"
            >
              Export Vendor Roster
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map(ven => (
              <div
                key={ven.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">{ven.name}</h4>
                    <p className="text-[11px] text-slate-700">{ven.owner}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ven.tier === 'FLAMINGO_VIP'
                      ? 'bg-rose-500 text-white font-mono'
                      : 'bg-blue-100 text-blue-950 border border-blue-400 font-bold dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {ven.tier.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-700">Total Sales</div>
                    <div className="font-bold text-slate-900 dark:text-white">{ven.salesCount} orders</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-700">Merchant Rating</div>
                    <div className="font-bold text-amber-500">★ {ven.rating} / 5.0</div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-700">Total Settled Volume</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {ven.gmvFic.toLocaleString()} FIC (₦{ven.gmvNgn.toLocaleString()})
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Biometric KYC Active
                  </span>
                  <a
                    href={`/storefronts/${ven.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-bold text-[11px] flex items-center gap-1"
                  >
                    View Store
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Restock Flagship Inventory
              </h3>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="text-slate-700 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Adding verified warehouse stock for <span className="font-bold text-slate-900 dark:text-white">{selectedProduct.name}</span>.
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Quantity to Add:
              </label>
              <input
                type="number"
                min="1"
                value={restockAmount}
                onChange={e => setRestockAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRestockProduct}
                className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterEcommerceConsole;
