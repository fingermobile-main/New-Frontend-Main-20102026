import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  alert_level: 'info' | 'warning' | 'critical';
  created_at: string;
}

interface Shipment {
  id: number;
  tracking_number: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'delayed';
  current_location: LocationDetails;
  estimated_arrival: string;
  status_updates: StatusUpdate[];
}

// --- Subcomponent: Shipment List Selector Tab ---
interface ShipmentListItemProps {
  item: Shipment;
  isSelected: boolean;
  onSelect: (item: Shipment) => void;
}

const ShipmentListItem: React.FC<ShipmentListItemProps> = React.memo(({ item, isSelected, onSelect }) => {
  const handleSelect = useCallback(() => onSelect(item), [item, onSelect]);

  return (
    <button
      onClick={handleSelect}
      className={`p-4 border-2 rounded-xl text-left min-w-[180px] transition duration-200 shadow-sm ${
        isSelected 
          ? 'border-orange-500 bg-orange-50 text-orange-900' 
          : 'border-gray-200 bg-white hover:border-gray-300 text-gray-800'
      }`}
    >
      <span className="block font-bold text-sm tracking-wide mb-1">{item.tracking_number}</span>
      <span className={`text-xs font-semibold capitalize ${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
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

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 capitalize">
            Status: <span className="text-orange-600">{shipment.status.replace('-', ' ')}</span>
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Estimated Arrival: <span className="font-semibold">{new Date(shipment.estimated_arrival).toLocaleDateString()}</span>
        </p>
        
        {structuralWarnings.map((update) => (
          <div key={update.id} className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <span>⚠️</span>
            <p className="font-medium">{update.description}</p>
          </div>
        ))}
      </div>

      <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
          📍
        </div>
        <p className="font-medium text-sm text-gray-700">Live Transit Map Tracking</p>
        <p className="text-xs text-gray-500 mt-1">
          Current Location: {shipment.current_location?.area}, {shipment.current_location?.state} ({shipment.current_location?.country})
        </p>
      </div>

      <button
        onClick={onContactCarrier}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition duration-150"
      >
        Contact Assigned Carrier
      </button>
    </div>
  );
});

ShipmentDetailsPanel.displayName = 'ShipmentDetailsPanel';

// --- Main Container Page Component ---
const MarketplaceTrackingPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const loadShipments = useCallback(async () => {
    try {
      // Production fallback tracking mocks
      const mockShipments: Shipment[] = [
        {
          id: 1,
          tracking_number: "MP-123456789",
          status: "in-transit",
          current_location: { country: "NG", state: "Lagos", area: "VI" },
          estimated_arrival: "2026-07-15T10:00:00Z",
          status_updates: [
            { id: 1, status: "processing", description: "Order is being processed", alert_level: "info", created_at: "2026-07-08T09:00:00Z" },
            { id: 2, status: "shipped", description: "Package has been dispatched from source warehouse", alert_level: "info", created_at: "2026-07-09T14:30:00Z" },
            { id: 3, status: "in-transit", description: "Package is in route across distribution lines", alert_level: "info", created_at: "2026-07-10T08:00:00Z" }
          ]
        },
        {
          id: 2,
          tracking_number: "MP-987654321",
          status: "delivered",
          current_location: { country: "NG", state: "Lagos", area: "Ikoyi" },
          estimated_arrival: "2026-06-25T15:00:00Z",
          status_updates: [
            { id: 1, status: "processing", description: "Order is being processed", alert_level: "info", created_at: "2026-06-23T09:00:00Z" },
            { id: 2, status: "shipped", description: "Package has been shipped", alert_level: "info", created_at: "2026-06-24T14:30:00Z" },
            { id: 3, status: "delivered", description: "Package delivered successfully to residential hub", alert_level: "info", created_at: "2026-06-25T14:45:00Z" }
          ]
        },
        {
          id: 3,
          tracking_number: "MP-456789123",
          status: "shipped",
          current_location: { country: "NG", state: "Lagos", area: "Lekki" },
          estimated_arrival: "2026-07-17T10:00:00Z",
          status_updates: [
            { id: 1, status: "processing", description: "Order is being processed", alert_level: "info", created_at: "2026-07-08T09:00:00Z" },
            { id: 2, status: "shipped", description: "Package has been signed to primary carrier line", alert_level: "info", created_at: "2026-07-10T14:30:00Z" }
          ]
        },
        {
          id: 4,
          tracking_number: "MP-789123456",
          status: "delayed",
          current_location: { country: "NG", state: "Ogun", area: "Abeokuta" },
          estimated_arrival: "2026-07-20T10:00:00Z",
          status_updates: [
            { id: 1, status: "processing", description: "Order is being processed", alert_level: "info", created_at: "2026-07-07T09:00:00Z" },
            { id: 2, status: "shipped", description: "Package has been shipped", alert_level: "info", created_at: "2026-07-08T14:30:00Z" },
            { id: 3, status: "delayed", description: "Heavy delay due to local road route updates", alert_level: "warning", created_at: "2026-07-09T15:00:00Z" }
          ]
        }
      ];

      setShipments(mockShipments);
      if (mockShipments.length > 0) {
        setSelectedShipment(mockShipments[0]);
      }
    } catch {
      // Graceful structural handler fallback
    }
  }, []);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handleSelectShipment = useCallback((item: Shipment) => {
    setSelectedShipment(item);
  }, []);

  const handleContactCarrier = useCallback(() => {
    if (!selectedShipment) return;
    window.confirm(`Would you like to register a connection hook directly to the carrier line for ID: ${selectedShipment.tracking_number}?`);
  }, [selectedShipment]);

  return (
    <div className="min-h-screen bg-orange-50/40 p-6 sm:p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Marketplace Tracker</h1>

      <div className="space-y-6">
        {shipments.length > 0 ? (
          <>
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x">
              {shipments.map((item) => (
                <ShipmentListItem
                  key={item.id}
                  item={item}
                  isSelected={selectedShipment?.id === item.id}
                  onSelect={handleSelectShipment}
                />
              ))}
            </div>

            {selectedShipment ? (
              <ShipmentDetailsPanel
                shipment={selectedShipment}
                onContactCarrier={handleContactCarrier}
              />
            ) : (
              <p className="text-gray-500 text-sm">Select a shipment node to execute telemetry breakdown.</p>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm">No recorded shipments associated with this context token profile.</p>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <button className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold text-sm rounded-xl transition duration-150 shadow-sm">
          Return to Dashboard Shop
        </button>
      </div>
    </div>
  );
};

export default MarketplaceTrackingPage;