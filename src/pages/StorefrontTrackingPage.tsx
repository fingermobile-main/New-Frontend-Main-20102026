import React from 'react';
import ShipmentStatus from '../components/TMS/ShipmentStatus';
import TrackingMap from '../components/TMS/TrackingMap';
import { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";

// --- Domain Interface Schema Definitions ---
interface StatusUpdate {
  id: number;
  status: string;
  description: string;
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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const loadShipments = React.useCallback(async () => {
    try {
      // In a real app, this would call the API to get member's orders
      // For now, we'll use mock data
      const mockShipments: Shipment[] = [
        {
          id: 1,
          tracking_number: "SF-123456789",
          status: "in-transit",
          current_location: { country: "NG", state: "Lagos", area: "VI" },
          estimated_arrival: "2026-01-14T10:00:00Z",
          status_updates: [
            {
              id: 1,
              status: "processing",
              description: "Order is being processed",
              alert_level: "info",
              created_at: "2026-01-08T09:00:00Z"
            },
            {
              id: 2,
              status: "shipped",
              description: "Package has been shipped",
              alert_level: "info",
              created_at: "2026-01-09T14:30:00Z"
            },
            {
              id: 3,
              status: "in-transit",
              description: "Package is in transit",
              alert_level: "info",
              created_at: "2026-01-10T08:00:00Z"
            }
          ]
        },
        {
          id: 2,
          tracking_number: "SF-987654321",
          status: "delivered",
          current_location: { country: "NG", state: "Lagos", area: "Yaba" },
          estimated_arrival: "2026-01-06T15:00:00Z",
          status_updates: [
            {
              id: 1,
              status: "processing",
              description: "Order is being processed",
              alert_level: "info",
              created_at: "2026-01-04T09:00:00Z"
            },
            {
              id: 2,
              status: "shipped",
              description: "Package has been shipped",
              alert_level: "info",
              created_at: "2026-01-05T14:30:00Z"
            },
            {
              id: 3,
              status: "delivered",
              description: "Package delivered successfully",
              alert_level: "info",
              created_at: "2026-01-06T14:45:00Z"
            }
          ]
        },
        {
          id: 3,
          tracking_number: "SF-456789123",
          status: "delayed",
          current_location: { country: "NG", state: "Lagos", area: "Apapa" },
          estimated_arrival: "2026-01-18T10:00:00Z",
          status_updates: [
            {
              id: 1,
              status: "processing",
              description: "Order is being processed",
              alert_level: "info",
              created_at: "2026-01-08T09:00:00Z"
            },
            {
              id: 2,
              status: "shipped",
              description: "Package has been shipped",
              alert_level: "info",
              created_at: "2026-01-09T14:30:00Z"
            },
            {
              id: 3,
              status: "delayed",
              description: "Delay due to weather conditions",
              alert_level: "warning",
              created_at: "2026-01-10T15:00:00Z"
            }
          ]
        }
      ];

      setShipments(mockShipments);
      
      // Keep selection synced during data refreshes
      if (mockShipments.length > 0) {
        setSelectedShipment(prev => {
          const match = mockShipments.find(s => s.id === prev?.id);
          return match || mockShipments[0];
        });
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
      if (showToast) showToast("Failed to load shipments", "error");
    }
  }, [showToast]);

  React.useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadShipments();
    setRefreshing(false);
  }, [loadShipments]);

  return (
    <div className="storefront-tracking-page" style={{ flex: 1, backgroundColor: "#e8f5e9", paddingTop: 20 }}>
      <h1>Storefront Tracking Dashboard</h1>
      <div style={{ flex: 1 }}>
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: "bold", 
          textAlign: "center", 
          padding: 16, 
          backgroundColor: "#c8e6c9", 
          borderBottomWidth: 1, 
          borderBottomColor: "#a5d6a7" 
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
                    onClick={() => setSelectedShipment(item)}
                    style={{
                      backgroundColor: "#fff",
                      padding: 12,
                      margin: '0 8px',
                      borderRadius: 8,
                      minWidth: 150,
                      borderWidth: 1,
                      borderColor: selectedShipment?.id === item.id ? "#4caf50" : "#e0e0e0",
                      borderStyle: 'solid',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: 14 }}>{item.tracking_number}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{item.status}</div>
                  </div>
                ))}
              </div>

              {selectedShipment ? (
                <>
                  <ShipmentStatus
                    status={selectedShipment.status}
                    progress={
                      selectedShipment.status === "delivered"
                        ? 100
                        : selectedShipment.status === "shipped"
                          ? 50
                          : selectedShipment.status === "in-transit"
                            ? 75
                            : selectedShipment.status === "delayed"
                              ? 60
                              : 25
                    }
                    estimatedArrival={selectedShipment.estimated_arrival}
                    alerts={selectedShipment.status_updates
                      .filter(
                        (update) =>
                          update.alert_level === "warning" ||
                          update.alert_level === "critical",
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
            backgroundColor: "#4caf50",
            padding: 16,
            margin: 16,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            color: "#fff",
            fontWeight: "bold",
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
