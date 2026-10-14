/*
 * FingerMobile Protocol™ - Sovereign Location & Geolocation Service
 * Auto-detects IP address locations and coordinates for wallets, payments, and form filling
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

export interface SovereignLocation {
  formattedAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  ipAddress: string;
  timezone: string;
  detectedAt: number;
}

export type DetectedLocation = SovereignLocation;

const STORAGE_KEY_LOCATION = 'fmp_user_location';

export const DEFAULT_SOVEREIGN_LOCATIONS = [
  {
    formattedAddress: 'Victoria Island Studio Hub, Lagos, Nigeria',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    latitude: 6.4281,
    longitude: 3.4219,
    ipAddress: '102.89.41.22',
    timezone: 'Africa/Lagos',
    detectedAt: Date.now(),
  },
  {
    formattedAddress: 'Abuja Central Sovereign Node, FCT, Nigeria',
    city: 'Abuja',
    state: 'Federal Capital Territory',
    country: 'Nigeria',
    latitude: 9.0765,
    longitude: 7.3986,
    ipAddress: '197.210.55.8',
    timezone: 'Africa/Lagos',
    detectedAt: Date.now(),
  },
  {
    formattedAddress: 'Soho Creative Quarter, London W1F, United Kingdom',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    latitude: 51.5136,
    longitude: -0.1365,
    ipAddress: '82.165.197.1',
    timezone: 'Europe/London',
    detectedAt: Date.now(),
  },
  {
    formattedAddress: 'Brooklyn Cyber Alley, New York, NY 11201, United States',
    city: 'New York',
    state: 'New York',
    country: 'United States',
    latitude: 40.6782,
    longitude: -73.9442,
    ipAddress: '68.195.88.10',
    timezone: 'America/New_York',
    detectedAt: Date.now(),
  },
];

class LocationService {
  /**
   * Retrieves the current saved location from localStorage or default
   */
  public getSavedLocation(): SovereignLocation {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_LOCATION);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_SOVEREIGN_LOCATIONS[0];
  }

  /**
   * Saves location to localStorage so wallets, payments, and forms can access it anytime
   */
  public saveLocation(location: SovereignLocation): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
        window.dispatchEvent(new CustomEvent('fmp_location_updated', { detail: location }));
      } catch {
        // ignore
      }
    }
  }

  /**
   * Auto-detects user location using IP geolocation or browser GPS
   */
  public async autoDetectLocation(): Promise<SovereignLocation> {
    try {
      // 1. Try IP Geolocation API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.city) {
          const loc: SovereignLocation = {
            formattedAddress: `${data.city}, ${data.region || ''}, ${data.country_name || 'Nigeria'}`.replace(/,\s*,/g, ', '),
            city: data.city || 'Lagos',
            state: data.region || 'Lagos State',
            country: data.country_name || 'Nigeria',
            postalCode: data.postal || '101241',
            latitude: data.latitude || 6.4281,
            longitude: data.longitude || 3.4219,
            ipAddress: data.ip || '102.89.41.22',
            timezone: data.timezone || 'Africa/Lagos',
            detectedAt: Date.now(),
          };
          this.saveLocation(loc);
          return loc;
        }
      }
    } catch {
      // Network failure or timeout: fallback to browser GPS if available
    }

    // 2. Fallback to Browser GPS or primary sovereign node
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject(err),
            { timeout: 3000 }
          );
        });

        const gpsLoc: SovereignLocation = {
          formattedAddress: `GPS Node Coordinates (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`,
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria',
          latitude: coords.latitude,
          longitude: coords.longitude,
          ipAddress: '102.89.41.22 (Enclave GPS)',
          timezone: 'Africa/Lagos',
          detectedAt: Date.now(),
        };
        this.saveLocation(gpsLoc);
        return gpsLoc;
      } catch {
        // GPS permission denied or timed out
      }
    }

    // 3. Fallback to Default Sovereign Hub
    const defaultLoc = DEFAULT_SOVEREIGN_LOCATIONS[0];
    this.saveLocation(defaultLoc);
    return defaultLoc;
  }

  /**
   * Alias for autoDetectLocation
   */
  public async detectLocationFromIp(): Promise<SovereignLocation> {
    return this.autoDetectLocation();
  }

  /**
   * Alias for saveLocation
   */
  public saveUserLocation(location: SovereignLocation): void {
    this.saveLocation(location);
  }
}

export const locationService = new LocationService();
export default locationService;
