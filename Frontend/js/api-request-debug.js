  // ── Core request ───────────────────────────────────────────────────────────
  async request(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token   = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log(`[API] ${options.method || 'GET'} ${this.baseURL}${endpoint}`);

    let response;
    try {
      response = await fetch(`${this.baseURL}${endpoint}`, { ...options, headers });
    } catch (fetchErr) {
      console.error(`[API] Fetch error on ${endpoint}:`, fetchErr);
      const err = new Error('Could not reach the server. Please check your connection.');
      err.isNetworkError = true;
      throw err;
    }

    // Parse body — always JSON from this backend
    let data;
    try {
      data = await response.json();
    } catch {
      console.error(`[API] Failed to parse JSON response from ${endpoint}`, response.status);
      const err = new Error('Server returned an unexpected response.');
      err.status = response.status;
      throw err;
    }

    console.log(`[API] Response ${response.status} from ${endpoint}:`, data);

    if (!response.ok) {
      // 401: token expired or invalid — clear it and redirect to login,
      // but NOT if we are already on the login page (avoids infinite loops).
      if (response.status === 401) {
        this.clearToken();
        const path = window.location.pathname;
        const onLogin = path.endsWith('/login1.html') || path.endsWith('/pages/login1.html') || path === '/';
        if (!onLogin) window.location.href = '/pages/login1.html';
      }

      // Build a typed error that callers can switch on by .status
      const err = new Error(data.error || `Request failed (${response.status})`);
      err.status  = response.status;
      err.details = data.details || null;   // express-validator array (v7: each item has .path)
      err.code    = data.code    || null;   // e.g. 'NO_ROUTE_FOUND', 'LOCATION_UNREACHABLE'
      console.error(`[API] Error response from ${endpoint}:`, err.message);
      throw err;
    }

    return data;
  }
