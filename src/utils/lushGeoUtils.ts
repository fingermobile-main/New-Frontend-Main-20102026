// Utility functions for geolocation and distance calculations in the Lush Pressies app

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationWithDistance extends Location {
  distance: number; // in kilometers
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (point1: Location, point2: Location): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(point2.latitude - point1.latitude);
  const dLon = deg2rad(point2.longitude - point1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.latitude)) *
    Math.cos(deg2rad(point2.latitude)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

/**
 * Converts degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Formats distance for display
 */
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    const distanceInMeters = Math.round(distanceInKm * 1000);
    return `${distanceInMeters}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
};

/**
 * Gets a descriptive label for distance
 */
export const getDistanceLabel = (distanceInKm: number): string => {
  if (distanceInKm < 1) return 'Very Close';
  if (distanceInKm < 5) return 'Close';
  if (distanceInKm < 15) return 'Nearby';
  if (distanceInKm < 30) return 'Within City';
  if (distanceInKm < 50) return 'Short Distance';
  if (distanceInKm < 100) return 'Moderate Distance';
  return 'Far Away';
};

/**
 * Filters locations based on maximum distance
 */
export const filterByDistance = (
  locations: LocationWithDistance[],
  maxDistance: number
): LocationWithDistance[] => {
  return locations.filter(loc => loc.distance <= maxDistance);
};

/**
 * Sorts locations by distance (closest first)
 */
export const sortByDistance = (locations: LocationWithDistance[]): LocationWithDistance[] => {
  return [...locations].sort((a, b) => a.distance - b.distance);
};

/**
 * Groups locations by distance range
 */
export const groupByDistanceRange = (
  locations: LocationWithDistance[]
): { [key: string]: LocationWithDistance[] } => {
  return locations.reduce((groups, location) => {
    let range;
    if (location.distance < 5) range = 'very_close';
    else if (location.distance < 15) range = 'close';
    else if (location.distance < 30) range = 'nearby';
    else if (location.distance < 50) range = 'city';
    else range = 'far';

    if (!groups[range]) {
      groups[range] = [];
    }
    groups[range].push(location);
    return groups;
  }, {} as { [key: string]: LocationWithDistance[] });
};

/**
 * Checks if a location is within a given radius of another location
 */
export const isWithinRadius = (
  center: Location,
  target: Location,
  radiusInKm: number
): boolean => {
  return calculateDistance(center, target) <= radiusInKm;
};

/**
 * Gets bounding box for a location with a given radius
 */
export const getBoundingBox = (center: Location, radiusInKm: number): {
  northEast: Location;
  southWest: Location;
} => {
  // Approximate conversion of km to degrees (varies by latitude)
  const latDelta = radiusInKm / 111.045; // 1 degree of latitude is ~111 km
  const lngDelta = radiusInKm / (111.045 * Math.cos(center.latitude * Math.PI / 180)); // Adjust for longitude

  return {
    northEast: {
      latitude: center.latitude + latDelta,
      longitude: center.longitude + lngDelta
    },
    southWest: {
      latitude: center.latitude - latDelta,
      longitude: center.longitude - lngDelta
    }
  };
};

/**
 * Generates a random location near a given location within a radius
 */
export const generateRandomLocationNear = (
  center: Location,
  maxRadiusKm: number
): Location => {
  // Convert radius from km to degrees (approximation)
  const radiusInDegrees = maxRadiusKm / 111.045;

  // Generate random angle and distance
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radiusInDegrees;

  // Calculate new coordinates
  const newLat = center.latitude + distance * Math.cos(angle);
  const newLng = center.longitude + distance * Math.sin(angle) / Math.cos(center.latitude * Math.PI / 180);

  return {
    latitude: newLat,
    longitude: newLng
  };
};

/**
 * Gets estimated travel time between two locations (simplified)
 */
export const estimateTravelTime = (
  distanceInKm: number,
  mode: 'driving' | 'walking' | 'cycling' = 'driving'
): number => { // Returns minutes
  let speed; // km/h
  switch (mode) {
  case 'walking':
    speed = 5;
    break;
  case 'cycling':
    speed = 15;
    break;
  case 'driving':
  default:
    speed = 40; // Average city driving speed
  }

  return (distanceInKm / speed) * 60; // Convert hours to minutes
};

/**
 * Gets a location from a formatted address string (placeholder implementation)
 */
export const getLocationFromAddress = async (address: string): Promise<Location | null> => {
  // In a real implementation, this would use a geocoding service like Google Maps API
  // For now, returning null to indicate unimplemented functionality
  console.warn('getLocationFromAddress is not implemented - would require geocoding API');
  return null;
};

/**
 * Gets a formatted address from coordinates (placeholder implementation)
 */
export const getAddressFromCoordinates = async (
  location: Location
): Promise<string | null> => {
  // In a real implementation, this would use a reverse geocoding service
  // For now, returning null to indicate unimplemented functionality
  console.warn('getAddressFromCoordinates is not implemented - would require reverse geocoding API');
  return null;
};

/**
 * Checks if coordinates are valid
 */
export const isValidLocation = (location: Location): boolean => {
  return (
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number' &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
};

/**
 * Calculates bearing between two points (for direction)
 */
export const calculateBearing = (start: Location, end: Location): number => {
  const startLatRad = deg2rad(start.latitude);
  const endLatRad = deg2rad(end.latitude);
  const deltaLngRad = deg2rad(end.longitude - start.longitude);

  const y = Math.sin(deltaLngRad) * Math.cos(endLatRad);
  const x = Math.cos(startLatRad) * Math.sin(endLatRad) -
            Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(deltaLngRad);
  const bearingRad = Math.atan2(y, x);

  // Convert to degrees and normalize to 0-360
  let bearingDeg = (bearingRad * 180 / Math.PI + 360) % 360;
  return bearingDeg;
};

/**
 * Gets cardinal direction from bearing
 */
export const getCardinalDirection = (bearing: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

// Export default object with all utilities
export default {
  calculateDistance,
  formatDistance,
  getDistanceLabel,
  filterByDistance,
  sortByDistance,
  groupByDistanceRange,
  isWithinRadius,
  getBoundingBox,
  generateRandomLocationNear,
  estimateTravelTime,
  getLocationFromAddress,
  getAddressFromCoordinates,
  isValidLocation,
  calculateBearing,
  getCardinalDirection
};
