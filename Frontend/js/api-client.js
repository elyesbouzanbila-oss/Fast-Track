/**
 * NavigationAPI — centralised frontend client for the FastTrack backend.
 *
 * All API calls go through `request()` which handles:
 *  - Attaching the JWT token automatically
 *  - Parsing HTTP error codes into typed Error objects
 *  - Preventing 401 redirect loops on the login page itself
 *  - Surfacing network failures with a clear message
 *
 * Usage (all pages load config.js first, then this file):
 *   await navigationAPI.login(email, password);
 *   await navigationAPI.calculateRoute(origin, dest, 'car');
 */
class NavigationAPI {
  constructor(baseURL) {
    this.baseURL = baseURL || API_CONFIG.BASE_URL;
  }

  // ── Token storage ──────────────────────────────────────────────────────────
  getToken()        { return localStorage.getItem('authToken'); }
  setToken(token)   { localStorage.setItem('authToken', token); }
  clearToken()      { localStorage.removeItem('authToken'); }

  // ── Core request ───────────────────────────────────────────────────────────
  async request(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token   = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(`${this.baseURL}${endpoint}`, { ...options, headers });
    } catch (fetchErr) {
      // Pure network failure (no connection, DNS error, CORS preflight blocked, etc.)
      const err = new Error('Could not reach the server. Please check your connection.');
      err.isNetworkError = true;
      throw err;
    }

    // Parse body — always JSON from this backend
    let data;
    try {
      data = await response.json();
    } catch {
      const err = new Error('Server returned an unexpected response.');
      err.status = response.status;
      throw err;
    }

    if (!response.ok) {
      // 401: token expired or invalid — clear it and redirect to login,
      // but NOT if we are already on the login page (avoids infinite loops).
      if (response.status === 401) {
        this.clearToken();
        const path = window.location.pathname;
        const onLogin = path.endsWith('login1.html') || path === '/';
        if (!onLogin) window.location.href = '/login1.html';
      }

      // Build a typed error that callers can switch on by .status
      const err = new Error(data.error || `Request failed (${response.status})`);
      err.status  = response.status;
      err.details = data.details || null;   // express-validator array (v7: each item has .path)
      err.code    = data.code    || null;   // e.g. 'NO_ROUTE_FOUND', 'LOCATION_UNREACHABLE'
      throw err;
    }

    return data;
  }

  // ── Auth ───────────────────────────────────────────────────────────────────

  /** Register a new account. Token is stored automatically on success. */
  async signup(name, email, password) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.data?.token) this.setToken(data.data.token);
    return data;
  }

  /** Log in. Token is stored automatically on success. */
  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data?.token) this.setToken(data.data.token);
    return data;
  }

  /** Get the current authenticated user's profile. Requires a token. */
  async getMe() {
    return this.request('/api/auth/me');
  }

  /** Clear token and return to the caller (caller handles redirect if needed). */
  logout() {
    this.clearToken();
  }

  // ── Routing ────────────────────────────────────────────────────────────────

  /**
   * Calculate a route between two points.
   * @param {{ lat, lng }} origin
   * @param {{ lat, lng }} destination
   * @param {'car'|'foot'|'transit'|'multimodal'} mode
   * @param {object} options  - avoidHazards, maxWalkDistance, departureTime, steps
   */
  async calculateRoute(origin, destination, mode = 'car', options = {}) {
    return this.request('/api/route', {
      method: 'POST',
      body: JSON.stringify({ origin, destination, mode, options }),
    });
  }

  /**
   * Snap a coordinate to the nearest road/path.
   * @param {number} lng
   * @param {number} lat
   * @param {'car'|'foot'|'bike'} mode
   */
  async snapPoint(lng, lat, mode = 'car') {
    return this.request(`/api/route/snap?lng=${lng}&lat=${lat}&mode=${mode}`);
  }

  /**
   * Find transit stops near a point.
   * @param {number} lng
   * @param {number} lat
   * @param {number} radius  meters, default 600
   */
  async getNearbyTransitStops(lng, lat, radius = 600) {
    return this.request(`/api/route/transit-stops?lng=${lng}&lat=${lat}&radius=${radius}`);
  }

  /**
   * Forward geocode an address to coordinates.
   * @param {string} query
   * @param {{ countrycodes?: string, limit?: number }} options
   */
  async geocode(query, options = {}) {
    const p = new URLSearchParams({ q: query });
    if (options.countrycodes) p.set('countrycodes', options.countrycodes);
    if (options.limit)        p.set('limit', String(options.limit));
    return this.request(`/api/route/geocode?${p}`);
  }

  /**
   * Reverse geocode coordinates to an address.
   * @param {number} lat
   * @param {number} lng
   */
  async reverseGeocode(lat, lng) {
    return this.request(`/api/route/reverse-geocode?lat=${lat}&lng=${lng}`);
  }

  /**
   * Autocomplete for address search inputs (min 3 chars).
   * @param {string} query
   * @param {{ countrycodes?: string }} options
   */
  async autocomplete(query, options = {}) {
    const p = new URLSearchParams({ q: query });
    if (options.countrycodes) p.set('countrycodes', options.countrycodes);
    return this.request(`/api/route/autocomplete?${p}`);
  }

  // ── Hazards ────────────────────────────────────────────────────────────────

  /**
   * Report a new hazard. Requires authentication.
   * @param {'road_closure'|'flooding'|'construction'|'accident'|'pothole'|'landslide'|'unsafe_area'|'other'} type
   * @param {number} lat
   * @param {number} lng
   * @param {'low'|'medium'|'high'|'critical'} severity
   * @param {string} description
   */
  async reportHazard(type, lat, lng, severity = 'medium', description = '') {
    return this.request('/api/hazards', {
      method: 'POST',
      body: JSON.stringify({ type, lat, lng, severity, description }),
    });
  }

  /**
   * Get all active hazards within a bounding box.
   * @param {number} minLng
   * @param {number} minLat
   * @param {number} maxLng
   * @param {number} maxLat
   */
  async getHazards(minLng, minLat, maxLng, maxLat) {
    return this.request(
      `/api/hazards?minLng=${minLng}&minLat=${minLat}&maxLng=${maxLng}&maxLat=${maxLat}`
    );
  }

  /**
   * Community-confirm a hazard is still present.
   * @param {string} hazardId  UUID
   */
  async confirmHazard(hazardId) {
    return this.request(`/api/hazards/${hazardId}/confirm`, { method: 'POST' });
  }
}

// Single global instance used by every page
const navigationAPI = new NavigationAPI();
