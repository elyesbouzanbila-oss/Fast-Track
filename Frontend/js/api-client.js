/**
 * NavigationAPI — centralised frontend client for the FastTrack backend.
 * WITH FULL DEBUG LOGGING
 */
class NavigationAPI {
  constructor(baseURL) {
    this.baseURL = baseURL || API_CONFIG.BASE_URL;
    console.log('[API] Initialized with baseURL:', this.baseURL);
  }

  getToken()        { return localStorage.getItem('authToken'); }
  setToken(token)   { localStorage.setItem('authToken', token); }
  clearToken()      { localStorage.removeItem('authToken'); }

  async request(endpoint, options = {}) {
    const method = options.method || 'GET';
    const fullURL = `${this.baseURL}${endpoint}`;
    
    console.log(`[API] ${method} ${fullURL}`);
    
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token   = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[API] Token attached');
    } else {
      console.warn('[API] No token found');
    }

    let response;
    try {
      console.log('[API] Sending fetch...');
      response = await fetch(fullURL, { ...options, headers });
      console.log(`[API] Fetch returned with status ${response.status}`);
    } catch (fetchErr) {
      console.error('[API] Fetch failed:', fetchErr);
      const err = new Error('Could not reach the server. Please check your connection.');
      err.isNetworkError = true;
      throw err;
    }

    let data;
    try {
      data = await response.json();
      console.log('[API] Parsed response data:', data);
    } catch (parseErr) {
      console.error('[API] Failed to parse JSON:', parseErr);
      const err = new Error('Server returned an unexpected response.');
      err.status = response.status;
      throw err;
    }

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        const path = window.location.pathname;
        const onLogin = path.endsWith('/login1.html') || path.endsWith('/pages/login1.html') || path === '/';
        if (!onLogin) window.location.href = '/pages/login1.html';
      }

      const err = new Error(data.error || `Request failed (${response.status})`);
      err.status  = response.status;
      err.details = data.details || null;
      err.code    = data.code    || null;
      console.error('[API] Error response:', err.message);
      throw err;
    }

    console.log('[API] Request successful');
    return data;
  }

  async signup(name, email, password) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.data?.token) this.setToken(data.data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data?.token) this.setToken(data.data.token);
    return data;
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  logout() {
    this.clearToken();
  }

  async calculateRoute(origin, destination, mode = 'car', options = {}) {
    return this.request('/api/route', {
      method: 'POST',
      body: JSON.stringify({ origin, destination, mode, options }),
    });
  }

  async snapPoint(lng, lat, mode = 'car') {
    return this.request(`/api/route/snap?lng=${lng}&lat=${lat}&mode=${mode}`);
  }

  async getNearbyTransitStops(lng, lat, radius = 600) {
    return this.request(`/api/route/transit-stops?lng=${lng}&lat=${lat}&radius=${radius}`);
  }

  async geocode(query, options = {}) {
    const p = new URLSearchParams({ q: query });
    if (options.countrycodes) p.set('countrycodes', options.countrycodes);
    if (options.limit)        p.set('limit', String(options.limit));
    return this.request(`/api/route/geocode?${p}`);
  }

  async reverseGeocode(lat, lng) {
    return this.request(`/api/route/reverse-geocode?lat=${lat}&lng=${lng}`);
  }

  async autocomplete(query, options = {}) {
    const p = new URLSearchParams({ q: query });
    if (options.countrycodes) p.set('countrycodes', options.countrycodes);
    return this.request(`/api/route/autocomplete?${p}`);
  }

  async reportBug(bug) {
    console.log('[BUG API] reportBug called with:', JSON.stringify(bug, null, 2));
    
    const payload = {
      category: bug.category,
      impact: bug.impact || 'medium',
      title: bug.title,
      steps: bug.steps,
      expected_behavior: bug.expected_behavior || '',
      actual_behavior: bug.actual_behavior || '',
      extra_details: bug.extra_details || '',
      description: bug.description || '',
      source_page: bug.source_page || '',
    };
    
    console.log('[BUG API] Sending payload:', JSON.stringify(payload, null, 2));
    
    const result = await this.request('/api/bugs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    console.log('[BUG API] Success! Response:', result);
    return result;
  }

  async getBugs(limit = 100) {
    return this.request(`/api/bugs?limit=${limit}`);
  }

  async reportHazard(type, lat, lng, severity = 'medium', description = '') {
    return this.request('/api/hazards', {
      method: 'POST',
      body: JSON.stringify({ type, lat, lng, severity, description }),
    });
  }

  async getHazards(minLng, minLat, maxLng, maxLat) {
    return this.request(
      `/api/hazards?minLng=${minLng}&minLat=${minLat}&maxLng=${maxLng}&maxLat=${maxLat}`
    );
  }

  async confirmHazard(hazardId) {
    return this.request(`/api/hazards/${hazardId}/confirm`, { method: 'POST' });
  }
}

const navigationAPI = new NavigationAPI();
console.log('[API] navigationAPI instance created');
