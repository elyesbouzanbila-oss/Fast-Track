const axios = require('axios');
const { buildOsrmRouteUrl, buildOsrmNearestUrl } = require('../../config/osrm');
const { MAX_SNAP_DISTANCE_METERS } = require('../../config/constants');
const { generateDemoRouteData } = require('../../utils/demoRoute');

/**
 * Car Router — wraps OSRM's car profile with a graceful demo fallback.
 *
 * FIXES:
 * - SKIP_OSRM=true now truly skips the network call (was trying OSRM anyway).
 * - generateDemoRoute removed in favour of shared utility that returns valid GeoJSON.
 */

async function snapToCarRoad(lng, lat) {
  // When explicitly told to skip OSRM, return a passthrough immediately.
  if (process.env.SKIP_OSRM === 'true') {
    return { lng, lat, originalLng: lng, originalLat: lat, snapDistance: 0, snapped: false, fallback: true };
  }

  try {
    const url = buildOsrmNearestUrl('car', lng, lat);
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    if (data.code === 'Ok' && data.waypoints?.length) {
      const waypoint = data.waypoints[0];
      const snappedLng = waypoint.location[0];
      const snappedLat = waypoint.location[1];
      const distance = waypoint.distance;

      if (distance <= MAX_SNAP_DISTANCE_METERS) {
        return {
          lng: snappedLng,
          lat: snappedLat,
          originalLng: lng,
          originalLat: lat,
          snapDistance: distance,
          snapped: distance > 5,
        };
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'production') throw err;
    // In dev: fall through to demo fallback silently
  }

  if (process.env.NODE_ENV !== 'production') {
    return { lng, lat, originalLng: lng, originalLat: lat, snapDistance: 0, snapped: false, fallback: true };
  }

  // Production and OSRM failed — hard error
  throw new Error(`No drivable road found near [${lng}, ${lat}]`);
}

async function getCarRoute(origin, destination, options = {}) {
  const [snappedOrigin, snappedDest] = await Promise.all([
    snapToCarRoad(origin.lng, origin.lat),
    snapToCarRoad(destination.lng, destination.lat),
  ]);

  const waypoints = options.waypoints || [];
  const snappedWaypoints = await Promise.all(waypoints.map((wp) => snapToCarRoad(wp.lng, wp.lat)));

  const coordinates = [
    [snappedOrigin.lng, snappedOrigin.lat],
    ...snappedWaypoints.map((wp) => [wp.lng, wp.lat]),
    [snappedDest.lng, snappedDest.lat],
  ];

  const isFallback = snappedOrigin.fallback || snappedDest.fallback;

  if (isFallback) {
    const demo = generateDemoRouteData(snappedOrigin, snappedDest);
    return {
      mode: 'car',
      distance: demo.distance,
      duration: demo.durationCar,
      geometry: demo.geometry,   // ← pure GeoJSON, no extra fields
      legs: [],
      snapping: { origin: snappedOrigin, destination: snappedDest },
      demo: true,
    };
  }

  try {
    const url = buildOsrmRouteUrl('car', coordinates, { steps: options.steps });
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;

    if (data.code !== 'Ok' || !data.routes?.length) {
      throw new Error(`No car route found: ${data.message || data.code}`);
    }

    const route = data.routes[0];
    return {
      mode: 'car',
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
      legs: route.legs,
      snapping: { origin: snappedOrigin, destination: snappedDest },
    };
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getCarRoute] OSRM failed, using demo route:', err.message);
      const demo = generateDemoRouteData(snappedOrigin, snappedDest);
      return {
        mode: 'car',
        distance: demo.distance,
        duration: demo.durationCar,
        geometry: demo.geometry,
        legs: [],
        snapping: { origin: snappedOrigin, destination: snappedDest },
        demo: true,
      };
    }
    throw err;
  }
}

module.exports = { getCarRoute, snapToCarRoad };
