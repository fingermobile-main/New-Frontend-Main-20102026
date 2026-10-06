import React, { useEffect, useState, useCallback } from 'react';
import ShipmentStatus from '../components/TMS/ShipmentStatus';
import TrackingMap from '../components/TMS/TrackingMap';

import { useAppContext } from '../contexts/AppContext';
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
const StorefrontTrackingPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [refreshing, setRefreshing] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const loadShipments = useCallback(async () => {
    try {
      const res = await apiService.get('/api/storefront/tracking');
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
      // eslint-disable-next-line no-console
      console.error('Error loading shipments:', error);
      if (showToast) showToast('Failed to load shipments', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  // eslint-disable-next-line no-unused-vars
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadShipments();
    setRefreshing(false);
  }, [loadShipments]);

  return (
    <div className="storefront-tracking-page" style={{ flex: 1, backgroundColor: '#e8f5e9', paddingTop: 20 }}>
      <h1>Storefront Tracking Dashboard</h1>
      <div style={{ flex: 1 }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: 16,
          backgroundColor: '#c8e6c9',
          borderBottomWidth: 1,
          borderBottomColor: '#a5d6a7'
        }}>
          Storefront - Order Tracking
        </h2>

        <div style={{ flex: 1, padding: 16 }}>
          {shipments.length > 0 ? (
            <>
              <div style={{
                maxHeight: 80,
                marginBottom: 16,
                display: 'flex',
                overflowX: 'auto'
              }}>
                {shipments.map((item) => (
                  <div
                    key={item.id.toString()}
                    onClick={() => setSelectedShipment(item)} role="button" tabIndex={0}
                    style={{
                      backgroundColor: '#fff',
                      padding: 12,
                      margin: '0 8px',
                      borderRadius: 8,
                      minWidth: 150,
                      borderWidth: 1,
                      borderColor: selectedShipment?.id === item.id ? '#4caf50' : '#e0e0e0',
                      borderStyle: 'solid',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.tracking_number}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{item.status}</div>
                  </div>
                ))}
              </div>

              {selectedShipment ? (
                <>
                  <ShipmentStatus
                    status={selectedShipment.status}
                    progress={
                      selectedShipment.status === 'delivered'
                        ? 100
                        : selectedShipment.status === 'shipped'
                          ? 50
                          : selectedShipment.status === 'in-transit'
                            ? 75
                            : selectedShipment.status === 'delayed'
                              ? 60
                              : 25
                    }
                    estimatedArrival={selectedShipment.estimated_arrival}
                    alerts={selectedShipment.status_updates
                      .filter(
                        (update) =>
                          update.alert_level === 'warning' ||
                          update.alert_level === 'critical',
                      )
                      .map((update) => update.description)}
                  />

                  <TrackingMap shipment={selectedShipment} />
                </>
              ) : (
                <p>Select a shipment to view details</p>
              )}
            </>
          ) : (
            <p>No shipments found</p>
          )}
        </div>

        <button
          onClick={() => {/* Browse products logic */}}
          style={{
            backgroundColor: '#4caf50',
            padding: 16,
            margin: 16,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16
          }}
        >
          Browse Products
        </button>
      </div>
    </div>
  );
};

export default StorefrontTrackingPage;
