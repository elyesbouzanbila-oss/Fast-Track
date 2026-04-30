const axios = require('axios');
const { buildOsrmRouteUrl, buildOsrmNearestUrl } = require('../../config/osrm');
const { MAX_SNAP_DISTANCE_METERS, ROUTE_MODES } = require('../../config/constants');
const { getCarRoute, snapToCarRoad } = require('./carRouter');
const { findNearbyStops } = require('./transitRouter');
const { generateDemoRouteData } = require('../../utils/demoRoute');

/**
 * Snap a coordinate to nearest walkable path with fallback.
 *
 * FIXES:
 * - SKIP_OSRM=true now returns a passthrough immediately.
 * - generateDemoRoute removed in favour of shared utility (valid GeoJSON).
 */
async function snapToFootPath(lng, lat) {
  if (process.env.SKIP_OSRM === 'true') {
    return { lng, lat, snapDistance: 0, snapped: false, fallback: true };
  }

  try {
    const url = buildOsrmNearestUrl('foot', lng, lat);
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    if (data.code === 'Ok' && data.waypoints?.length) {
      const wp = data.waypoints[0];
      if (wp.distance <= MAX_SNAP_DISTANCE_METERS) {
        return {
          lng: wp.location[0],
          lat: wp.location[1],
          snapDistance: wp.distance,
          snapped: wp.distance > 5,
        };
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'production') throw err;
  }

  if (process.env.NODE_ENV !== 'production') {
    return { lng, lat, snapDistance: 0, snapped: false, fallback: true };
  }

  throw new Error(`No walkable path found near [${lng}, ${lat}]`);
}

async function getWalkingRoute(origin, destination, options = {}) {
  const [snappedOrigin, snappedDest] = await Promise.all([
    snapToFootPath(origin.lng, origin.lat),
    snapToFootPath(destination.lng, destination.lat),
  ]);

  const isFallback = snappedOrigin.fallback || snappedDest.fallback;

  if (isFallback) {
    const demo = generateDemoRouteData(snappedOrigin, snappedDest);
    return {
      mode: 'foot',
      distance: demo.distance,
      duration: demo.durationWalk,
      geometry: demo.geometry,
      legs: [],
      snapping: { origin: snappedOrigin, destination: snappedDest },
      demo: true,
    };
  }

  const coordinates = [
    [snappedOrigin.lng, snappedOrigin.lat],
    [snappedDest.lng, snappedDest.lat],
  ];

  try {
    const url = buildOsrmRouteUrl('foot', coordinates, { steps: options.steps });
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;

    if (data.code !== 'Ok' || !data.routes?.length) {
      throw new Error(`No walking route found: ${data.message || data.code}`);
    }

    const route = data.routes[0];
    return {
      mode: 'foot',
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
      legs: route.legs,
      snapping: { origin: snappedOrigin, destination: snappedDest },
    };
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getWalkingRoute] OSRM failed, using demo route:', err.message);
      const demo = generateDemoRouteData(snappedOrigin, snappedDest);
      return {
        mode: 'foot',
        distance: demo.distance,
        duration: demo.durationWalk,
        geometry: demo.geometry,
        legs: [],
        snapping: { origin: snappedOrigin, destination: snappedDest },
        demo: true,
      };
    }
    throw err;
  }
}

/**
 * Main routing dispatcher.
 */
async function getRoute(origin, destination, mode = ROUTE_MODES.CAR, options = {}) {
  switch (mode) {
    case ROUTE_MODES.CAR:
      return getCarRoute(origin, destination, options);

    case ROUTE_MODES.WALK:
      return getWalkingRoute(origin, destination, options);

    case ROUTE_MODES.TRANSIT:
      try {
        const { getTransitRoute } = require('./transitRouter');
        return getTransitRoute(origin, destination, options);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[getRoute] Transit unavailable, falling back to walking route');
          return getWalkingRoute(origin, destination, options);
        }
        throw err;
      }

    case ROUTE_MODES.MULTIMODAL: {
      const [walkRoute, transitRoute] = await Promise.allSettled([
        getWalkingRoute(origin, destination, options),
        (async () => {
          try {
            const { getTransitRoute } = require('./transitRouter');
            return getTransitRoute(origin, destination, options);
          } catch (_) {
            return null;
          }
        })(),
      ]);

      return {
        mode: 'multimodal',
        walking: walkRoute.status === 'fulfilled' ? walkRoute.value : null,
        transit: transitRoute.status === 'fulfilled' && transitRoute.value ? transitRoute.value : null,
        errors: {
          walking: walkRoute.status === 'rejected' ? walkRoute.reason?.message : null,
          transit: transitRoute.status === 'rejected' ? transitRoute.reason?.message : null,
        },
      };
    }

    default:
      throw new Error(`Unknown routing mode: ${mode}`);
  }
}

async function snapCoordinate(lng, lat, mode = 'car') {
  switch (mode) {
    case 'car':
    case 'bike':
      return snapToCarRoad(lng, lat);
    case 'foot':
      return snapToFootPath(lng, lat);
    default:
      return snapToCarRoad(lng, lat);
  }
}

module.exports = { getRoute, getWalkingRoute, snapCoordinate, snapToFootPath };
