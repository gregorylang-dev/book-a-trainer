// Centroids for prominent US ZIP prefixes
const ZIP_COORDINATES: Record<string, { lat: number; lng: number; city: string; state: string }> = {
  '90': { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA' },
  '91': { lat: 34.1808, lng: -118.3090, city: 'Glendale / Burbank', state: 'CA' },
  '92': { lat: 32.7157, lng: -117.1611, city: 'San Diego', state: 'CA' },
  '94': { lat: 37.7749, lng: -122.4194, city: 'San Francisco', state: 'CA' },
  '95': { lat: 37.3382, lng: -121.8863, city: 'San Jose / Bay Area', state: 'CA' },
  '98': { lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA' },
  '10': { lat: 40.7128, lng: -74.0060, city: 'New York City', state: 'NY' },
  '11': { lat: 40.7282, lng: -73.7949, city: 'Queens / Long Island', state: 'NY' },
  '07': { lat: 40.7357, lng: -74.1724, city: 'Newark / Jersey City', state: 'NJ' },
  '02': { lat: 42.3601, lng: -71.0589, city: 'Boston', state: 'MA' },
  '60': { lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL' },
  '75': { lat: 32.7767, lng: -96.7970, city: 'Dallas', state: 'TX' },
  '77': { lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX' },
  '78': { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX' },
  '33': { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL' },
  '32': { lat: 30.3322, lng: -81.6557, city: 'Jacksonville', state: 'FL' },
  '30': { lat: 33.7490, lng: -84.3880, city: 'Atlanta', state: 'GA' },
  '80': { lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO' },
  '85': { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ' },
  '97': { lat: 45.5152, lng: -122.6784, city: 'Portland', state: 'OR' }
};

export function getZipLocationDetails(zip: string): { city: string; state: string } | null {
  const cleanZip = zip.trim().slice(0, 5);
  if (cleanZip.length < 2) return null;
  const prefix2 = cleanZip.slice(0, 2);
  if (ZIP_COORDINATES[prefix2]) {
    return {
      city: ZIP_COORDINATES[prefix2].city,
      state: ZIP_COORDINATES[prefix2].state
    };
  }
  return null;
}

// Approximate Haversine distance in miles between two ZIP codes
export function calculateZipDistance(zipA: string, zipB: string): number {
  const a = zipA.trim().slice(0, 5);
  const b = zipB.trim().slice(0, 5);
  if (a === b) return 1.2; // Same zip, close neighborhood

  const prefA = a.slice(0, 2);
  const prefB = b.slice(0, 2);

  if (prefA === prefB) {
    // Within same metro zone: generate deterministic small distance based on last 3 digits diff
    const diff = Math.abs(parseInt(a.slice(2) || '0', 10) - parseInt(b.slice(2) || '0', 10));
    return Math.max(1.8, Math.min(24.5, Number((2.0 + (diff % 18) * 1.1).toFixed(1))));
  }

  const coordA = ZIP_COORDINATES[prefA] || { lat: 39.5, lng: -98.35 };
  const coordB = ZIP_COORDINATES[prefB] || { lat: 38.0, lng: -97.0 };

  const R = 3958.8; // Radius of earth in miles
  const dLat = ((coordB.lat - coordA.lat) * Math.PI) / 180;
  const dLon = ((coordB.lng - coordA.lng) * Math.PI) / 180;
  const lat1 = (coordA.lat * Math.PI) / 180;
  const lat2 = (coordB.lat * Math.PI) / 180;

  const sinDlat = Math.sin(dLat / 2);
  const sinDlon = Math.sin(dLon / 2);
  const hav = sinDlat * sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlon * sinDlon;
  const c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
  return Number((R * c).toFixed(1));
}
