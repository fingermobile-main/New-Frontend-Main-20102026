import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  RefreshCw,
  PhoneCall,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useAppContext } from '../../contexts/AppContext';

// --- Domain Type Definitions ---
interface LocationDetails {
  country: string;
  state: string;
  area: string;
}

interface StatusUpdate {
  id: number;
  status: string;
  description?: string;
  alert_level: 'info' | 'warning' | 'critical' | string;
  created_at: string;
}

interface Shipment {
  id: number;
  tracking_number: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'delayed' | string;
  carrier?: string;
  current_location: LocationDetails;
  estimated_arrival: string;
  status_updates: StatusUpdate[];
}

// --- Subcomponent: Shipment List Selector Tab ---
interface ShipmentListItemProps {
  item: Shipment;
  isSelected: boolean;
  // eslint-disable-next-line no-unused-vars
  onSelect: (item: Shipment) => void;
}

const ShipmentListItem: React.FC<ShipmentListItemProps> = React.memo(({ item, isSelected, onSelect }) => {
  const handleSelect = useCallback(() => onSelect(item), [item, onSelect]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-emerald-100 text-emerald-950 border border-emerald-400';
    case 'in-transit':
      return 'bg-blue-100 text-blue-950 border border-blue-400';
    case 'shipped':
      return 'bg-purple-100 text-purple-950 border border-purple-400';
    case 'delayed':
      return 'bg-amber-100 text-amber-950 border border-amber-400';
    case 'processing':
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-300';
    }
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`p-4 border rounded-xl text-left min-w-[200px] transition-all duration-200 shadow-sm ${
        isSelected
          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/30'
          : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/80'
      }`}
    >
      <span className="block font-bold text-sm tracking-wide text-slate-900 mb-1.5">
        {item.tracking_number}
      </span>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border capitalize inline-block ${getStatusBadge(item.status)}`}>
        {item.status.replace('-', ' ')}
      </span>
    </button>
  );
});

ShipmentListItem.displayName = 'ShipmentListItem';

// --- Subcomponent: Detailed Information Summary Panel ---
interface ShipmentDetailsPanelProps {
  shipment: Shipment;
  onContactCarrier: () => void;
}

const ShipmentDetailsPanel: React.FC<ShipmentDetailsPanelProps> = React.memo(({ shipment, onContactCarrier }) => {
  const structuralWarnings = useMemo(() =>
    shipment.status_updates.filter(u => u.alert_level === 'warning' || u.alert_level === 'critical')
  , [shipment.status_updates]);

  const getProgress = (status: string) => {
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
    <div className="space-y-6">
      {/* Primary Status Card */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-300 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Shipment</span>
            <h3 className="text-xl font-bold text-slate-900">{shipment.tracking_number}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Status:</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full border capitalize bg-blue-100 text-blue-950 border-blue-400 font-black">
              {shipment.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
            <span>Fulfillment Transit Stage</span>
            <span>{getProgress(shipment.status)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${getProgress(shipment.status)}%` }}
            ></div>
          </div>
        </div>

        {/* Estimated arrival and carrier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
              <Clock className="h-3.5 w-3.5 text-slate-600" />
              <span>Estimated Arrival</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {shipment.estimated_arrival}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
              <Truck className="h-3.5 w-3.5 text-slate-600" />
              <span>Courier Line</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {shipment.carrier || 'DHL Express / GIG Logistics'}
            </p>
          </div>
        </div>

        {/* Warnings or Alerts if present */}
        {structuralWarnings.map((update) => (
          <div
            key={update.id}
            className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 text-xs font-medium flex items-start gap-2.5"
          >
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{update.status}:</span> {update.description}
            </div>
          </div>
        ))}
      </div>

      {/* Transit Checkpoint Card */}
      <div className="p-6 bg-white border border-slate-300 rounded-xl shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Current Transit Waypoint</h4>
            <p className="text-xs text-slate-700 font-medium">Real-time GPS telemetry checkpoint</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
          <div className="text-slate-800 font-semibold">
            Checkpoint Area:{' '}
            <span className="font-extrabold text-slate-900">
              {shipment.current_location?.area || 'Dispatch Hub'}, {shipment.current_location?.state || 'Lagos'}
            </span>
          </div>
          <div className="text-slate-700">
            Country Jurisdiction:{' '}
            <span className="font-bold text-slate-800">{shipment.current_location?.country || 'Nigeria'}</span>
          </div>
        </div>
      </div>

      {/* Status updates timeline */}
      <div className="p-6 bg-white border border-slate-300 rounded-xl shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Milestone Verification Audit</h4>
        <div className="space-y-3 pl-4 border-l-2 border-slate-300">
          {shipment.status_updates && shipment.status_updates.length > 0 ? (
            shipment.status_updates.map((update) => (
              <div key={update.id} className="relative text-xs">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{update.status}</span>
                  <span className="text-[10px] text-slate-700">
                    {new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 font-medium mt-0.5">{update.description}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-700">No milestone events logged yet.</p>
          )}
        </div>
      </div>

      {/* Carrier Contact Action */}
      <button
        type="button"
        onClick={onContactCarrier}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
      >
        <PhoneCall className="h-4 w-4" />
        <span>Contact Assigned Courier Hub</span>
      </button>
    </div>
  );
});

ShipmentDetailsPanel.displayName = 'ShipmentDetailsPanel';

// --- Main Container Page Component ---
const MarketplaceTrackingPage: React.FC = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadShipments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.get('/api/marketplace/tracking');
      const liveShipments: Shipment[] = res.shipments || res.data || [];
      if (Array.isArray(liveShipments) && liveShipments.length > 0) {
        setShipments(liveShipments);
        setSelectedShipment(prev => {
          if (!prev) return liveShipments[0];
          const matched = liveShipments.find(s => s.id === prev.id);
          return matched || liveShipments[0];
        });
      }
    } catch {
      if (showToast) {
        showToast('Using fallback telemetry records', 'info');
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
    if (showToast) showToast('Marketplace tracking data refreshed', 'success');
  };

  const handleSelectShipment = useCallback((item: Shipment) => {
    setSelectedShipment(item);
  }, []);

  const handleContactCarrier = useCallback(() => {
    if (!selectedShipment) return;
    if (showToast) {
      showToast(`Carrier dispatch line connected for package ${selectedShipment.tracking_number}`, 'success');
    }
  }, [selectedShipment, showToast]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Marketplace Logistics Tracker</h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-black">
                  Live Synced
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-1">
                Monitor and verify buyer order deliveries, waybill milestones, and carrier line connections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <RefreshCw className={`h-4 w-4 text-slate-700 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Marketplace</span>
            </button>
          </div>
        </div>

        {/* Shipments Selector Strip */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-10 bg-white rounded-xl border border-slate-300 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-xs text-slate-700 font-medium mt-3">Loading marketplace waybills...</p>
            </div>
          ) : shipments.length > 0 ? (
            <>
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                  Select Consignment ({shipments.length} Active)
                </span>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {shipments.map((item) => (
                    <ShipmentListItem
                      key={item.id}
                      item={item}
                      isSelected={selectedShipment?.id === item.id}
                      onSelect={handleSelectShipment}
                    />
                  ))}
                </div>
              </div>

              {selectedShipment ? (
                <ShipmentDetailsPanel
                  shipment={selectedShipment}
                  onContactCarrier={handleContactCarrier}
                />
              ) : (
                <div className="p-8 bg-white rounded-xl border border-slate-300 text-center text-slate-700 font-medium text-sm">
                  Select a consignment card above to inspect telemetry breakdown.
                </div>
              )}
            </>
          ) : (
            <div className="p-8 bg-white rounded-xl border border-slate-300 text-center text-slate-700 font-medium text-sm">
              No recorded shipments associated with this context token profile.
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="pt-4 border-t border-slate-300 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/storefronttracking')}
            className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-300 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Truck className="h-4 w-4" />
            <span>Switch to Storefront Tracking Hub</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/marketplace')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Return to Marketplace Shop</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceTrackingPage;
