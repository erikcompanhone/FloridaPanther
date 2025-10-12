import proj4 from 'proj4';

/**
 * Coordinate projection utilities for converting between coordinate systems
 */

// Define projections
// Florida Panther data uses State Plane Florida East NAD83 in US Survey Feet (EPSG:2236)
// X values around 600,000-700,000, Y values around 200,000-300,000
const EPSG_4326 = 'EPSG:4326'; // Standard lat/lon (WGS84)
const EPSG_2236 = '+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs'; // State Plane Florida East (US Survey Feet)

/**
 * Check if coordinates are valid
 */
export function isValidCoordinate(x, y) {
  if (x === null || y === null || x === undefined || y === undefined) {
    return false;
  }

  const lat = parseFloat(y);
  const lon = parseFloat(x);

  // Check if within valid ranges
  return !isNaN(lat) && !isNaN(lon) && 
         lat >= -90 && lat <= 90 && 
         lon >= -180 && lon <= 180;
}

/**
 * Convert projected coordinates to lat/lon
 * Florida Panther data uses State Plane Florida East in US Survey Feet (EPSG:2236)
 * X values around 600,000-700,000 feet, Y values around 200,000-300,000 feet
 */
export function projectToLatLon(x, y) {
  try {
    // If coordinates are already in lat/lon range, return as-is
    if (Math.abs(x) <= 180 && Math.abs(y) <= 90) {
      return [parseFloat(y), parseFloat(x)]; // [lat, lon]
    }

    // Convert from State Plane Florida East (US Survey Feet) to lat/lon
    const [lon, lat] = proj4(EPSG_2236, EPSG_4326, [parseFloat(x), parseFloat(y)]);
    return [lat, lon];
  } catch (error) {
    console.error('Projection error:', error, { x, y });
    return null;
  }
}

/**
 * Batch project coordinates for better performance
 */
export function batchProjectToLatLon(points) {
  return points
    .map(point => {
      const coords = projectToLatLon(point.X || point.x, point.Y || point.y);
      if (!coords) return null;

      return {
        ...point,
        lat: coords[0],
        lon: coords[1],
      };
    })
    .filter(Boolean); // Remove nulls
}

/**
 * Calculate bounds for a set of coordinates
 */
export function calculateBounds(points) {
  if (!points || points.length === 0) return null;

  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;

  points.forEach(point => {
    const lat = point.lat || point.Y || point.y;
    const lon = point.lon || point.X || point.x;

    if (lat && lon) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
    }
  });

  return {
    minLat,
    maxLat,
    minLon,
    maxLon,
    center: [(minLat + maxLat) / 2, (minLon + maxLon) / 2],
  };
}

/**
 * Format coordinates for display
 */
export function formatCoordinate(lat, lon, precision = 4) {
  return {
    lat: parseFloat(lat).toFixed(precision),
    lon: parseFloat(lon).toFixed(precision),
    display: `${parseFloat(lat).toFixed(precision)}°N, ${parseFloat(lon).toFixed(precision)}°W`,
  };
}

/**
 * Calculate distance between two points (in km) using Haversine formula
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
