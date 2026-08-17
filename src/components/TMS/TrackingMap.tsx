import React, {} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dynamic import for react-leaflet (ES module)
const MapContainer = React.lazy(() => import('react-leaflet').then(module => ({ default: module.MapContainer })));
const TileLayer = React.lazy(() => import('react-leaflet').then(module => ({ default: module.TileLayer })));
const Marker = React.lazy(() => import('react-leaflet').then(module => ({ default: module.Marker })));
const Popup = React.lazy(() => import('react-leaflet').then(module => ({ default: module.Popup })));

// Fix for default marker icons in Leaflet with webpack
const DefaultIcon = L.Icon.Default as any;
delete DefaultIcon.prototype._getIconUrl;
DefaultIcon.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Define the Shipment type locally since it's not exported from context
interface Shipment {
  id: string | number;
  trackingNumber?: string;
  origin?: string;
  destination?: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  status?: 'in-transit' | 'delivered' | 'delayed' | string;
  estimatedDelivery?: string;
  carrier?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  [key: string]: any;
}

interface TrackingMapProps {
  shipments?: Shipment[];
  shipment?: Shipment;
  selectedShipment?: Shipment;
  onSelectShipment?: (shipment: Shipment) => void;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ 
  shipments = [], 
  selectedShipment,
  onSelectShipment 
}) => {
  // Calculate map center based on shipments
  const calculateCenter = (): [number, number] => {
    const validShipments = shipments.filter(s => s && s.currentLocation);
    
    if (validShipments.length === 0) {
      return [0, 0]; // Default to center of the world
    }

    const avgLat = validShipments.reduce((sum, shipment) => sum + shipment.currentLocation!.lat, 0) / validShipments.length;
    const avgLng = validShipments.reduce((sum, shipment) => sum + shipment.currentLocation!.lng, 0) / validShipments.length;

    return [avgLat, avgLng];
  };

  const mapCenter = calculateCenter();
  const zoomLevel = shipments.length > 1 ? 5 : 10; // Adjust zoom based on number of shipments

  return (
    <div className="h-full w-full">
      <React.Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading Map...</div>}>
        <MapContainer 
          center={mapCenter} 
          zoom={zoomLevel} 
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {shipments.map((shipment) => {
            if (!shipment || !shipment.currentLocation) return null;
            
            // Determine marker color based on status
            let markerColor = 'red';
            if (shipment.status === 'delivered') markerColor = 'green';
            if (shipment.status === 'delayed') markerColor = 'orange';
            
            // Create custom icon with color
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                       <span style="color: white; font-size: 12px; font-weight: bold;">${(shipment.trackingNumber || '??').substring(0, 2)}</span>
                     </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 24],
              popupAnchor: [0, -24]
            });

            return (
              <Marker
                key={shipment.id}
                position={[shipment.currentLocation.lat, shipment.currentLocation.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => {
                    if (onSelectShipment) {
                      onSelectShipment(shipment);
                    }
                  }
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <h3 className="font-bold">{shipment.carrier}</h3>
                    <p><strong>Tracking:</strong> {shipment.trackingNumber}</p>
                    <p><strong>Status:</strong> <span className={
                      shipment.status === 'delivered' ? 'text-green-500' :
                      shipment.status === 'delayed' ? 'text-orange-500' : 'text-red-500'
                    }>{shipment.status}</span></p>
                    <p><strong>Est. Delivery:</strong> {shipment.estimatedDelivery}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </React.Suspense>
    </div>
  );
};

export default TrackingMap;