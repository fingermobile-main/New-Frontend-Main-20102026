import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  timestamp: number;
}

interface GeoPreferences {
  maxDistance: number; // in kilometers
  showDistance: boolean;
  autoUpdateLocation: boolean;
  locationSharing: 'everyone' | 'matches' | 'connections' | 'none';
}

interface NearbyUser {
  id: string;
  distance: number; // in kilometers
  lastSeen: string;
  isOnline: boolean;
}

export function useLushGeo(userId: string) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [geoPreferences, setGeoPreferences] = useState<GeoPreferences | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<PermissionState>('prompt');

  // Get current location
  const getCurrentLocation = async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return null;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          setCurrentLocation(location);
          resolve(location);
        },
        (err) => {
          setError(`Unable to retrieve location: ${err.message}`);
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // 1 minute
        }
      );
    });
  };

  // Load geo preferences
  const loadGeoPreferences = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/geo/preferences/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockPreferences: GeoPreferences = {
        maxDistance: 50,
        showDistance: true,
        autoUpdateLocation: true,
        locationSharing: 'matches'
      };

      setGeoPreferences(mockPreferences);
    } catch (err) {
      setError('Failed to load geo preferences');
      console.error('Error loading geo preferences:', err);
    }
  };

  // Update geo preferences
  const updateGeoPreferences = async (newPreferences: Partial<GeoPreferences>) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/geo/preferences/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPreferences)
      // });

      if (geoPreferences) {
        setGeoPreferences({ ...geoPreferences, ...newPreferences });
      }
    } catch (err) {
      setError('Failed to update geo preferences');
      console.error('Error updating geo preferences:', err);
    }
  };

  // Load nearby users
  const loadNearbyUsers = async (limit: number = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call with location data
      // const response = await fetch(`/api/lushpressies/geo/nearby/${userId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ location: currentLocation, limit })
      // });
      // const data = await response.json();

      // Mock data for demonstration
      const mockNearby: NearbyUser[] = Array.from({ length: limit }, (_, i) => ({
        id: `user_${Date.now()}_${i}`,
        distance: Math.random() * 50, // 0-50 km away
        lastSeen: new Date(Date.now() - (i * 1000 * 60 * 30)).toISOString(), // Last seen recently
        isOnline: i % 3 !== 0 // 2/3 are online
      }));

      setNearbyUsers(mockNearby);
    } catch (err) {
      setError('Failed to load nearby users');
      console.error('Error loading nearby users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Format distance for display
  const formatDistance = (distanceInKm: number): string => {
    if (distanceInKm < 1) {
      return `${Math.round(distanceInKm * 1000)}m`;
    }
    return `${distanceInKm.toFixed(1)}km`;
  };

  // Check location permission
  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(permission.state);

        permission.onchange = () => {
          setLocationPermission(permission.state);
        };
      } catch (err) {
        console.error('Error checking location permission:', err);
      }
    }
  };

  // Watch position for updates
  const watchPosition = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        setCurrentLocation(location);
      },
      (err) => {
        setError(`Geolocation error: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000, // 30 seconds
        timeout: 10000
      }
    );

    // Return function to clear watch
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  };

  // Initialize geo functionality
  useEffect(() => {
    if (userId) {
      checkLocationPermission();
      loadGeoPreferences();
      getCurrentLocation().then(() => {
        loadNearbyUsers();
      }).catch(() => {
        // If location isn't available, still load nearby users with default preferences
        loadNearbyUsers();
      });
    }
  }, [userId]);

  return {
    currentLocation,
    geoPreferences,
    nearbyUsers,
    isLoading,
    error,
    locationPermission,
    getCurrentLocation,
    loadGeoPreferences,
    updateGeoPreferences,
    loadNearbyUsers,
    calculateDistance,
    formatDistance,
    watchPosition
  };
}
