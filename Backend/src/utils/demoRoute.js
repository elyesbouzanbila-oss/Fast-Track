/**
 * Shared utility for generating demo/fallback route data when OSRM is unavailable.
 * Returns a CLEAN GeoJSON LineString geometry and separate metadata.
 *
 * IMPORTANT: The geometry object must be pure GeoJSON — no extra fields like
 * `distance` or `duration` — because it gets passed to PostGIS ST_GeomFromGeoJSON,
 * which rejects non-standard fields and would cause hazard queries to fail.
 */
function generateDemoRouteData(origin, destination) {
  const coords = [
    [origin.lng, origin.lat],
    [(origin.lng + destination.lng) / 2, (origin.lat + destination.lat) / 2],
    [destination.lng, destination.lat],
  ];

  const latDiff = Math.abs(destination.lat - origin.lat);
  const lngDiff = Math.abs(destination.lng - origin.lng);
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000;

  // Pure GeoJSON geometry — only type + coordinates allowed
  const geometry = {
    type: 'LineString',
    coordinates: coords,
  };

  return {
    geometry,
    distance: Math.round(distance),
    durationCar: Math.round(distance / 15),       // ~15 m/s driving
    durationWalk: Math.round(distance / 1.4),     // ~1.4 m/s walking
  };
}

module.exports = { generateDemoRouteData };
