import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Package,
  Truck,
  Clock,
  Search,
  Plus,
  RefreshCw,
  Store,
  DollarSign,
  Copy,
  Check,
  X,
  Building,
  Trash2,
  Warehouse,
  TrendingUp,
  BarChart2,
  FileWarning,
  Layers
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import apiService from '../services/apiService';

// --- Domain Interface Schema Definitions ---
export interface StatusUpdate {
  id: number;
  status: string;
  description?: string;
  alert_level: 'info' | 'warning' | 'critical' | string;
  created_at: string;
}

export interface LocationDetails {
  country: string;
  state: string;
  area: string;
  lat?: number;
  lng?: number;
}

export interface ShipmentItem {
  title: string;
  qty: number;
  price: number;
}

export interface TrackingShipment {
  id: number | string;
  tracking_number: string;
  order_id: string;
  storefront_id: string;
  storefront_name: string;
  customer_name: string;
  carrier: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'delayed' | string;
  origin: string;
  destination: string;
  warehouse_bay?: string;
  current_location: LocationDetails;
  estimated_arrival: string;
  total: number;
  currency: string;
  items: ShipmentItem[];
  status_updates: StatusUpdate[];
}

export type PlatformType = 'all' | 'storefront' | 'marketplace' | 'ownit' | 'flamingo';

export interface StoreEntity {
  id: string;
  name: string;
  platform: 'storefront' | 'marketplace' | 'ownit' | 'flamingo';
  category: string;
  ownerName: string;
  ownerEmail: string;
  status: 'active' | 'suspended' | 'frozen' | 'flagged' | 'under_review';
  rating: number;
  productsCount: number;
  totalSales: number;
  salesGmv: number;
  commissionRate: number;
  warehouseHub: string;
  warningCount: number;
  createdAt: string;
}

export interface ProductEntity {
  id: string;
  title: string;
  storeId: string;
  storeName: string;
  platform: 'storefront' | 'marketplace' | 'ownit' | 'flamingo';
  category: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  isMasked: boolean;
  isCensored: boolean;
  isFlagged: boolean;
  warehouseLocation: string;
  salesCount: number;
  createdAt: string;
}

export interface WarehouseNode {
  id: string;
  name: string;
  region: string;
  capacityUtilization: number;
  activeShipments: number;
  stockUnits: number;
  leadCoordinator: string;
}

const INITIAL_STORES: StoreEntity[] = [
  {
    id: 'sf-1',
    name: 'Flamingo Fashion & Luxury Hub',
    platform: 'flamingo',
    category: 'Haute Couture & Apparel',
    ownerName: 'Amara Chioma',
    ownerEmail: 'amara@flamingofashion.ng',
    status: 'active',
    rating: 4.9,
    productsCount: 420,
    totalSales: 1240,
    salesGmv: 186000,
    commissionRate: 8.5,
    warehouseHub: 'Lagos Island MegaBay 01',
    warningCount: 0,
    createdAt: '2026-01-12'
  },
  {
    id: 'sf-2',
    name: 'Dancia Official Merch & Audio',
    platform: 'storefront',
    category: 'Media, Sound & Records',
    ownerName: 'Dancia Soundworks Ltd',
    ownerEmail: 'merch@dancia4tv.com',
    status: 'active',
    rating: 4.8,
    productsCount: 88,
    totalSales: 940,
    salesGmv: 94000,
    commissionRate: 10.0,
    warehouseHub: 'Abuja Central Transit Hub',
    warningCount: 0,
    createdAt: '2026-02-04'
  },
  {
    id: 'sf-3',
    name: 'Sovereign Tech & Wearables',
    platform: 'marketplace',
    category: 'Consumer Hardware & Crypto Pins',
    ownerName: 'Kalu Obasi',
    ownerEmail: 'kalu@sovereigntech.io',
    status: 'flagged',
    rating: 4.2,
    productsCount: 154,
    totalSales: 630,
    salesGmv: 142000,
    commissionRate: 7.0,
    warehouseHub: 'Port Harcourt Maritime Bay',
    warningCount: 1,
    createdAt: '2026-03-10'
  },
  {
    id: 'sf-4',
    name: 'OwnIt Authentic Estate & Collectibles',
    platform: 'ownit',
    category: 'Verified Luxury & Collectibles',
    ownerName: 'Emeka Sterling',
    ownerEmail: 'emeka@ownitcollectibles.org',
    status: 'frozen',
    rating: 4.1,
    productsCount: 62,
    totalSales: 210,
    salesGmv: 420000,
    commissionRate: 12.0,
    warehouseHub: 'International Air Courier Node',
    warningCount: 2,
    createdAt: '2026-04-18'
  },
  {
    id: 'sf-5',
    name: 'Lush Plushies & Comfort Gifts',
    platform: 'storefront',
    category: 'Care Packages & Gifting',
    ownerName: 'Ngozi Blessing',
    ownerEmail: 'ngozi@lushpressies.io',
    status: 'active',
    rating: 5.0,
    productsCount: 110,
    totalSales: 3120,
    salesGmv: 312000,
    commissionRate: 6.0,
    warehouseHub: 'Lagos Island MegaBay 01',
    warningCount: 0,
    createdAt: '2026-02-28'
  }
];

const INITIAL_PRODUCTS: ProductEntity[] = [
  {
    id: 'prod-101',
    title: 'Flamingo Emerald Silk Evening Robe',
    storeId: 'sf-1',
    storeName: 'Flamingo Fashion & Luxury Hub',
    platform: 'flamingo',
    category: 'Evening Wear',
    sku: 'FLAM-ROBE-001',
    price: 340,
    currency: 'FIC',
    stock: 85,
    isMasked: false,
    isCensored: false,
    isFlagged: false,
    warehouseLocation: 'Lagos Island MegaBay 01 / Aisle 4-B',
    salesCount: 128,
    createdAt: '2026-04-01'
  },
  {
    id: 'prod-102',
    title: 'Dancia High-Res Studio Vinyl Album',
    storeId: 'sf-2',
    storeName: 'Dancia Official Merch & Audio',
    platform: 'storefront',
    category: 'Audio Media',
    sku: 'DANC-VNYL-092',
    price: 120,
    currency: 'FIC',
    stock: 310,
    isMasked: false,
    isCensored: false,
    isFlagged: false,
    warehouseLocation: 'Abuja Central Transit Hub / Shelf 12',
    salesCount: 420,
    createdAt: '2026-04-05'
  },
  {
    id: 'prod-103',
    title: 'Biometric Camus Enclave Sovereign Key 256',
    storeId: 'sf-3',
    storeName: 'Sovereign Tech & Wearables',
    platform: 'marketplace',
    category: 'Hardware',
    sku: 'SOV-KEY-256',
    price: 490,
    currency: 'FIC',
    stock: 14,
    isMasked: false,
    isCensored: false,
    isFlagged: true,
    warehouseLocation: 'Port Harcourt Maritime Bay / Vault 02',
    salesCount: 88,
    createdAt: '2026-05-12'
  },
  {
    id: 'prod-104',
    title: 'Uncut Tanzanite Crystal Gemstone (Rare)',
    storeId: 'sf-4',
    storeName: 'OwnIt Authentic Estate & Collectibles',
    platform: 'ownit',
    category: 'Precious Stones',
    sku: 'OWN-TANZ-881',
    price: 3200,
    currency: 'FIC',
    stock: 2,
    isMasked: true,
    isCensored: false,
    isFlagged: true,
    warehouseLocation: 'International Air Courier Node / Safe 9',
    salesCount: 4,
    createdAt: '2026-06-01'
  },
  {
    id: 'prod-105',
    title: 'Sensory Comfort Velvet Plush Bear',
    storeId: 'sf-5',
    storeName: 'Lush Plushies & Comfort Gifts',
    platform: 'storefront',
    category: 'Gifts',
    sku: 'LUSH-BEAR-04',
    price: 80,
    currency: 'FIC',
    stock: 540,
    isMasked: false,
    isCensored: false,
    isFlagged: false,
    warehouseLocation: 'Lagos Island MegaBay 01 / Bay 08',
    salesCount: 910,
    createdAt: '2026-04-20'
  }
];

const WAREHOUSE_NODES: WarehouseNode[] = [
  {
    id: 'wh-1',
    name: 'Lagos Island MegaBay 01',
    region: 'Southwest Logistics Hub (Lagos)',
    capacityUtilization: 78,
    activeShipments: 142,
    stockUnits: 14200,
    leadCoordinator: 'Officer Tunde Balogun'
  },
  {
    id: 'wh-2',
    name: 'Abuja Central Transit Hub',
    region: 'Federal Capital Gateway (Abuja)',
    capacityUtilization: 62,
    activeShipments: 88,
    stockUnits: 9800,
    leadCoordinator: 'Officer Fatima Bello'
  },
  {
    id: 'wh-3',
    name: 'Port Harcourt Maritime Bay',
    region: 'South-South Freight Terminal (Rivers)',
    capacityUtilization: 49,
    activeShipments: 45,
    stockUnits: 6500,
    leadCoordinator: 'Officer Chidi Eze'
  },
  {
    id: 'wh-4',
    name: 'International Air Courier Node',
    region: 'MMIA Airway Express Transit Hub',
    capacityUtilization: 84,
    activeShipments: 94,
    stockUnits: 4300,
    leadCoordinator: 'Officer Marcus Vance'
  }
];

const CARRIERS = ['DHL Express', 'GIG Logistics', 'FedEx Priority', 'UPS Worldwide', 'FingerCourier Node'];

export const StorefrontTrackingPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'logistics' | 'stores' | 'products' | 'warehouses' | 'analytics'>('logistics');
  const [platformScope, setPlatformScope] = useState<PlatformType>('all');

  // Stores State
  const [stores, setStores] = useState<StoreEntity[]>(INITIAL_STORES);
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [targetStoreForWarning, setTargetStoreForWarning] = useState<StoreEntity | null>(null);

  // Products State
  const [products, setProducts] = useState<ProductEntity[]>(INITIAL_PRODUCTS);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Logistics / Shipments State
  const [shipments, setShipments] = useState<TrackingShipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<TrackingShipment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStorefront, setSelectedStorefront] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Logistics Modals
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState<boolean>(false);

  // New Shipment Form State
  const [newShipment, setNewShipment] = useState({
    customer_name: '',
    order_id: '',
    storefront_id: 'sf-1',
    carrier: 'DHL Express',
    origin: 'Flamingo Central Fulfillment Node',
    destination: '',
    warehouse_bay: 'Lagos Island MegaBay 01',
    estimated_arrival: '',
    item_title: '',
    item_qty: 1,
    item_price: 150,
    total: 150
  });

  // Update Status Form State
  const [statusForm, setStatusForm] = useState({
    status: 'in-transit',
    note: '',
    area: '',
    alert_level: 'info'
  });

  // New Store Form State
  const [newStoreForm, setNewStoreForm] = useState({
    name: '',
    platform: 'storefront' as 'storefront' | 'marketplace' | 'ownit' | 'flamingo',
    category: 'Fashion & Lifestyle',
    ownerName: '',
    ownerEmail: '',
    commissionRate: 8.0,
    warehouseHub: 'Lagos Island MegaBay 01'
  });

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    storeId: 'sf-1',
    category: 'Apparel',
    sku: '',
    price: 100,
    currency: 'FIC',
    stock: 50,
    warehouseLocation: 'Lagos Island MegaBay 01 / Bay 1'
  });

  const loadShipments = useCallback(async () => {
    try {
      const res = await apiService.get('/api/storefront/tracking');
      const liveShipments: TrackingShipment[] = res.shipments || res.data || [];

      if (Array.isArray(liveShipments) && liveShipments.length > 0) {
        setShipments(liveShipments);
        setSelectedShipment(prev => {
          if (!prev) return liveShipments[0];
          const matched = liveShipments.find(s => String(s.id) === String(prev.id));
          return matched || liveShipments[0];
        });
      }
    } catch {
      if (showToast) {
        showToast('Notice: Using local logistics fallback dataset', 'info');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadShipments();
    setRefreshing(false);
    if (showToast) showToast('Storefront tracking data refreshed', 'success');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    if (showToast) showToast(`Tracking number ${code} copied to clipboard`, 'info');
  };

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      const matchesStore = selectedStorefront === 'all' || shipment.storefront_id === selectedStorefront;
      const matchesStatus = statusFilter === 'all' || shipment.status.toLowerCase() === statusFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        shipment.tracking_number.toLowerCase().includes(q) ||
        shipment.order_id.toLowerCase().includes(q) ||
        shipment.customer_name.toLowerCase().includes(q) ||
        shipment.destination.toLowerCase().includes(q) ||
        shipment.storefront_name.toLowerCase().includes(q);

      return matchesStore && matchesStatus && matchesSearch;
    });
  }, [shipments, selectedStorefront, statusFilter, searchQuery]);

  // Filtered Stores
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesPlatform = platformScope === 'all' || store.platform === platformScope;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        store.name.toLowerCase().includes(q) ||
        store.ownerName.toLowerCase().includes(q) ||
        store.ownerEmail.toLowerCase().includes(q) ||
        store.category.toLowerCase().includes(q);
      return matchesPlatform && matchesSearch;
    });
  }, [stores, platformScope, searchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesPlatform = platformScope === 'all' || product.platform === platformScope;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.storeName.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      return matchesPlatform && matchesSearch;
    });
  }, [products, platformScope, searchQuery]);

  // Aggregate KPI metrics
  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.status === 'in-transit').length;
    const delivered = shipments.filter(s => s.status === 'delivered').length;
    const delayed = shipments.filter(s => s.status === 'delayed').length;
    const processing = shipments.filter(s => s.status === 'processing' || s.status === 'shipped').length;
    const gmv = shipments.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const onTimeRate = total > 0 ? Math.round(((total - delayed) / total) * 100) : 100;

    const totalStores = stores.length;
    const activeStores = stores.filter(s => s.status === 'active').length;
    const suspendedStores = stores.filter(s => s.status === 'suspended').length;
    const frozenStores = stores.filter(s => s.status === 'frozen').length;
    const totalPlatformGmv = stores.reduce((acc, s) => acc + s.salesGmv, 0);

    const totalProducts = products.length;
    const maskedProducts = products.filter(p => p.isMasked).length;
    const censoredProducts = products.filter(p => p.isCensored).length;

    return {
      total,
      inTransit,
      delivered,
      delayed,
      processing,
      gmv,
      onTimeRate,
      totalStores,
      activeStores,
      suspendedStores,
      frozenStores,
      totalPlatformGmv,
      totalProducts,
      maskedProducts,
      censoredProducts
    };
  }, [shipments, stores, products]);

  // Dispatch New Shipment
  const handleDispatchShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShipment.customer_name || !newShipment.destination) {
      if (showToast) showToast('Please enter customer name and destination', 'error');
      return;
    }

    const storeObj = stores.find(s => s.id === newShipment.storefront_id);
    const payload = {
      order_id: newShipment.order_id || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      storefront_id: newShipment.storefront_id,
      storefront_name: storeObj ? storeObj.name : 'Storefront Hub',
      customer_name: newShipment.customer_name,
      carrier: newShipment.carrier,
      status: 'processing',
      origin: newShipment.origin,
      destination: newShipment.destination,
      warehouse_bay: newShipment.warehouse_bay,
      estimated_arrival: newShipment.estimated_arrival || '2026-10-20',
      total: Number(newShipment.total) || 150,
      currency: 'FIC',
      items: [
        {
          title: newShipment.item_title || 'Storefront Merchant Package',
          qty: Number(newShipment.item_qty) || 1,
          price: Number(newShipment.item_price) || 150
        }
      ]
    };

    try {
      const res = await apiService.post('/api/storefront/tracking', payload);
      const created: TrackingShipment = res.shipment || res.data;
      if (created) {
        setShipments(prev => [created, ...prev]);
        setSelectedShipment(created);
      }
      setIsDispatchModalOpen(false);
      if (showToast) showToast(`Dispatched package with tracking: ${created.tracking_number}`, 'success');
    } catch {
      const fallbackId = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const fallbackShipment: TrackingShipment = {
        id: fallbackId,
        tracking_number: fallbackId,
        order_id: payload.order_id,
        storefront_id: payload.storefront_id,
        storefront_name: payload.storefront_name,
        customer_name: payload.customer_name,
        carrier: payload.carrier,
        status: 'processing',
        origin: payload.origin,
        destination: payload.destination,
        warehouse_bay: payload.warehouse_bay,
        current_location: { country: 'Nigeria', state: 'Lagos', area: 'Central Warehouse' },
        estimated_arrival: payload.estimated_arrival,
        total: payload.total,
        currency: 'FIC',
        items: payload.items,
        status_updates: [
          {
            id: Date.now(),
            status: 'Package Manifest Created & Label Generated',
            description: 'Item assigned to courier pickup queue',
            alert_level: 'info',
            created_at: new Date().toISOString()
          }
        ]
      };
      setShipments(prev => [fallbackShipment, ...prev]);
      setSelectedShipment(fallbackShipment);
      setIsDispatchModalOpen(false);
      if (showToast) showToast(`Locally created shipment ${fallbackId}`, 'success');
    }
  };

  // Update Shipment Status
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    const payload = {
      status: statusForm.status,
      description: statusForm.note,
      area: statusForm.area || selectedShipment.current_location.area,
      alert_level: statusForm.alert_level
    };

    try {
      const res = await apiService.put(`/api/storefront/tracking/${selectedShipment.id}/status`, payload);
      const updatedShipment = res.shipment || res.data;
      if (updatedShipment) {
        setShipments(prev => prev.map(s => (s.id === selectedShipment.id ? updatedShipment : s)));
        setSelectedShipment(updatedShipment);
      }
      setIsUpdateStatusModalOpen(false);
      if (showToast) showToast('Tracking status updated and broadcasted to customer', 'success');
    } catch {
      const updatedUpdates: StatusUpdate[] = [
        {
          id: Date.now(),
          status: statusForm.status.toUpperCase(),
          description: statusForm.note || `Carrier checkpoint reached: ${statusForm.area || 'Transit Depot'}`,
          alert_level: statusForm.alert_level,
          created_at: new Date().toISOString()
        },
        ...selectedShipment.status_updates
      ];

      const localUpdated: TrackingShipment = {
        ...selectedShipment,
        status: statusForm.status,
        current_location: {
          ...selectedShipment.current_location,
          area: statusForm.area || selectedShipment.current_location.area
        },
        status_updates: updatedUpdates
      };

      setShipments(prev => prev.map(s => (s.id === selectedShipment.id ? localUpdated : s)));
      setSelectedShipment(localUpdated);
      setIsUpdateStatusModalOpen(false);
      if (showToast) showToast('Local status update recorded successfully', 'success');
    }
  };

  // --- Store Admin Actions ---
  const handleToggleStoreStatus = (storeId: string, targetStatus: StoreEntity['status']) => {
    setStores(prev =>
      prev.map(s => (s.id === storeId ? { ...s, status: targetStatus } : s))
    );
    if (showToast) {
      showToast(`Store status updated to ${targetStatus.toUpperCase()}`, 'success');
    }
  };

  const handleIssueWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStoreForWarning) return;
    setStores(prev =>
      prev.map(s =>
        s.id === targetStoreForWarning.id
          ? { ...s, warningCount: s.warningCount + 1, status: s.warningCount >= 2 ? 'suspended' : s.status }
          : s
      )
    );
    setIsWarningModalOpen(false);
    setWarningMessage('');
    if (showToast) {
      showToast(`Official policy warning issued to ${targetStoreForWarning.name}`, 'warning');
    }
  };

  const handleDeleteStore = (storeId: string, storeName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete store "${storeName}"? All products will be unlisted.`)) {
      setStores(prev => prev.filter(s => s.id !== storeId));
      setProducts(prev => prev.filter(p => p.storeId !== storeId));
      if (showToast) showToast(`Store ${storeName} removed successfully`, 'success');
    }
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreForm.name || !newStoreForm.ownerName) {
      if (showToast) showToast('Please enter store name and owner', 'error');
      return;
    }
    const newStore: StoreEntity = {
      id: `sf-${Date.now()}`,
      name: newStoreForm.name,
      platform: newStoreForm.platform,
      category: newStoreForm.category,
      ownerName: newStoreForm.ownerName,
      ownerEmail: newStoreForm.ownerEmail || 'contact@merchant.ng',
      status: 'active',
      rating: 5.0,
      productsCount: 0,
      totalSales: 0,
      salesGmv: 0,
      commissionRate: Number(newStoreForm.commissionRate) || 8.0,
      warehouseHub: newStoreForm.warehouseHub,
      warningCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStores(prev => [newStore, ...prev]);
    setIsAddStoreModalOpen(false);
    setNewStoreForm({
      name: '',
      platform: 'storefront',
      category: 'Fashion & Lifestyle',
      ownerName: '',
      ownerEmail: '',
      commissionRate: 8.0,
      warehouseHub: 'Lagos Island MegaBay 01'
    });
    if (showToast) showToast(`New store "${newStore.name}" provisioned on ${newStore.platform.toUpperCase()}`, 'success');
  };

  // --- Product Admin Actions ---
  const handleToggleMaskProduct = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isMasked: !p.isMasked } : p))
    );
    const prod = products.find(p => p.id === productId);
    if (showToast) {
      showToast(`Product visibility ${prod?.isMasked ? 'unmasked (visible)' : 'masked (hidden from discovery)'}`, 'info');
    }
  };

  const handleToggleCensorProduct = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isCensored: !p.isCensored } : p))
    );
    const prod = products.find(p => p.id === productId);
    if (showToast) {
      showToast(`Product censorship status ${prod?.isCensored ? 'lifted' : 'enforced (censored/restricted)'}`, 'warning');
    }
  };

  const handleDeleteProduct = (productId: string, title: string) => {
    if (window.confirm(`Delete product "${title}" from catalog?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      if (showToast) showToast(`Product "${title}" removed from catalog`, 'success');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title || !newProductForm.sku) {
      if (showToast) showToast('Please enter title and SKU', 'error');
      return;
    }
    const storeObj = stores.find(s => s.id === newProductForm.storeId);
    const newProd: ProductEntity = {
      id: `prod-${Date.now()}`,
      title: newProductForm.title,
      storeId: newProductForm.storeId,
      storeName: storeObj ? storeObj.name : 'Merchant Storefront',
      platform: storeObj ? storeObj.platform : 'storefront',
      category: newProductForm.category,
      sku: newProductForm.sku,
      price: Number(newProductForm.price) || 100,
      currency: newProductForm.currency,
      stock: Number(newProductForm.stock) || 10,
      isMasked: false,
      isCensored: false,
      isFlagged: false,
      warehouseLocation: newProductForm.warehouseLocation,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProd, ...prev]);
    setIsAddProductModalOpen(false);
    setNewProductForm({
      title: '',
      storeId: 'sf-1',
      category: 'Apparel',
      sku: '',
      price: 100,
      currency: 'FIC',
      stock: 50,
      warehouseLocation: 'Lagos Island MegaBay 01 / Bay 1'
    });
    if (showToast) showToast(`Product "${newProd.title}" listed in warehouse inventory`, 'success');
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
    case 'delivered':
    case 'active':
      return 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold';
    case 'in-transit':
      return 'bg-blue-100 text-blue-950 border border-blue-300 font-bold';
    case 'shipped':
      return 'bg-purple-100 text-purple-950 border border-purple-300 font-bold';
    case 'delayed':
    case 'suspended':
    case 'under_review':
      return 'bg-amber-100 text-amber-950 border border-amber-300 font-bold';
    case 'frozen':
      return 'bg-cyan-100 text-cyan-950 border border-cyan-300 font-bold';
    case 'flagged':
      return 'bg-rose-100 text-rose-950 border border-rose-300 font-bold';
    case 'processing':
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-300 font-bold';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status.toLowerCase()) {
    case 'delivered':
      return 100;
    case 'in-transit':
      return 75;
    case 'shipped':
      return 50;
    case 'delayed':
      return 60;
    case 'processing':
    default:
      return 25;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-300 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-950 rounded-xl border border-emerald-300 shadow-xs">
              <Store className="h-7 w-7 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">E-Commerce & Storefront Sovereign Operations</h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-black">
                  Unified Admin
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-1">
                Full governance across Storefront, Marketplace, OwnIt & Flamingo — store administration, catalog moderation, transit logistics & warehouse dispatch.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RefreshCw className={`h-4 w-4 text-slate-700 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddStoreModalOpen(true)}
              className="px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Building className="h-4 w-4 text-blue-700" />
              <span>Add New Store</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(true)}
              className="px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Package className="h-4 w-4 text-purple-700" />
              <span>Create Product</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDispatchModalOpen(true)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Dispatch Package</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs & Platform Scope Strip */}
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'logistics', label: 'Transit & Logistics Tracking', icon: Truck },
              { id: 'stores', label: `Store Management (${stores.length})`, icon: Store },
              { id: 'products', label: `Product Catalog (${products.length})`, icon: Package },
              { id: 'warehouses', label: 'Warehouse & Bay Hubs', icon: Warehouse },
              { id: 'analytics', label: 'Sales & Revenue Analytics', icon: TrendingUp },
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Ecosystem Scope Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Ecosystem:
            </span>
            <select
              value={platformScope}
              onChange={e => setPlatformScope(e.target.value as PlatformType)}
              className="py-1.5 px-3 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ecosystems (Unified)</option>
              <option value="storefront">Storefront Network</option>
              <option value="marketplace">Decentralized Marketplace</option>
              <option value="ownit">OwnIt Luxury & Estates</option>
              <option value="flamingo">Flamingo Lifestyle Hub</option>
            </select>
          </div>
        </div>

        {/* KPI Summary Cards Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Active Shipments</span>
              <Package className="h-4 w-4 text-blue-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{stats.total}</div>
            <div className="text-[11px] text-slate-700 font-medium mt-1">In merchant pipeline</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Stores Registered</span>
              <Store className="h-4 w-4 text-purple-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalStores}</div>
            <div className="text-[11px] text-slate-700 font-medium mt-1">{stats.activeStores} Active • {stats.frozenStores} Frozen</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Products Cataloged</span>
              <Building className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalProducts}</div>
            <div className="text-[11px] text-slate-700 font-medium mt-1">{stats.maskedProducts} Masked • {stats.censoredProducts} Censored</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Dispatched GMV</span>
              <DollarSign className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {stats.gmv.toLocaleString()} <span className="text-xs text-slate-700 font-bold">FIC</span>
            </div>
            <div className="text-[11px] text-slate-700 font-medium mt-1">Active transit value</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Total Store GMV</span>
              <TrendingUp className="h-4 w-4 text-blue-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {(stats.totalPlatformGmv / 1000).toFixed(0)}k <span className="text-xs text-slate-700 font-bold">FIC</span>
            </div>
            <div className="text-[11px] text-slate-700 font-medium mt-1">All merchant revenues</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Fulfillment SLA</span>
              <Clock className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{stats.onTimeRate}%</div>
            <div className="text-[11px] text-slate-700 font-medium mt-1">On-time delivery index</div>
          </div>
        </div>

        {/* TAB 1: TRANSIT & LOGISTICS TRACKING */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            {/* Filters and Search Strip */}
            <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                <div className="md:col-span-5 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by Tracking Code, Order ID, Customer, or Destination..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                </div>

                <div className="md:col-span-4 flex items-center gap-2">
                  <Store className="h-4 w-4 text-slate-600 shrink-0" />
                  <select
                    value={selectedStorefront}
                    onChange={e => setSelectedStorefront(e.target.value)}
                    className="w-full py-2 px-3 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Storefronts & Platforms</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name} ({store.platform.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full py-2 px-3 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="in-transit">In-Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="delayed">Delayed / Exception</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Interactive Dual-Panel Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Panel: Shipments List Table */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-300 bg-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-700" />
                    <span>Dispatched Shipments Pipeline</span>
                  </h3>
                  <span className="text-xs text-slate-700 font-bold">
                    Showing {filteredShipments.length} of {shipments.length} Records
                  </span>
                </div>

                <div className="overflow-x-auto flex-1 max-h-[620px] overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center text-slate-700">Loading logistics telemetry...</div>
                  ) : filteredShipments.length === 0 ? (
                    <div className="p-8 text-center text-slate-700">No shipments found matching criteria</div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 sticky top-0 z-10">
                        <tr>
                          <th className="py-3 px-4">Tracking Code</th>
                          <th className="py-3 px-4">Merchant Store</th>
                          <th className="py-3 px-4">Carrier</th>
                          <th className="py-3 px-4">Destination</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredShipments.map(s => {
                          const isSelected = selectedShipment?.id === s.id;
                          return (
                            <tr
                              key={s.id}
                              onClick={() => setSelectedShipment(s)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-blue-50/80 hover:bg-blue-100/70' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="py-3 px-4 font-mono font-bold text-blue-700">
                                {s.tracking_number}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900 truncate max-w-[130px]">
                                {s.storefront_name}
                              </td>
                              <td className="py-3 px-4 text-slate-800 font-medium">{s.carrier}</td>
                              <td className="py-3 px-4 text-slate-800 font-medium truncate max-w-[120px]">
                                {s.destination}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusBadge(s.status)}`}>
                                  {s.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-black text-slate-900 font-mono">
                                {s.total} {s.currency}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Right Panel: Selected Shipment Deep Detail */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-300 shadow-xs p-5 flex flex-col">
                {selectedShipment ? (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-300">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900 font-mono">{selectedShipment.tracking_number}</h4>
                          <button
                            onClick={() => handleCopy(selectedShipment.tracking_number)}
                            className="p-1 text-slate-600 hover:text-slate-900 rounded"
                            title="Copy code"
                          >
                            {copiedCode === selectedShipment.tracking_number ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">Order: <strong className="text-slate-900">{selectedShipment.order_id}</strong></p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold border ${getStatusBadge(selectedShipment.status)}`}>
                        {selectedShipment.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-700 font-bold mb-1.5">
                        <span>Fulfillment Journey</span>
                        <span>{getProgressPercentage(selectedShipment.status)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border text-slate-950 border-slate-400 font-black">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(selectedShipment.status)}%` }}
                        />
                      </div>
                    </div>

                    {/* Route Details Box */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-300 text-xs">
                      <div>
                        <span className="text-slate-600 font-medium block">Origin Fulfillment Hub</span>
                        <strong className="text-slate-900 font-bold">{selectedShipment.origin}</strong>
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium block">Destination Address</span>
                        <strong className="text-slate-900 font-bold">{selectedShipment.destination}</strong>
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium block">Warehouse Bay Allocation</span>
                        <strong className="text-blue-700 font-bold">{selectedShipment.warehouse_bay || 'Central Sorting Bay 02'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium block">Estimated Arrival</span>
                        <strong className="text-slate-900 font-bold">{selectedShipment.estimated_arrival}</strong>
                      </div>
                    </div>

                    {/* Waypoint History */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Transit Waypoints & Telemetry</h5>
                        <button
                          onClick={() => setIsUpdateStatusModalOpen(true)}
                          className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-300"
                        >
                          + Log Status Milestone
                        </button>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {selectedShipment.status_updates && selectedShipment.status_updates.length > 0 ? (
                          selectedShipment.status_updates.map(up => (
                            <div key={up.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-900">{up.status}</span>
                                <span className="text-[10px] text-slate-600 font-mono">
                                  {new Date(up.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              {up.description && <p className="text-slate-700 font-medium mt-0.5">{up.description}</p>}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-500 py-2">No milestone logs recorded yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-600">Select a shipment to inspect telemetry</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORE MANAGEMENT & MULTI-STORE DIRECTORY */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Multi-Ecosystem Store Directory & Governance</h3>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  Manage merchant stores across Storefront, Marketplace, OwnIt, and Flamingo with executive authority.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStoreModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Store</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-3 px-4">Store ID & Name</th>
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Merchant Owner</th>
                      <th className="py-3 px-4">Warehouse Hub</th>
                      <th className="py-3 px-4">Sales GMV</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Administrative Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredStores.map(st => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{st.name}</div>
                          <div className="font-mono text-[10px] text-slate-600">{st.id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-300">
                            {st.platform}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{st.category}</td>
                        <td className="py-3 px-4">
                          <div className="text-slate-900 font-bold">{st.ownerName}</div>
                          <div className="text-[10px] text-slate-600">{st.ownerEmail}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{st.warehouseHub}</td>
                        <td className="py-3 px-4 font-black text-slate-900 font-mono">
                          {st.salesGmv.toLocaleString()} FIC
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(st.status)}`}>
                            {st.status}
                          </span>
                          {st.warningCount > 0 && (
                            <span className="ml-1 text-[10px] font-bold text-amber-700">({st.warningCount} W)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {st.status === 'active' ? (
                              <>
                                <button
                                  onClick={() => handleToggleStoreStatus(st.id, 'suspended')}
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-400 font-bold  border-amber-300 rounded  text-[10px]"
                                  title="Suspend Checkout"
                                >
                                  Suspend
                                </button>
                                <button
                                  onClick={() => handleToggleStoreStatus(st.id, 'frozen')}
                                  className="px-2 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 rounded font-bold text-[10px]"
                                  title="Freeze Payouts & Store"
                                >
                                  Freeze
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleToggleStoreStatus(st.id, 'active')}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold  border-emerald-300 rounded  text-[10px]"
                                title="Reactivate Store"
                              >
                                Reactivate
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setTargetStoreForWarning(st);
                                setIsWarningModalOpen(true);
                              }}
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-400 font-bold  border-purple-300 rounded  text-[10px]"
                              title="Issue Warning"
                            >
                              Warn
                            </button>
                            <button
                              onClick={() => handleToggleStoreStatus(st.id, 'flagged')}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded font-bold text-[10px]"
                              title="Flag for Compliance Audit"
                            >
                              Flag
                            </button>
                            <button
                              onClick={() => handleDeleteStore(st.id, st.name)}
                              className="p-1 text-slate-500 hover:text-red-700 rounded transition-colors"
                              title="Remove Store"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT INVENTORY & CONTENT MODERATION */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Product Catalog Management & Content Moderation</h3>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  Administrative oversight: Create new products, edit listings, mask search visibility, censor sensitive items, and track stock.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Product</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-3 px-4">Product Title & SKU</th>
                      <th className="py-3 px-4">Storefront Merchant</th>
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Warehouse Location</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Moderation Badges</th>
                      <th className="py-3 px-4 text-right">Moderator Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{prod.title}</div>
                          <div className="font-mono text-[10px] text-slate-600">{prod.sku}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">{prod.storeName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-300">
                            {prod.platform}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{prod.warehouseLocation}</td>
                        <td className="py-3 px-4 font-black text-slate-900 font-mono">
                          {prod.price} {prod.currency}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${prod.stock < 20 ? 'text-amber-700' : 'text-slate-900'}`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {prod.isMasked && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                                MASKED
                              </span>
                            )}
                            {prod.isCensored && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                                CENSORED
                              </span>
                            )}
                            {prod.isFlagged && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                FLAGGED
                              </span>
                            )}
                            {!prod.isMasked && !prod.isCensored && !prod.isFlagged && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleMaskProduct(prod.id)}
                              className={`px-2 py-1 rounded font-bold text-[10px] border ${
                                prod.isMasked
                                  ? 'bg-purple-100 text-purple-900 border-purple-400'
                                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                              }`}
                              title={prod.isMasked ? 'Unmask product' : 'Mask product from public view'}
                            >
                              {prod.isMasked ? 'Unmask' : 'Mask'}
                            </button>
                            <button
                              onClick={() => handleToggleCensorProduct(prod.id)}
                              className={`px-2 py-1 rounded font-bold text-[10px] border ${
                                prod.isCensored
                                  ? 'bg-rose-100 text-rose-900 border-rose-400'
                                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                              }`}
                              title={prod.isCensored ? 'Lift censorship' : 'Censor product contents'}
                            >
                              {prod.isCensored ? 'Uncensor' : 'Censor'}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.title)}
                              className="p-1 text-slate-500 hover:text-red-700 rounded transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WAREHOUSES & INVENTORY HANDLING */}
        {activeTab === 'warehouses' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs">
              <h3 className="text-base font-black text-slate-900">Regional Fulfillment Nodes & Warehouse Bays</h3>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                Real-time inventory bays, storage capacity metrics, package handling coordinators, and transit origin hubs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {WAREHOUSE_NODES.map(wh => (
                <div key={wh.id} className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                      <Warehouse className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-bold text-slate-700">{wh.capacityUtilization}% Capacity</span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{wh.name}</h4>
                    <p className="text-[11px] text-slate-700 font-medium">{wh.region}</p>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border text-slate-950 border-slate-400 font-black">
                    <div
                      className={`h-2 rounded-full ${
                        wh.capacityUtilization > 80 ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${wh.capacityUtilization}%` }}
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Active Shipments:</span>
                      <strong className="text-slate-900 font-bold">{wh.activeShipments}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Stocked Units:</span>
                      <strong className="text-slate-900 font-bold">{wh.stockUnits.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Coordinator:</span>
                      <strong className="text-blue-700 font-bold">{wh.leadCoordinator}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SALES & REVENUE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs">
              <h3 className="text-base font-black text-slate-900">E-Commerce & Multi-Store Revenue Analytics</h3>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                Breakdown of sales metrics, commission yields, merchant performance, and product transaction logs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Store Performance Breakdown */}
              <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-xs">
                <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-700" />
                  <span>Storefront Revenue Breakdown</span>
                </h4>
                <div className="space-y-3">
                  {stores.map(st => (
                    <div key={st.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-600">{st.totalSales} Orders completed</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-xs text-slate-900">{st.salesGmv.toLocaleString()} FIC</div>
                        <div className="text-[10px] text-emerald-700 font-bold">{(st.salesGmv * (st.commissionRate / 100)).toFixed(0)} FIC Comm.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Products Breakdown */}
              <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-xs">
                <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-700" />
                  <span>Top Product Sales Velocity</span>
                </h4>
                <div className="space-y-3">
                  {products.map(p => (
                    <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{p.title}</div>
                        <div className="text-[11px] text-slate-600">{p.storeName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-xs text-blue-700">{p.salesCount} Sold</div>
                        <div className="text-[10px] text-slate-600 font-bold">{(p.salesCount * p.price).toLocaleString()} FIC Total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD NEW STORE MODAL */}
      {isAddStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Add New Sovereign Store</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStoreModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStore} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Store / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flamingo Luxury Leather Hub"
                  value={newStoreForm.name}
                  onChange={e => setNewStoreForm({ ...newStoreForm, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Platform</label>
                  <select
                    value={newStoreForm.platform}
                    onChange={e => setNewStoreForm({ ...newStoreForm, platform: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="storefront">Storefront Network</option>
                    <option value="marketplace">Decentralized Marketplace</option>
                    <option value="ownit">OwnIt Luxury Collectibles</option>
                    <option value="flamingo">Flamingo Lifestyle Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newStoreForm.category}
                    onChange={e => setNewStoreForm({ ...newStoreForm, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Merchant Principal"
                    value={newStoreForm.ownerName}
                    onChange={e => setNewStoreForm({ ...newStoreForm, ownerName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Owner Email</label>
                  <input
                    type="email"
                    placeholder="owner@domain.ng"
                    value={newStoreForm.ownerEmail}
                    onChange={e => setNewStoreForm({ ...newStoreForm, ownerEmail: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={newStoreForm.commissionRate}
                    onChange={e => setNewStoreForm({ ...newStoreForm, commissionRate: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Warehouse Hub</label>
                  <select
                    value={newStoreForm.warehouseHub}
                    onChange={e => setNewStoreForm({ ...newStoreForm, warehouseHub: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {WAREHOUSE_NODES.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-100 px-5 py-3 -mx-5 -mb-5 mt-4 border-t border-slate-300 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStoreModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-800 bg-white hover:bg-slate-200 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs"
                >
                  Provision Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Create & List New Product</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handmade Leather Loafers"
                  value={newProductForm.title}
                  onChange={e => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Store Assignment</label>
                  <select
                    value={newProductForm.storeId}
                    onChange={e => setNewProductForm({ ...newProductForm, storeId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {stores.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">SKU / Item Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SK-ITEM-009"
                    value={newProductForm.sku}
                    onChange={e => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white font-mono focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Price</label>
                  <input
                    type="number"
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({ ...newProductForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Currency</label>
                  <select
                    value={newProductForm.currency}
                    onChange={e => setNewProductForm({ ...newProductForm, currency: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="FIC">FIC</option>
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={newProductForm.stock}
                    onChange={e => setNewProductForm({ ...newProductForm, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Warehouse Bay Allocation</label>
                <input
                  type="text"
                  placeholder="e.g. Lagos Island MegaBay 01 / Bay 4"
                  value={newProductForm.warehouseLocation}
                  onChange={e => setNewProductForm({ ...newProductForm, warehouseLocation: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div className="bg-slate-100 px-5 py-3 -mx-5 -mb-5 mt-4 border-t border-slate-300 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-800 bg-white hover:bg-slate-200 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs"
                >
                  List Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ISSUE WARNING MODAL */}
      {isWarningModalOpen && targetStoreForWarning && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-300 shadow-2xl overflow-hidden">
            <div className="bg-amber-900 text-white p-4 flex items-center justify-between border-b border-amber-800">
              <div className="flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm text-white">Issue Official Policy Warning</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWarningModalOpen(false)}
                className="text-amber-200 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleIssueWarning} className="p-5 space-y-4 text-xs">
              <p className="text-slate-700 font-medium">
                Issuing warning to <strong className="text-slate-900">{targetStoreForWarning.name}</strong>. Reaching 3 warnings automatically suspends store transactions.
              </p>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Violation Notice & Corrective Action</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail policy breach (e.g. unauthorized brand replica, SLA fulfillment delinquency, or unverified contact)..."
                  value={warningMessage}
                  onChange={e => setWarningMessage(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWarningModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-800 bg-white hover:bg-slate-200 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold shadow-xs"
                >
                  Send Official Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DISPATCH PACKAGE MODAL */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Dispatch New Merchant Shipment</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDispatchShipment} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={newShipment.customer_name}
                    onChange={e => setNewShipment({ ...newShipment, customer_name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Order Identifier</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={newShipment.order_id}
                    onChange={e => setNewShipment({ ...newShipment, order_id: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white font-mono focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Store / Merchant Source</label>
                  <select
                    value={newShipment.storefront_id}
                    onChange={e => setNewShipment({ ...newShipment, storefront_id: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {stores.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Logistics Carrier</label>
                  <select
                    value={newShipment.carrier}
                    onChange={e => setNewShipment({ ...newShipment, carrier: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {CARRIERS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Destination Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    value={newShipment.destination}
                    onChange={e => setNewShipment({ ...newShipment, destination: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Warehouse Bay Hub</label>
                  <select
                    value={newShipment.warehouse_bay}
                    onChange={e => setNewShipment({ ...newShipment, warehouse_bay: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {WAREHOUSE_NODES.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Package Title</label>
                  <input
                    type="text"
                    placeholder="Merchant goods"
                    value={newShipment.item_title}
                    onChange={e => setNewShipment({ ...newShipment, item_title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Item Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={newShipment.item_qty}
                    onChange={e => setNewShipment({ ...newShipment, item_qty: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Total (FIC)</label>
                  <input
                    type="number"
                    value={newShipment.total}
                    onChange={e => setNewShipment({ ...newShipment, total: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-100 px-5 py-3 -mx-5 -mb-5 mt-4 border-t border-slate-300 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-800 bg-white hover:bg-slate-200 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs"
                >
                  Dispatch Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: UPDATE STATUS MILESTONE MODAL */}
      {isUpdateStatusModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-300 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Log Transit Milestone</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdateStatusModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateStatus} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-900 mb-1">New Package Status</label>
                <select
                  value={statusForm.status}
                  onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="processing">Processing (Manifest Generated)</option>
                  <option value="shipped">Shipped (Departed Merchant Node)</option>
                  <option value="in-transit">In-Transit (Courier Highway Checkpoint)</option>
                  <option value="delayed">Delayed (Exception Alert)</option>
                  <option value="delivered">Delivered (Confirmed by Recipient)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Current Area / Waypoint</label>
                <input
                  type="text"
                  placeholder="e.g. Lagos Mainland Toll Hub"
                  value={statusForm.area}
                  onChange={e => setStatusForm({ ...statusForm, area: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Milestone Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Package cleared regional customs inspection"
                  value={statusForm.note}
                  onChange={e => setStatusForm({ ...statusForm, note: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUpdateStatusModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-800 bg-white hover:bg-slate-200 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs"
                >
                  Broadcast Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontTrackingPage;
