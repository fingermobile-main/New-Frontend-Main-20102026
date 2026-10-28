import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Compass
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import apiService from '../services/apiService';
import PlatformDomainManagementConsole, {
  COMMERCE_DOMAIN_KEYS,
} from '../components/dashboard/PlatformDomainManagementConsole';

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

const CARRIERS = ['DHL Express', 'GIG Logistics', 'FedEx Priority', 'UPS Worldwide', 'FingerCourier Node'];

export const StorefrontTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'logistics' | 'commerce-management'>('logistics');
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
    order_id: '',
    carrier: 'DHL Express',
    origin: '',
    destination: '',
    estimated_arrival: ''
  });

  // Update Status Form State
  const [statusForm, setStatusForm] = useState({
    status: 'in-transit',
    note: '',
    area: '',
    alert_level: 'info'
  });

  const loadShipments = useCallback(async (): Promise<boolean> => {
    try {
      const res = await apiService.get('/api/storefront/tracking');
      const liveShipments: TrackingShipment[] = Array.isArray(res.shipments)
        ? res.shipments
        : Array.isArray(res.data) ? res.data : [];
      setShipments(liveShipments);
      setSelectedShipment(prev => {
        if (!prev) return liveShipments[0] || null;
        return liveShipments.find(shipment => String(shipment.id) === String(prev.id)) || liveShipments[0] || null;
      });
      return true;
    } catch {
      setShipments([]);
      setSelectedShipment(null);
      if (showToast) {
        showToast('Unable to load shipment tracking data from the database.', 'error');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const refreshed = await loadShipments();
    setRefreshing(false);
    if (refreshed && showToast) showToast('Storefront tracking data refreshed', 'success');
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

  const shipmentStores = useMemo(
    () => Array.from(new Map(shipments.map(shipment => [shipment.storefront_id, shipment])).values()),
    [shipments],
  );

  // Aggregate KPI metrics
  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.status === 'in-transit').length;
    const delivered = shipments.filter(s => s.status === 'delivered').length;
    const delayed = shipments.filter(s => s.status === 'delayed').length;
    const processing = shipments.filter(s => s.status === 'processing' || s.status === 'shipped').length;
    const gmv = shipments.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const onTimeRate = total > 0 ? Math.round(((total - delayed) / total) * 100) : null;

    return {
      total,
      inTransit,
      delivered,
      delayed,
      processing,
      gmv,
      onTimeRate
    };
  }, [shipments]);

  // Dispatch New Shipment
  const handleDispatchShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShipment.order_id || !newShipment.carrier) {
      if (showToast) showToast('Enter an existing order ID and select a carrier.', 'error');
      return;
    }

    const payload = {
      order_id: newShipment.order_id,
      carrier: newShipment.carrier,
      status: 'processing',
      origin: newShipment.origin,
      destination: newShipment.destination,
      ...(newShipment.estimated_arrival ? { estimated_arrival: newShipment.estimated_arrival } : {})
    };

    try {
      const res = await apiService.post('/api/storefront/tracking', payload);
      const created: TrackingShipment = res.shipment || res.data;
      if (!created?.id || !created.tracking_number) {
        throw new Error('Shipment API returned no persisted shipment record');
      }
      await loadShipments();
      setIsDispatchModalOpen(false);
      if (showToast) showToast(`Dispatched package with tracking: ${created.tracking_number}`, 'success');
    } catch {
      if (showToast) showToast('Unable to dispatch shipment. Verify the order ID and retry.', 'error');
    }
  };

  // Update Shipment Status
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    const payload = {
      status: statusForm.status,
      note: statusForm.note,
      location: {
        ...selectedShipment.current_location,
        ...(statusForm.area ? { area: statusForm.area } : {})
      },
      alert_level: statusForm.alert_level
    };

    try {
      const res = await apiService.put(`/api/storefront/tracking/${selectedShipment.id}/status`, payload);
      const updatedShipment = res.shipment || res.data;
      if (updatedShipment) {
        const mergedShipment = { ...selectedShipment, ...updatedShipment };
        setShipments(prev => prev.map(s => (s.id === selectedShipment.id ? mergedShipment : s)));
        setSelectedShipment(mergedShipment);
      }
      setIsUpdateStatusModalOpen(false);
      if (showToast) showToast('Tracking status updated and broadcasted to customer', 'success');
    } catch {
      if (showToast) showToast('Unable to update shipment status in the database.', 'error');
    }
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
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      {/* Top Header Bar */}
      <header className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-300 p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              className="min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 text-slate-700 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDispatchModalOpen(true)}
              className="min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Dispatch Package</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        {/* Navigation Tabs & Platform Scope Strip */}
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'logistics' as const, label: 'Transit & Logistics Tracking', icon: Truck },
              { id: 'commerce-management' as const, label: 'Commerce Database Management', icon: Store },
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
        </div>

        {/* KPI Summary Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <span className="text-xs font-bold text-slate-700">Fulfillment SLA</span>
              <Clock className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {stats.onTimeRate === null ? '—' : `${stats.onTimeRate}%`}
            </div>
            <div className="text-[11px] text-slate-700 font-medium mt-1">
              {stats.onTimeRate === null ? 'No shipment history yet' : 'Based on database shipment records'}
            </div>
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
                    <Search className="h-4 w-4 text-slate-600" />
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
                    {shipmentStores.map(store => (
                      <option key={store.storefront_id} value={store.storefront_id}>
                        {store.storefront_name}
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
                          <div className="text-xs text-slate-700 font-medium py-2">No milestone logs recorded yet</div>
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

        {activeTab === 'commerce-management' && (
          <PlatformDomainManagementConsole
            domainKeys={COMMERCE_DOMAIN_KEYS}
            title="Commerce Ecosystem Database Management"
            description="Review and manage persisted Marketplace, Storefront, Flamingo, and OwnIt records directly in PostgreSQL. Lifecycle changes and database audit history are recorded by the Master Dashboard APIs."
          />
        )}

      </main>

      {/* MODAL 4: DISPATCH PACKAGE MODAL */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Dispatch New Merchant Shipment</h3>
              </div>
              <button aria-label="Close"
                type="button"
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDispatchShipment} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Existing Order ID</label>
                  <input
                    type="text"
                    required
                    placeholder="Paste the persisted order UUID"
                    value={newShipment.order_id}
                    onChange={e => setNewShipment({ ...newShipment, order_id: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white font-mono focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
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
                  <label className="block font-bold text-slate-900 mb-1">Origin</label>
                  <input
                    type="text"
                    value={newShipment.origin}
                    onChange={e => setNewShipment({ ...newShipment, origin: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
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
              <button aria-label="Close"
                type="button"
                onClick={() => setIsUpdateStatusModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded"
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

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
        <button
          onClick={() => setActiveTab('logistics')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
            activeTab === 'logistics' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
          title="Transit"
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Transit</span>
        </button>
        <button
          onClick={() => setActiveTab('commerce-management')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
            activeTab === 'commerce-management' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
          title="Commerce"
        >
          <Store className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-semibold mt-0.5">Commerce</span>
        </button>
        <button
          onClick={() => setIsDispatchModalOpen(true)}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Dispatch"
        >
          <Plus className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-semibold mt-0.5">Dispatch</span>
        </button>
        <button
          onClick={() => navigate('/storefronts')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Stores"
        >
          <Compass className="w-5 h-5 text-indigo-400" />
          <span className="text-[10px] font-semibold mt-0.5">Stores</span>
        </button>
      </div>
    </div>
  );
};

export default StorefrontTrackingPage;
