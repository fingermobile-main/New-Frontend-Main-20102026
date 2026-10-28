import React, { useEffect, useState, useCallback } from 'react';
import apiService from '../services/apiService';
// --- Domain Interface Schema Definitions ---
interface StatusUpdate {
  id: number;
  status: string;
  description?: string;
  alert_level: 'info' | 'warning' | 'success' | string;
  created_at: string;
}

interface LocationDetails {
  country: string;
  state: string;
  area: string;
}

interface Shipment {
  id: number;
  tracking_number: string;
  status: 'processing' | 'shipped' | 'delivered' | 'in-transit' | string;
  current_location: LocationDetails;
  estimated_arrival: string;
  status_updates: StatusUpdate[];
}

// --- Subcomponent: Tracking Timeline History ---
interface TrackingTimelineProps {
  updates: StatusUpdate[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = React.memo(({ updates }) => {
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div style={styles.timelineContainer}>
      <h3 style={styles.sectionTitle}>Activity History</h3>
      <div style={styles.timelineList}>
        {sortedUpdates.map((update, idx) => {
          const isLatest = idx === 0;
          return (
            <div key={update.id} style={styles.timelineItem}>
              <div style={styles.timelineTrack}>
                <div style={{
                  ...styles.timelineNode,
                  backgroundColor: isLatest ? '#ff6b9d' : '#cbd5e1'
                }} />
                {idx !== sortedUpdates.length - 1 && <div style={styles.timelineLine} />}
              </div>
              <div style={styles.timelineContent}>
                <div style={styles.timelineHeaderBlock}>
                  <span style={{
                    ...styles.timelineStatus,
                    color: isLatest ? '#ff6b9d' : '#1e293b',
                    fontWeight: isLatest ? 'bold' : '600'
                  }}>
                    {update.status}
                  </span>
                  <span style={styles.timelineTime}>
                    {new Date(update.created_at).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p style={styles.timelineDescription}>{update.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

TrackingTimeline.displayName = 'TrackingTimeline';

// --- Main Page Component Container ---
const OwnitTrackingPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const loadShipments = useCallback(async () => {
    try {
      const res = await apiService.get('/ownit/orders');
      let loadedShipments: Shipment[] = [];

      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        loadedShipments = res.data.map((order: any, idx: number) => ({
          id: order.id || idx + 1,
          tracking_number: order.tracking_number || `OWNIT-${100000000 + idx}`,
          status: order.shipping_status || order.status || 'in-transit',
          current_location: {
            country: 'NG',
            state: order.shipping_address?.city || 'Lagos',
            area: order.shipping_address?.address || 'Victoria Island'
          },
          estimated_arrival: order.delivery_date || new Date(Date.now() + 86400000 * 3).toISOString(),
          status_updates: [
            {
              id: 1,
              status: 'shipped',
              description: `Order processed by ${order.seller_name || 'OwnIt Dispatch'}`,
              alert_level: 'info',
              created_at: order.order_date || new Date().toISOString()
            },
            {
              id: 2,
              status: order.shipping_status || 'in-transit',
              description: `Package assigned tracking code ${order.tracking_number || 'OWNIT-123456789'}`,
              alert_level: 'success',
              created_at: new Date().toISOString()
            }
          ]
        }));
      } else {
        // Fallback demo shipment
        loadedShipments = [
          {
            id: 1,
            tracking_number: 'OWNIT-123456789',
            status: 'in-transit',
            current_location: { country: 'NG', state: 'Lagos', area: 'Marina' },
            estimated_arrival: new Date(Date.now() + 86400000 * 2).toISOString(),
            status_updates: [
              {
                id: 1,
                status: 'shipped',
                description: 'Package has been dispatched via FingerExpress',
                alert_level: 'info',
                created_at: new Date(Date.now() - 86400000).toISOString()
              },
              {
                id: 2,
                status: 'in-transit',
                description: 'Arrived at Lagos Island sorting hub',
                alert_level: 'info',
                created_at: new Date().toISOString()
              }
            ]
          }
        ];
      }

      setShipments(loadedShipments);

      // Keep selection synced during data refreshes
      if (loadedShipments.length > 0) {
        setSelectedShipment(prev => {
          const match = loadedShipments.find(s => s.id === prev?.id);
          return match || loadedShipments[0];
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading shipments registry:', error);
    }
  }, []);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadShipments();
    setRefreshing(false);
  }, [loadShipments]);

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 pb-28 md:pb-12 font-sans">
      <header className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto mb-6 pb-5 border-b border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Ownit Purchase Tracking</h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">Monitor delivery status parameters across active dispatches</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] bg-white text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-50 transition active:scale-95 flex items-center justify-center shadow-xs"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </button>
          <button
            type="button"
            aria-label="Create new purchase"
            onClick={() => window.location.assign('/store')}
            className="flex-1 sm:flex-none px-5 py-2.5 min-h-[44px] bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs sm:text-sm font-black transition active:scale-95 shadow-md shadow-rose-500/20 flex items-center justify-center"
          >
            New Purchase
          </button>
        </div>
      </header>

      <main className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto">
        {shipments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-6 items-start">
            {/* Sidebar Navigation Matrix */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Consignments ({shipments.length})</h2>
              {/* Horizontal scroller on mobile, vertical stack on desktop */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none flex-nowrap lg:flex-wrap">
                {shipments.map((item) => {
                  const isSelected = selectedShipment?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedShipment(item)}
                      className={`min-w-[260px] lg:min-w-0 p-4 rounded-xl border text-left transition-all outline-none shrink-0 lg:shrink active:scale-95 min-h-[44px] ${
                        isSelected
                          ? 'border-rose-400 bg-rose-50/80 shadow-md shadow-rose-500/10'
                          : 'border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2 gap-2">
                        <span className="font-black text-sm text-slate-900 tracking-tight">{item.tracking_number}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
                          item.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : 'bg-sky-100 text-sky-950 border border-sky-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="block text-xs text-slate-700 font-medium">
                        Current: {item.current_location?.area}, {item.current_location?.state}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Comprehensive Tracking Display Segment */}
            <section className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
              {selectedShipment ? (
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-4 border-b border-slate-200">
                    <div>
                      <span className="block text-xs font-bold text-slate-700 uppercase mb-1">Tracking Reference</span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">{selectedShipment.tracking_number}</h2>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Delivery Target</span>
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {new Date(selectedShipment.estimated_arrival).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-8 bg-slate-100 rounded-xl text-center border border-dashed border-slate-300 mb-6 sm:mb-8">
                    <div className="text-2xl mb-2">📍</div>
                    <p className="m-0 mb-1 font-bold text-sm text-slate-800">Telemetry Geolocation Node Display</p>
                    <p className="m-0 text-xs text-slate-700 font-medium">
                      Coordinates: {selectedShipment.current_location?.area}, {selectedShipment.current_location?.state}, {selectedShipment.current_location?.country}
                    </p>
                  </div>

                  <TrackingTimeline updates={selectedShipment.status_updates} />
                </div>
              ) : (
                <div className="p-12 text-center text-slate-700 text-sm">
                  <p>Select an active tracking number profile to populate matrix details.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-300">
            <p className="text-slate-700 text-sm sm:text-base font-medium m-0">No logistical records attached to this consumer registry profile.</p>
          </div>
        )}
      </main>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="ownit-tracking-mobile-dock"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl px-4 py-2 pb-safe"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl text-slate-700 hover:text-slate-900 active:scale-95 transition"
          >
            <span className="text-base mb-0.5">🔄</span>
            <span className="text-[11px] font-bold leading-tight">Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl text-rose-600 font-bold bg-rose-50"
          >
            <span className="text-base mb-0.5">📦</span>
            <span className="text-[11px] leading-tight">Shipments</span>
          </button>
          <button
            type="button"
            onClick={() => window.location.assign('/store')}
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black shadow-md shadow-rose-500/20 active:scale-95 transition"
          >
            <span className="text-base mb-0.5">🛍️</span>
            <span className="text-[11px] leading-tight">New Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Structural Stylesheet Declarations ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    maxWidth: '1680px',
    margin: '0 auto 24px auto',
    paddingBottom: '20px',
    borderBottom: '1px solid #cbd5e1'
  },
  headerActionBlock: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.025em'
  },
  subtitle: {
    fontSize: '14px',
    color: '#334155',
    fontWeight: '500',
    margin: '4px 0 0 0'
  },
  content: {
    maxWidth: '1680px',
    margin: '0 auto'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 340px) 1fr',
    gap: '24px',
    alignItems: 'start'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#64748b',
    margin: '0 0 4px 0'
  },
  shipmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  shipmentItem: {
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  selectedShipmentItem: {
    borderColor: '#ff6b9d',
    backgroundColor: '#fff1f5',
    boxShadow: '0 2px 8px rgba(255, 107, 157, 0.08)'
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '8px'
  },
  trackingNumber: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#1e293b'
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  statusTransit: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1'
  },
  statusDelivered: {
    backgroundColor: '#dcfce7',
    color: '#15803d'
  },
  locationSummary: {
    display: 'block',
    fontSize: '12px',
    color: '#64748b'
  },
  mainDisplay: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  },
  detailsCard: {
    padding: '24px'
  },
  detailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px'
  },
  metaLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  metaLabelRight: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: '4px',
    textAlign: 'right'
  },
  mainTrackingTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  etaBlock: {
    textAlign: 'right'
  },
  etaValue: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a'
  },
  mapPlaceholder: {
    padding: '32px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px dashed #cbd5e1',
    marginBottom: '28px'
  },
  mapIcon: {
    fontSize: '24px',
    marginBottom: '8px'
  },
  mapTextPrimary: {
    margin: '0 0 4px 0',
    fontWeight: '700',
    fontSize: '14px',
    color: '#334155'
  },
  mapTextSecondary: {
    margin: 0,
    fontSize: '12px',
    color: '#64748b'
  },
  timelineContainer: {
    marginTop: '12px'
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '16px'
  },
  timelineItem: {
    display: 'flex',
    gap: '16px'
  },
  timelineTrack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: '12px'
  },
  timelineNode: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    zIndex: 2,
    marginTop: '4px'
  },
  timelineLine: {
    width: '2px',
    backgroundColor: '#e2e8f0',
    position: 'absolute',
    top: '12px',
    bottom: '-16px',
    zIndex: 1
  },
  timelineContent: {
    paddingBottom: '20px',
    flex: 1
  },
  timelineHeaderBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  timelineStatus: {
    fontSize: '14px',
    textTransform: 'capitalize'
  },
  timelineTime: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '600'
  },
  timelineDescription: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.4'
  },
  refreshButton: {
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.15s ease'
  },
  newPurchaseButton: {
    padding: '10px 18px',
    backgroundColor: '#ff6b9d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 2px 4px rgba(255, 107, 157, 0.2)'
  },
  emptyDisplayState: {
    padding: '64px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px'
  },
  emptyState: {
    padding: '80px 24px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
  },
  emptyStateText: {
    color: '#64748b',
    fontSize: '15px',
    margin: 0
  }
};

export default OwnitTrackingPage;
