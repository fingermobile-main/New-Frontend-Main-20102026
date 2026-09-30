import React, { useEffect, useState, useCallback } from 'react';
import apiService from '../services/apiService';
// --- Domain Interface Schema Definitions ---
interface StatusUpdate {
  id: number;
  status: string;
  description?: string;
  alert_level: 'info' | 'warning' | 'critical' | string;
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
  status: 'processing' | 'shipped' | 'delivered' | 'in-transit' | 'delayed' | string;
  current_location: LocationDetails;
  estimated_arrival: string;
  status_updates: StatusUpdate[];
}

// --- Main Page Component Container ---
const MarketplaceTrackingPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const loadShipments = useCallback(async () => {
    try {
      const res = await apiService.get('/api/marketplace/tracking');
      const liveShipments: Shipment[] = res.shipments || res.data || [];
      setShipments(liveShipments);

      // Keep selection synced during data refreshes
      if (liveShipments.length > 0) {
        setSelectedShipment(prev => {
          const match = liveShipments.find(s => s.id === prev?.id);
          return match || liveShipments[0];
        });
      }
    } catch (error) {
      console.error('Error loading shipments:', error);
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

  const handleContactCarrier = useCallback(() => {
    if (selectedShipment) {
      const confirmed = window.confirm(
        `Would you like to contact the carrier for tracking number ${selectedShipment.tracking_number}?`
      );
      if (confirmed) {
        console.info('Contacting carrier...');
      }
    }
  }, [selectedShipment]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Marketplace Order Tracking</h1>
          <p style={styles.subtitle}>Monitor delivery status parameters across active dispatches</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={styles.refreshButton}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </header>

      <main style={styles.content}>
        {shipments.length > 0 ? (
          <div style={styles.dashboardGrid}>
            {/* Sidebar Navigation Matrix */}
            <section style={styles.sidebar}>
              <h2 style={styles.sectionTitle}>Active Consignments ({shipments.length})</h2>
              <div style={styles.shipmentList}>
                {shipments.map((item) => {
                  const isSelected = selectedShipment?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedShipment(item)}
                      style={{
                        ...styles.shipmentItem,
                        ...(isSelected ? styles.selectedShipmentItem : {})
                      }}
                    >
                      <div style={styles.itemHeader}>
                        <span style={styles.trackingNumber}>{item.tracking_number}</span>
                        <span style={{
                          ...styles.statusBadge,
                          ...(item.status === 'delivered' ? styles.statusDelivered : styles.statusTransit)
                        }}>
                          {item.status}
                        </span>
                      </div>
                      <span style={styles.locationSummary}>
                        Current: {item.current_location?.area}, {item.current_location?.state}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Comprehensive Tracking Display Segment */}
            <section style={styles.mainDisplay}>
              {selectedShipment ? (
                <div style={styles.detailsCard}>
                  <div style={styles.detailsHeader}>
                    <div>
                      <span style={styles.metaLabel}>Tracking Reference</span>
                      <h2 style={styles.mainTrackingTitle}>{selectedShipment.tracking_number}</h2>
                    </div>
                    <div style={styles.etaBlock}>
                      <span style={styles.metaLabelRight}>Estimated Delivery Target</span>
                      <span style={styles.etaValue}>
                        {new Date(selectedShipment.estimated_arrival).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div style={styles.statusSection}>
                    <h3>Status: {selectedShipment.status}</h3>
                    {selectedShipment.status_updates
                      .filter(update => update.alert_level === 'warning' || update.alert_level === 'critical')
                      .map((update, idx) => (
                        <p key={idx} style={styles.alertText}>⚠️ {update.description}</p>
                      ))}
                  </div>

                  <div style={styles.mapPlaceholder}>
                    <div style={styles.mapIcon}>📍</div>
                    <p style={styles.mapTextPrimary}>Telemetry Geolocation Node Display</p>
                    <p style={styles.mapTextSecondary}>
                      Coordinates: {selectedShipment.current_location?.area}, {selectedShipment.current_location?.state}, {selectedShipment.current_location?.country}
                    </p>
                  </div>

                  <button
                    onClick={handleContactCarrier}
                    style={styles.contactCarrierButton}
                  >
                    Contact Carrier
                  </button>
                </div>
              ) : (
                <div style={styles.emptyDisplayState}>
                  <p>Select an active tracking number profile to populate matrix details.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>No logistical records attached to this consumer registry profile.</p>
          </div>
        )}
      </main>
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
    maxWidth: '1280px',
    margin: '0 auto 24px auto',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0'
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
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  content: {
    maxWidth: '1280px',
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
    borderColor: '#ff9800',
    backgroundColor: '#fff3e0',
    boxShadow: '0 2px 8px rgba(255, 152, 0, 0.08)'
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
  statusSection: {
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  alertText: {
    color: '#f57c00',
    marginTop: '8px',
    fontSize: '14px'
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
  contactCarrierButton: {
    padding: '12px 24px',
    backgroundColor: '#ff9800',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    width: '100%'
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

export default MarketplaceTrackingPage;
