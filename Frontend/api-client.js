// Reusable API Client for Frontend
class NavigationAPI {
  constructor(baseURL) {
    this.baseURL = baseURL || API_CONFIG.BASE_URL;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/login1.html';
        }
        
        const error = new Error(data.error || 'API Error');
        error.status = response.status;
        error.details = data.details;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth Endpoints
  async signup(name, email, password) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // Routing Endpoints
  async calculateRoute(origin, destination, mode = 'car', options = {}) {
    return this.request('/api/route', {
      method: 'POST',
      body: JSON.stringify({ origin, destination, mode, options })
    });
  }

  async snapPoint(lng, lat, mode = 'car') {
    return this.request(`/api/route/snap?lng=${lng}&lat=${lat}&mode=${mode}`);
  }

  async getNearbyTransitStops(lng, lat, radius = 600) {
    return this.request(`/api/route/transit-stops?lng=${lng}&lat=${lat}&radius=${radius}`);
  }

  // Hazard Endpoints
  async reportHazard(type, lat, lng, severity = 'medium', description = '') {
    return this.request('/api/hazards', {
      method: 'POST',
      body: JSON.stringify({ type, lat, lng, severity, description })
    });
  }

  async getHazards(minLng, minLat, maxLng, maxLat) {
    return this.request(
      `/api/hazards?minLng=${minLng}&minLat=${minLat}&maxLng=${maxLng}&maxLat=${maxLat}`
    );
  }

  async confirmHazard(hazardId) {
    return this.request(`/api/hazards/${hazardId}/confirm`, {
      method: 'POST'
    });
  }
}

// Initialize globally
const navigationAPI = new NavigationAPI();
