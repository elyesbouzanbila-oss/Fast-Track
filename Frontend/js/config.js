// API Configuration
const API_CONFIG = {
  // Set dynamically based on environment
  BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : `${window.location.protocol}//${window.location.hostname}:3000`,
  
  // Or hardcode for specific deployment:
  // BASE_URL: 'https://api.your-domain.com'
};

// Optionally export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
