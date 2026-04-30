/**
 * map.js — Home page live map module.
 *
 * Provides initHomeMap() and showRoute(callback?) for the home page.
 * showRoute accepts an optional callback(result) so callers can display
 * distance/duration inline instead of relying on alert() or console.log.
 */

const MAP_STATIONS = [
  // Major Cities
  { name: 'Tunis',       lat: 36.8065, lng: 10.1815 },
  { name: 'Sousse',      lat: 35.8256, lng: 10.6369 },
  { name: 'Sfax',        lat: 34.7406, lng: 10.7603 },
  { name: 'Ariana',      lat: 36.8665, lng: 10.1647 },
  { name: 'Ben Arous',   lat: 36.7440, lng: 10.2280 },
  { name: 'Manouba',     lat: 36.8080, lng: 10.0950 },
  { name: 'La Marsa',    lat: 36.8782, lng: 10.3244 },
  { name: 'Carthage',    lat: 36.8586, lng: 10.3308 },
  { name: 'Sidi Bou Said', lat: 36.8700, lng: 10.3410 },
  { name: 'Rades',       lat: 36.7692, lng: 10.2747 },
  { name: 'Ezzahra',     lat: 36.7548, lng: 10.3050 },
  { name: 'Hammam Lif',  lat: 36.7247, lng: 10.3308 },
  
  // Northern Region
  { name: 'Bizerte',     lat: 37.2744, lng: 9.8739  },
  { name: 'Nabeul',      lat: 36.4561, lng: 10.7376 },
  { name: 'Hammamet',    lat: 36.3993, lng: 10.6067 },
  { name: 'Menzel Temime', lat: 36.7830, lng: 10.9650 },
  { name: 'Kélibia',     lat: 36.8474, lng: 11.0947 },
  { name: 'Korba',       lat: 36.5780, lng: 10.8580 },
  { name: 'Soliman',     lat: 36.7039, lng: 10.4900 },
  { name: 'Takelsa',     lat: 36.7830, lng: 10.6340 },
  { name: 'Tabarka',     lat: 36.9549, lng: 8.7580  },
  { name: 'Béja',        lat: 36.7256, lng: 9.1817  },
  { name: 'Jendouba',    lat: 36.5011, lng: 8.7802  },
  { name: 'Le Kef',      lat: 36.1740, lng: 8.7041  },
  { name: 'Siliana',     lat: 36.0833, lng: 9.3667  },
  { name: 'Zaghouan',    lat: 36.4029, lng: 10.1420 },
  { name: 'Mateur',      lat: 37.0400, lng: 9.6660  },
  { name: 'Menzel Bourguiba', lat: 37.1530, lng: 9.7850 },
  { name: 'Menzel Jemil', lat: 37.2390, lng: 9.9180 },
  { name: 'Testour',     lat: 36.5720, lng: 9.4430  },
  { name: 'Medjez El Bab', lat: 36.6560, lng: 9.6120 },
  
  // Central Region
  { name: 'Kairouan',    lat: 35.6781, lng: 10.0963 },
  { name: 'Monastir',    lat: 35.7706, lng: 10.8169 },
  { name: 'Mahdia',      lat: 35.5047, lng: 11.0631 },
  { name: 'Kasserine',   lat: 35.1667, lng: 8.8333  },
  { name: 'Sidi Bouzid', lat: 35.0403, lng: 9.4945  },
  { name: 'Sousse Riadh', lat: 35.8150, lng: 10.5950 },
  { name: 'Meknassy',    lat: 35.6300, lng: 10.8000 },
  { name: 'Msaken',      lat: 35.7350, lng: 10.5800 },
  { name: 'Hammam Sousse', lat: 35.8570, lng: 10.5950 },
  { name: 'Enfidha',     lat: 36.1420, lng: 10.3830 },
  { name: 'Sidi Bou Ali', lat: 35.9200, lng: 10.4650 },
  { name: 'Moknine',     lat: 35.6350, lng: 10.8980 },
  { name: 'Ksar Hellal', lat: 35.6470, lng: 10.8920 },
  { name: 'Jem',         lat: 35.2990, lng: 10.7080 },
  { name: 'El Djem',     lat: 35.3000, lng: 10.7160 },
  { name: 'Haffouz',     lat: 35.6300, lng: 9.6700  },
  { name: 'Oueslatia',   lat: 35.8490, lng: 9.5700  },
  { name: 'Sbikha',      lat: 35.9330, lng: 10.0200 },
  
  // Southern Region
  { name: 'Gafsa',       lat: 34.4258, lng: 8.7850  },
  { name: 'Gabès',       lat: 33.8869, lng: 10.0982 },
  { name: 'Médenine',    lat: 33.3614, lng: 10.5045 },
  { name: 'Tataouine',   lat: 32.9289, lng: 10.4506 },
  { name: 'Djerba',      lat: 33.8076, lng: 10.8451 },
  { name: 'Tozeur',      lat: 33.9197, lng: 8.1354  },
  { name: 'Kebili',      lat: 33.7044, lng: 8.9690  },
  { name: 'Douz',        lat: 33.4550, lng: 9.0200  },
  { name: 'Zarzis',      lat: 33.5030, lng: 11.1120 },
  { name: 'Métlaoui',    lat: 34.3270, lng: 8.4100  },
  { name: 'Mdhila',      lat: 34.3420, lng: 8.4050  },
  { name: 'Redeyef',     lat: 34.3870, lng: 8.1620  },
  { name: 'Sbeitla',     lat: 35.2350, lng: 9.0810  },
  { name: 'Ben Guerdane', lat: 33.1380, lng: 11.2140 },
  { name: 'Remada',      lat: 32.3250, lng: 10.3920 },
  { name: 'Bir Lahmar',  lat: 33.0900, lng: 10.3810 },
];

let homeMap        = null;
let homeRouteLayer = null;
let currentLocation = null;
let currentMarker   = null;
let selectedMapPoint = null;
let selectedPointMarker = null;
let isAwaitingPointPick = false;
let inMapStylesInjected = false;
let hazardLayer = null;
let hazardLoadTimer = null;
let hazardLoadSeq = 0;
let stationMarkers = [];
let highlightedStationNames = new Set();
let showAllStationMarkers = false;
const weatherCache = new Map();

const STATION_MARKER_ZOOM_THRESHOLD = 10;

function goldIcon() {
  return L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png', iconSize: [32, 32] });
}

function currentLocationIcon() {
  return L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', iconSize: [36, 36] });
}

function selectedPointIcon() {
  return L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', iconSize: [34, 34] });
}

function hazardPointIcon() {
  return L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', iconSize: [34, 34] });
}

function hazardTypeLabel(type) {
  return String(type || 'other')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function hazardSeverityLabel(severity) {
  return String(severity || 'medium').toUpperCase();
}

function hazardPopupContent(hazard) {
  const description = hazard.description ? `<div style="margin-top:6px;">${hazard.description}</div>` : '';
  const expiresAt = hazard.expires_at ? `<div style="margin-top:6px; font-size:0.72rem; color:#5a5040;">Expires: ${new Date(hazard.expires_at).toLocaleString()}</div>` : '';

  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;background:#1a1a1a;color:#e8e0d9;padding:10px 14px;border-radius:8px;min-width:180px;max-width:240px;line-height:1.45;">
      <div style="font-weight:700;font-size:0.95rem;color:#f5c518;margin-bottom:4px;border-bottom:1px solid rgba(212,175,55,0.25);padding-bottom:4px;">⚠️ ${hazardTypeLabel(hazard.type)}</div>
      <div>Severity: ${hazardSeverityLabel(hazard.severity)}</div>
      <div>Radius: ${hazard.radius_meters || 50} m</div>
      ${description}
      <div style="margin-top:6px;font-size:0.72rem;color:#5a5040;">${Number(hazard.lat).toFixed(5)}, ${Number(hazard.lng).toFixed(5)}</div>
      ${expiresAt}
    </div>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function weatherEmoji(code) {
  const numericCode = Number(code);
  if ([0].includes(numericCode)) return '☀️';
  if ([1, 2].includes(numericCode)) return '🌤️';
  if (numericCode === 3) return '☁️';
  if ([45, 48].includes(numericCode)) return '🌫️';
  if ([51, 53, 55].includes(numericCode)) return '🌦️';
  if ([56, 57].includes(numericCode)) return '🌧️';
  if ([61, 63, 65, 66, 67].includes(numericCode)) return '🌧️';
  if ([71, 73, 75, 77].includes(numericCode)) return '🌨️';
  if ([80, 81, 82].includes(numericCode)) return '🌧️';
  if ([85, 86].includes(numericCode)) return '🌨️';
  if ([95, 96, 99].includes(numericCode)) return '⛈️';
  return '🌡️';
}

function weatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Heavy freezing rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light showers',
    81: 'Showers',
    82: 'Violent showers',
    85: 'Snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Severe thunderstorm with hail',
  };

  return descriptions[Number(code)] || 'Unknown conditions';
}

function weatherCacheKey(lat, lng) {
  return `${Number(lat).toFixed(3)},${Number(lng).toFixed(3)}`;
}

async function fetchOpenMeteoWeather(lat, lng) {
  const cacheKey = weatherCacheKey(lat, lng);
  if (weatherCache.has(cacheKey)) return weatherCache.get(cacheKey);

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code');
  url.searchParams.set('forecast_days', '1');
  url.searchParams.set('timezone', 'auto');

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  let response;
  try {
    response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Open-Meteo request timed out. Please try again.');
    }
    throw err;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed (${response.status})`);
  }

  const data = await response.json();
  weatherCache.set(cacheKey, data);
  return data;
}

function formatWeatherCard(title, lat, lng, weatherData) {
  const current = weatherData?.current || {};
  const daily = weatherData?.daily || {};
  const units = weatherData?.current_units || {};
  const temperature = current.temperature_2m ?? 'n/a';
  const humidity = current.relative_humidity_2m ?? 'n/a';
  const wind = current.wind_speed_10m ?? 'n/a';
  const weatherCode = current.weather_code ?? daily.weather_code?.[0] ?? null;
  const dayMax = daily.temperature_2m_max?.[0];
  const dayMin = daily.temperature_2m_min?.[0];

  return `
    <div class="map-weather-card">
      <div class="map-weather-card__title">${escapeHtml(title)}</div>
      <div class="map-weather-card__summary">${weatherEmoji(weatherCode)} ${escapeHtml(weatherDescription(weatherCode))}</div>
      <div class="map-weather-card__grid">
        <div><span>Temp</span><strong>${escapeHtml(temperature)}${escapeHtml(units.temperature_2m || '°C')}</strong></div>
        <div><span>Humidity</span><strong>${escapeHtml(humidity)}${escapeHtml(units.relative_humidity_2m || '%')}</strong></div>
        <div><span>Wind</span><strong>${escapeHtml(wind)}${escapeHtml(units.wind_speed_10m || 'km/h')}</strong></div>
        <div><span>Today</span><strong>${dayMin ?? 'n/a'}${units.temperature_2m || '°C'} / ${dayMax ?? 'n/a'}${units.temperature_2m || '°C'}</strong></div>
      </div>
      <div class="map-weather-card__coords">${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}</div>
    </div>
  `;
}

function updateWeatherFeedback({ info = '', error = '', loading = false, html = '' }) {
  const statusEl = document.getElementById('map-weather-status');
  const resultsEl = document.getElementById('map-weather-results');
  if (statusEl) {
    statusEl.textContent = error || info || (loading ? 'Fetching weather…' : '');
    statusEl.style.display = (error || info || loading) ? 'block' : 'none';
    statusEl.classList.toggle('map-weather-status--error', Boolean(error));
  }
  if (resultsEl) {
    resultsEl.innerHTML = html;
    resultsEl.style.display = html ? 'block' : 'none';
  }
}

async function renderWeatherForPoint(point, title) {
  if (!point) {
    updateWeatherFeedback({ error: 'Pick or choose a location first.' });
    return;
  }

  try {
    updateWeatherFeedback({ loading: true, info: `Fetching weather for ${title}…` });
    const weather = await fetchOpenMeteoWeather(point.lat, point.lng);
    updateWeatherFeedback({
      html: formatWeatherCard(title, point.lat, point.lng, weather),
      info: `Weather loaded for ${title}.`,
    });
  } catch (err) {
    updateWeatherFeedback({ error: err?.message || 'Could not load weather.' });
  }
}

async function renderWeatherForStations() {
  try {
    updateWeatherFeedback({ loading: true, info: 'Fetching weather for all station markers…' });
    const weatherCards = await Promise.all(
      MAP_STATIONS.map(async (station) => {
        const weather = await fetchOpenMeteoWeather(station.lat, station.lng);
        return formatWeatherCard(station.name, station.lat, station.lng, weather);
      })
    );
    updateWeatherFeedback({
      html: `<div class="map-weather-grid">${weatherCards.join('')}</div>`,
      info: `Weather loaded for ${MAP_STATIONS.length} station locations.`,
    });
  } catch (err) {
    updateWeatherFeedback({ error: err?.message || 'Could not load weather for stations.' });
  }
}

function updateStationMarkerVisibility() {
  if (!homeMap) return;

  const shouldShowAll = showAllStationMarkers || homeMap.getZoom() >= STATION_MARKER_ZOOM_THRESHOLD;
  stationMarkers.forEach(({ marker, name }) => {
    const shouldShow = shouldShowAll || highlightedStationNames.has(name);
    marker.setOpacity(shouldShow ? 1 : 0);
    marker.options.interactive = shouldShow;
  });
}

function setHighlightedStationNames(names = []) {
  highlightedStationNames = new Set(names.filter(Boolean));
  updateStationMarkerVisibility();
}

function setShowAllStationMarkers(shouldShowAll) {
  showAllStationMarkers = Boolean(shouldShowAll);
  updateStationMarkerVisibility();
}

function clearHazardLayer() {
  if (hazardLayer && homeMap && homeMap.hasLayer(hazardLayer)) {
    hazardLayer.clearLayers();
  }
}

async function loadHazardsForCurrentView() {
  if (!homeMap) return;

  const loadId = ++hazardLoadSeq;
  const bounds = homeMap.getBounds().pad(0.12);
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  try {
    const response = await navigationAPI.getHazards(sw.lng, sw.lat, ne.lng, ne.lat);
    if (loadId !== hazardLoadSeq) return;

    if (!hazardLayer) {
      hazardLayer = L.layerGroup().addTo(homeMap);
    } else {
      hazardLayer.clearLayers();
    }

    const hazards = Array.isArray(response?.data) ? response.data : [];
    hazards.forEach((hazard) => {
      const lat = Number(hazard.lat);
      const lng = Number(hazard.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      L.marker([lat, lng], { icon: hazardPointIcon() })
        .bindPopup(hazardPopupContent(hazard))
        .addTo(hazardLayer);
    });
  } catch (err) {
    if (loadId === hazardLoadSeq) {
      console.warn('[map] Failed to load hazards:', err?.message || err);
    }
  }
}

function scheduleHazardReload() {
  if (hazardLoadTimer) clearTimeout(hazardLoadTimer);
  hazardLoadTimer = setTimeout(() => {
    loadHazardsForCurrentView();
  }, 250);
}

function updateRouteFeedback({ info = '', error = '' }) {
  const infoEl = document.getElementById('home-route-info');
  const errEl = document.getElementById('home-route-error');
  if (infoEl) {
    infoEl.textContent = info;
    infoEl.style.display = info ? 'block' : 'none';
  }
  if (errEl) {
    errEl.textContent = error;
    errEl.style.display = error ? 'block' : 'none';
  }

  const panelStatus = document.getElementById('map-route-status');
  if (panelStatus) {
    panelStatus.textContent = error || info || '';
    panelStatus.style.display = (error || info) ? 'block' : 'none';
    panelStatus.classList.toggle('map-route-status--error', Boolean(error));
  }
}

function injectInMapUiStyles() {
  if (inMapStylesInjected) return;
  inMapStylesInjected = true;

  const style = document.createElement('style');
  style.textContent = `
    .map-route-panel {
      min-width: 280px;
      max-width: 320px;
      background: rgba(17,17,17,0.92);
      border: 1.5px solid rgba(212,175,55,0.35);
      border-radius: 10px;
      color: #e8e0d9;
      font-family: 'Segoe UI', Arial, sans-serif;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      backdrop-filter: blur(6px);
      overflow: hidden;
    }
    .map-route-panel__toggle {
      width: 100%;
      border: none;
      background: transparent;
      color: #f5c518;
      padding: 9px 12px;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      border-bottom: 1px solid rgba(212,175,55,0.2);
    }
    .map-route-panel--collapsed .map-route-panel__body { display: none; }
    .map-route-panel__body {
      padding: 10px;
      max-height: min(70vh, 720px);
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .map-route-panel__label {
      display: block;
      font-size: 12px;
      margin-bottom: 4px;
      color: #bfae88;
    }
    .map-route-panel__section-title {
      margin: 10px 0 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #d7c7a1;
    }
    .map-route-panel__coords {
      margin: 0 0 8px;
      font-size: 11px;
      color: #bfae88;
      min-height: 16px;
    }
    .map-route-panel__input,
    .map-route-panel select {
      width: 100%;
      margin-bottom: 8px;
      border-radius: 7px;
      border: 1px solid rgba(212,175,55,0.25);
      background: #202020;
      color: #f1eadf;
      padding: 7px 8px;
      font-size: 12px;
      box-sizing: border-box;
    }
    .map-route-panel__input::placeholder {
      color: #8f8061;
    }
    .map-route-panel textarea {
      width: 100%;
      min-height: 58px;
      resize: vertical;
      margin-bottom: 8px;
      border-radius: 7px;
      border: 1px solid rgba(212,175,55,0.25);
      background: #202020;
      color: #f1eadf;
      padding: 7px 8px;
      font-size: 12px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .map-route-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      margin-top: 4px;
    }
    .map-route-actions button {
      border-radius: 8px;
      border: 1px solid rgba(212,175,55,0.35);
      padding: 7px 8px;
      font-size: 12px;
      background: rgba(32,32,32,0.95);
      color: #f5c518;
      cursor: pointer;
    }
    .map-route-actions button:hover { background: rgba(49,49,49,0.95); }
    .map-route-status {
      margin-top: 8px;
      padding: 8px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
      display: none;
      background: rgba(212,175,55,0.12);
      border: 1px solid rgba(212,175,55,0.25);
      color: #f5c518;
    }
    .map-route-status--error {
      background: rgba(224,92,92,0.12);
      border-color: rgba(224,92,92,0.4);
      color: #f19a9a;
    }

    .map-weather-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      margin-top: 4px;
    }
    .map-weather-actions button {
      border-radius: 8px;
      border: 1px solid rgba(75,180,255,0.35);
      padding: 7px 8px;
      font-size: 12px;
      background: rgba(28,36,44,0.95);
      color: #8ed0ff;
      cursor: pointer;
    }
    .map-weather-actions button:hover { background: rgba(40,54,66,0.95); }
    .map-weather-status {
      margin-top: 8px;
      padding: 8px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
      display: none;
      background: rgba(75,180,255,0.10);
      border: 1px solid rgba(75,180,255,0.25);
      color: #8ed0ff;
    }
    .map-weather-status--error {
      background: rgba(224,92,92,0.12);
      border-color: rgba(224,92,92,0.4);
      color: #f19a9a;
    }
    .map-weather-results {
      display: none;
      margin-top: 8px;
      max-height: 280px;
      overflow: auto;
      padding-right: 4px;
    }
    .map-weather-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .map-weather-card {
      border: 1px solid rgba(75,180,255,0.24);
      border-radius: 10px;
      padding: 10px;
      background: rgba(14,24,31,0.95);
      color: #e8f5ff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.22);
    }
    .map-weather-card__title {
      font-weight: 700;
      color: #8ed0ff;
      margin-bottom: 4px;
    }
    .map-weather-card__summary {
      margin-bottom: 8px;
      color: #d6ecfb;
      font-size: 12px;
    }
    .map-weather-card__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px 10px;
      font-size: 12px;
    }
    .map-weather-card__grid span {
      display: block;
      color: #87abc1;
      font-size: 11px;
      margin-bottom: 2px;
    }
    .map-weather-card__grid strong {
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
    }
    .map-weather-card__coords {
      margin-top: 8px;
      font-size: 11px;
      color: #87abc1;
    }

    .map-route-legend {
      min-width: 190px;
      background: rgba(17,17,17,0.92);
      border: 1.5px solid rgba(212,175,55,0.35);
      border-radius: 10px;
      color: #e8e0d9;
      font-family: 'Segoe UI', Arial, sans-serif;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      overflow: hidden;
    }
    .map-route-legend__toggle {
      width: 100%;
      border: none;
      background: transparent;
      color: #f5c518;
      padding: 8px 10px;
      text-align: left;
      font-weight: 700;
      cursor: pointer;
      border-bottom: 1px solid rgba(212,175,55,0.2);
    }
    .map-route-legend--collapsed .map-route-legend__body { display: none; }
    .map-route-legend__body { padding: 8px 10px; }
    .map-route-legend__row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      margin: 6px 0;
    }
    .map-route-legend__line {
      width: 22px;
      height: 0;
      border-top: 4px solid #f5c518;
      border-radius: 3px;
      display: inline-block;
    }
    .map-route-legend__line--current { border-top-color: #4fc3f7; }
    .map-route-legend__dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #f5c518;
      display: inline-block;
    }
    .map-route-legend__dot--current { background: #4fc3f7; }
  `;
  document.head.appendChild(style);
}

async function reverseGeocodeLabel(lat, lng) {
  try {
    const response = await navigationAPI.reverseGeocode(lat, lng);
    if (!response?.success) return '';
    const payload = response.data || {};
    return payload.display_name || payload.displayName || payload.label || payload.name || payload.address || '';
  } catch (_) {
    return '';
  }
}

function setSelectedMapPoint(lat, lng, label = '') {
  selectedMapPoint = { lat, lng };

  if (selectedPointMarker) homeMap.removeLayer(selectedPointMarker);
  const safeLabel = label ? `<br/>${label}` : '';

  selectedPointMarker = L.marker([lat, lng], { icon: selectedPointIcon() })
    .addTo(homeMap)
    .bindPopup(
      `<b>Selected place</b>${safeLabel}<br/>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}`
    )
    .openPopup();

  const selectedCoordsEl = document.getElementById('map-selected-coords');
  if (selectedCoordsEl) {
    selectedCoordsEl.textContent = `Selected: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

function resolveCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      },
      (err) => {
        if (err.code === 1) reject(new Error('Location permission denied. Please allow location access.'));
        else if (err.code === 2) reject(new Error('Location unavailable. Please try again.'));
        else if (err.code === 3) reject(new Error('Location request timed out. Please try again.'));
        else reject(new Error('Unable to get your current location.'));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  });
}

async function showCurrentLocationOnMap() {
  if (!homeMap) throw new Error('Map not ready yet.');

  const loc = await resolveCurrentLocation();
  currentLocation = loc;

  if (currentMarker) homeMap.removeLayer(currentMarker);
  currentMarker = L.marker([loc.lat, loc.lng], { icon: currentLocationIcon() })
    .addTo(homeMap)
    .bindPopup(`<b>Your current location</b><br/>Accuracy: ~${Math.round(loc.accuracy || 0)} m`)
    .openPopup();

  homeMap.setView([loc.lat, loc.lng], Math.max(homeMap.getZoom(), 13));
  updateRouteFeedback({ info: '📡 Current location found and centered on map.' });
  return loc;
}

function getStationByIndex(index) {
  const idx = parseInt(index, 10);
  return Number.isNaN(idx) ? null : MAP_STATIONS[idx] || null;
}

function normalizeStationQuery(value) {
  return String(value || '').trim().toLowerCase();
}

function getStationByQuery(query) {
  const normalized = normalizeStationQuery(query);
  if (!normalized) return null;

  const exactMatch = MAP_STATIONS.find((station) => station.name.toLowerCase() === normalized);
  if (exactMatch) return exactMatch;

  const startsWithMatch = MAP_STATIONS.find((station) => station.name.toLowerCase().startsWith(normalized));
  if (startsWithMatch) return startsWithMatch;

  return MAP_STATIONS.find((station) => station.name.toLowerCase().includes(normalized)) || null;
}

async function renderRoute(start, end, options = {}, callback) {
  const {
    buttonEl = null,
    idleText = '🗺️ Show Route',
    busyText = '⌛ Calculating…',
    routeColor = '#f5c518',
    errorPrefix = 'Could not calculate route',
    highlightStations = [],
  } = options;

  const fail = (msg) => {
    updateRouteFeedback({ error: msg });
    if (callback) callback({ error: msg });
  };

  if (!start || !end) return fail('Invalid route endpoints.');

  if (homeRouteLayer) { homeMap.removeLayer(homeRouteLayer); homeRouteLayer = null; }
  if (buttonEl) { buttonEl.disabled = true; buttonEl.textContent = busyText; }

  try {
    const response = await navigationAPI.calculateRoute(
      { lat: start.lat, lng: start.lng },
      { lat: end.lat,   lng: end.lng   },
      'car'
    );

    if (!response.success) throw new Error(response.error || 'Route failed');

    const routeData = response.data.route;

    homeRouteLayer = L.geoJSON(routeData.geometry, {
      style: { color: routeColor, weight: 5, opacity: 0.86 },
    }).addTo(homeMap);
    homeMap.fitBounds(homeRouteLayer.getBounds());
    setHighlightedStationNames(highlightStations);

    const dist = (routeData.distance / 1000).toFixed(2);
    const dur  = Math.round(routeData.duration / 60);
    const msg = `📍 ${dist} km  ·  ⏱ ${dur} min${routeData.demo === true ? '  (estimated)' : ''}`;

    updateRouteFeedback({ info: msg });
    if (callback) callback({ dist, dur, demo: routeData.demo === true });
  } catch (err) {
    fail(`${errorPrefix}: ${err.message || 'Unknown error'}`);
  } finally {
    if (buttonEl) { buttonEl.disabled = false; buttonEl.textContent = idleText; }
  }
}

function addInMapRoutingControl() {
  const stationOptionHtml = MAP_STATIONS
    .map((station) => `<option value="${station.name}"></option>`)
    .join('');

  const RouteControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd() {
      const wrap = L.DomUtil.create('div', 'map-route-panel map-route-panel--collapsed');
      wrap.innerHTML = `
        <button class="map-route-panel__toggle" type="button">🧭 Routing Options</button>
        <div class="map-route-panel__body">
          <label class="map-route-panel__label" for="mapFromStation">From</label>
          <input id="mapFromStation" class="map-route-panel__input" list="mapStationsList" placeholder="Type a place..." autocomplete="off" />
          <label class="map-route-panel__label" for="mapToStation">To</label>
          <input id="mapToStation" class="map-route-panel__input" list="mapStationsList" placeholder="Type a place..." autocomplete="off" />
          <datalist id="mapStationsList">${stationOptionHtml}</datalist>
          <div class="map-route-actions">
            <button id="map-btn-show-route" type="button">🗺️ Show Route</button>
            <button id="map-btn-locate-me" type="button">📡 Locate Me</button>
            <button id="map-btn-current-route" type="button">📍 Route From My Location</button>
            <button id="map-btn-toggle-all-stations" type="button">👁️ Show All Stations</button>
          </div>

          <div class="map-route-panel__section-title">Weather Check</div>
          <div class="map-weather-actions">
            <button id="map-btn-weather-selected" type="button">🌦️ Weather at Selected Place</button>
            <button id="map-btn-weather-from" type="button">🌦️ Weather at From Station</button>
            <button id="map-btn-weather-to" type="button">🌦️ Weather at To Station</button>
            <button id="map-btn-weather-all" type="button">🌍 Weather for All Stations</button>
          </div>
          <div id="map-weather-status" class="map-weather-status"></div>
          <div id="map-weather-results" class="map-weather-results"></div>

          <div class="map-route-panel__section-title">Pick Any Place On Map</div>
          <p id="map-selected-coords" class="map-route-panel__coords">Selected: none</p>
          <div class="map-route-actions">
            <button id="map-btn-pick-point" type="button">🎯 Pick Place On Map</button>
            <button id="map-btn-route-picked-from-current" type="button">📍 Current → Picked</button>
          </div>

          <div class="map-route-panel__section-title">Report Hazard On Picked Place</div>
          <label class="map-route-panel__label" for="mapHazardType">Hazard Type</label>
          <select id="mapHazardType">
            <option value="road_closure">Road closure</option>
            <option value="flooding">Flooding</option>
            <option value="construction">Construction</option>
            <option value="accident">Accident</option>
            <option value="pothole">Pothole</option>
            <option value="landslide">Landslide</option>
            <option value="unsafe_area">Unsafe area</option>
            <option value="other">Other</option>
          </select>

          <label class="map-route-panel__label" for="mapHazardSeverity">Severity</label>
          <select id="mapHazardSeverity">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <label class="map-route-panel__label" for="mapHazardDescription">Description (optional)</label>
          <textarea id="mapHazardDescription" placeholder="Describe what happened..."></textarea>

          <div class="map-route-actions">
            <button id="map-btn-report-hazard" type="button">⚠️ Report Hazard Here</button>
          </div>

          <div id="map-route-status" class="map-route-status"></div>
        </div>
      `;

      const toggleBtn = wrap.querySelector('.map-route-panel__toggle');
      const fromSel = wrap.querySelector('#mapFromStation');
      const toSel = wrap.querySelector('#mapToStation');
      const routeBtn = wrap.querySelector('#map-btn-show-route');
      const locateBtn = wrap.querySelector('#map-btn-locate-me');
      const currentRouteBtn = wrap.querySelector('#map-btn-current-route');
      const toggleAllStationsBtn = wrap.querySelector('#map-btn-toggle-all-stations');
      const pickPointBtn = wrap.querySelector('#map-btn-pick-point');
      const routePickedFromCurrentBtn = wrap.querySelector('#map-btn-route-picked-from-current');
      const hazardTypeSel = wrap.querySelector('#mapHazardType');
      const hazardSeveritySel = wrap.querySelector('#mapHazardSeverity');
      const hazardDescriptionEl = wrap.querySelector('#mapHazardDescription');
      const reportHazardBtn = wrap.querySelector('#map-btn-report-hazard');
      const weatherSelectedBtn = wrap.querySelector('#map-btn-weather-selected');
      const weatherFromBtn = wrap.querySelector('#map-btn-weather-from');
      const weatherToBtn = wrap.querySelector('#map-btn-weather-to');
      const weatherAllBtn = wrap.querySelector('#map-btn-weather-all');

      if (fromSel) fromSel.value = MAP_STATIONS[0]?.name || '';
      if (toSel) toSel.value = MAP_STATIONS[1]?.name || '';

      const syncStationHighlights = () => {
        if (showAllStationMarkers) return;
        const names = [];
        const start = getStationByQuery(fromSel?.value);
        const end = getStationByQuery(toSel?.value);
        if (start) names.push(start.name);
        if (end && end.name !== start?.name) names.push(end.name);
        setHighlightedStationNames(names);
      };

      fromSel?.addEventListener('input', syncStationHighlights);
      toSel?.addEventListener('input', syncStationHighlights);

      weatherSelectedBtn?.addEventListener('click', async () => {
        if (!selectedMapPoint) {
          updateWeatherFeedback({ error: 'Pick a place on the map first.' });
          return;
        }
        await renderWeatherForPoint(selectedMapPoint, 'Selected place');
      });

      weatherFromBtn?.addEventListener('click', async () => {
        const start = getStationByQuery(fromSel?.value);
        if (!start) {
          updateWeatherFeedback({ error: 'Please type a valid From station.' });
          return;
        }
        await renderWeatherForPoint(start, `From station: ${start.name}`);
      });

      weatherToBtn?.addEventListener('click', async () => {
        const end = getStationByQuery(toSel?.value);
        if (!end) {
          updateWeatherFeedback({ error: 'Please type a valid To station.' });
          return;
        }
        await renderWeatherForPoint(end, `To station: ${end.name}`);
      });

      weatherAllBtn?.addEventListener('click', async () => {
        await renderWeatherForStations();
      });

      toggleAllStationsBtn?.addEventListener('click', () => {
        const nextValue = !showAllStationMarkers;
        setShowAllStationMarkers(nextValue);
        toggleAllStationsBtn.textContent = nextValue ? '🙈 Hide Extra Stations' : '👁️ Show All Stations';
      });

      toggleBtn?.addEventListener('click', () => {
        wrap.classList.toggle('map-route-panel--collapsed');
      });

      routeBtn?.addEventListener('click', async () => {
        const start = getStationByQuery(fromSel?.value);
        const end = getStationByQuery(toSel?.value);
        if (!start || !end) {
          updateRouteFeedback({ error: 'Please type valid station names.' });
          return;
        }
        if (start.name === end.name) {
          updateRouteFeedback({ error: 'Please select different origin and destination stations.' });
          return;
        }
        if (fromSel) fromSel.value = start.name;
        if (toSel) toSel.value = end.name;
        setHighlightedStationNames([start.name, end.name]);
        await renderRoute(start, end, {
          buttonEl: routeBtn,
          idleText: '🗺️ Show Route',
          busyText: '⌛ Calculating…',
          routeColor: '#f5c518',
          errorPrefix: 'Could not calculate route',
          highlightStations: [start.name, end.name],
        });
      });

      locateBtn?.addEventListener('click', async () => {
        try {
          locateBtn.disabled = true;
          locateBtn.textContent = '⌛ Locating…';
          await showCurrentLocationOnMap();
        } catch (err) {
          updateRouteFeedback({ error: err.message || 'Could not get current location.' });
        } finally {
          locateBtn.disabled = false;
          locateBtn.textContent = '📡 Locate Me';
        }
      });

      currentRouteBtn?.addEventListener('click', async () => {
        const end = getStationByQuery(toSel?.value);
        if (!end) {
          updateRouteFeedback({ error: 'Please type a destination station.' });
          return;
        }
        try {
          currentRouteBtn.disabled = true;
          currentRouteBtn.textContent = '⌛ Locating…';
          if (toSel) toSel.value = end.name;
          setHighlightedStationNames([end.name]);
          const start = await showCurrentLocationOnMap();
          await renderRoute(start, end, {
            buttonEl: currentRouteBtn,
            idleText: '📍 Route From My Location',
            busyText: '⌛ Calculating…',
            routeColor: '#4fc3f7',
            errorPrefix: 'Could not calculate route from current location',
            highlightStations: [end.name],
          });
        } catch (err) {
          updateRouteFeedback({ error: err.message || 'Could not get current location.' });
          currentRouteBtn.disabled = false;
          currentRouteBtn.textContent = '📍 Route From My Location';
        }
      });

      pickPointBtn?.addEventListener('click', () => {
        isAwaitingPointPick = !isAwaitingPointPick;
        pickPointBtn.textContent = isAwaitingPointPick
          ? '✖ Cancel Picking'
          : '🎯 Pick Place On Map';

        if (isAwaitingPointPick) {
          updateRouteFeedback({ info: 'Click anywhere on the map to select a place.' });
        }
      });

      routePickedFromCurrentBtn?.addEventListener('click', async () => {
        if (!selectedMapPoint) {
          updateRouteFeedback({ error: 'Pick a place on the map first.' });
          return;
        }

        try {
          routePickedFromCurrentBtn.disabled = true;
          routePickedFromCurrentBtn.textContent = '⌛ Locating…';

          const start = currentLocation || await showCurrentLocationOnMap();
          await renderRoute(start, selectedMapPoint, {
            buttonEl: routePickedFromCurrentBtn,
            idleText: '📍 Current → Picked',
            busyText: '⌛ Locating…',
            routeColor: '#4fc3f7',
            errorPrefix: 'Could not route from current location',
            highlightStations: [],
          });
        } catch (err) {
          updateRouteFeedback({ error: err.message || 'Could not get current location.' });
        } finally {
          routePickedFromCurrentBtn.disabled = false;
          routePickedFromCurrentBtn.textContent = '📍 Current → Picked';
        }
      });

      reportHazardBtn?.addEventListener('click', async () => {
        if (!selectedMapPoint) {
          updateRouteFeedback({ error: 'Pick a place on the map before reporting a hazard.' });
          return;
        }

        const type = hazardTypeSel?.value || 'other';
        const severity = hazardSeveritySel?.value || 'medium';
        const description = (hazardDescriptionEl?.value || '').trim();

        try {
          reportHazardBtn.disabled = true;
          reportHazardBtn.textContent = '⌛ Reporting…';

          const response = await navigationAPI.reportHazard(
            type,
            selectedMapPoint.lat,
            selectedMapPoint.lng,
            severity,
            description
          );

          L.marker([selectedMapPoint.lat, selectedMapPoint.lng], { icon: hazardPointIcon() })
            .addTo(homeMap)
            .bindPopup(
              `<b>Hazard reported</b><br/>Type: ${type}<br/>Severity: ${severity}<br/>${description || 'No additional description.'}`
            );

          updateRouteFeedback({
            info: response?.message || 'Hazard reported successfully for the selected place.',
          });
          if (hazardDescriptionEl) hazardDescriptionEl.value = '';
        } catch (err) {
          if (err?.status === 401) {
            navigationAPI.clearToken();
            window.location.href = '../pages/login1.html';
            return;
          }
          updateRouteFeedback({ error: err?.message || 'Could not report hazard.' });
        } finally {
          reportHazardBtn.disabled = false;
          reportHazardBtn.textContent = '⚠️ Report Hazard Here';
        }
      });

      homeMap.on('click', async (event) => {
        if (!isAwaitingPointPick) return;

        isAwaitingPointPick = false;
        if (pickPointBtn) pickPointBtn.textContent = '🎯 Pick Place On Map';

        const { lat, lng } = event.latlng;
        setSelectedMapPoint(lat, lng);

        const label = await reverseGeocodeLabel(lat, lng);
        if (label) {
          setSelectedMapPoint(lat, lng, label);
          updateRouteFeedback({ info: `✅ Place selected: ${label}` });
        } else {
          updateRouteFeedback({ info: '✅ Place selected on map. You can now route or report hazard.' });
        }
      });

      L.DomEvent.disableClickPropagation(wrap);
      L.DomEvent.disableScrollPropagation(wrap);
      return wrap;
    },
  });

  homeMap.addControl(new RouteControl());
}

function renderInMapRouteLegend(container) {
  if (!container) return false;

  container.innerHTML = `
    <div class="map-route-legend map-route-legend--collapsed">
      <button class="map-route-legend__toggle" type="button">📖 Map Guide</button>
      <div class="map-route-legend__body">
        <div class="map-route-legend__row"><span class="map-route-legend__line"></span><span>Route from selected start point</span></div>
        <div class="map-route-legend__row"><span class="map-route-legend__line map-route-legend__line--current"></span><span>Route from your live location</span></div>
        <div class="map-route-legend__row"><span class="map-route-legend__dot"></span><span>City/station marker</span></div>
        <div class="map-route-legend__row"><span class="map-route-legend__dot" style="background:#5bd75b"></span><span>Place you picked on the map</span></div>
        <div class="map-route-legend__row"><span class="map-route-legend__dot" style="background:#eb5757"></span><span>Reported hazard</span></div>
        <div class="map-route-legend__row"><span class="map-route-legend__dot map-route-legend__dot--current"></span><span>Your current position</span></div>
      </div>
    </div>
  `;

  container.querySelector('.map-route-legend__toggle')?.addEventListener('click', () => {
    container.firstElementChild?.classList.toggle('map-route-legend--collapsed');
  });

  return true;
}

function addInMapRouteLegendControl() {
  const sidebarLegend = document.getElementById('map-guide');
  if (renderInMapRouteLegend(sidebarLegend)) {
    return;
  }

  const RouteLegend = L.Control.extend({
    options: { position: 'bottomright' },
    onAdd() {
      const legend = L.DomUtil.create('div', 'map-route-legend map-route-legend--collapsed');
      legend.innerHTML = `
        <button class="map-route-legend__toggle" type="button">📖 Map Guide</button>
        <div class="map-route-legend__body">
          <div class="map-route-legend__row"><span class="map-route-legend__line"></span><span>Route from selected start point</span></div>
          <div class="map-route-legend__row"><span class="map-route-legend__line map-route-legend__line--current"></span><span>Route from your live location</span></div>
          <div class="map-route-legend__row"><span class="map-route-legend__dot"></span><span>City/station marker</span></div>
          <div class="map-route-legend__row"><span class="map-route-legend__dot" style="background:#5bd75b"></span><span>Place you picked on the map</span></div>
          <div class="map-route-legend__row"><span class="map-route-legend__dot" style="background:#eb5757"></span><span>Reported hazard</span></div>
          <div class="map-route-legend__row"><span class="map-route-legend__dot map-route-legend__dot--current"></span><span>Your current position</span></div>
        </div>
      `;

      legend.querySelector('.map-route-legend__toggle')?.addEventListener('click', () => {
        legend.classList.toggle('map-route-legend--collapsed');
      });

      L.DomEvent.disableClickPropagation(legend);
      return legend;
    },
  });

  homeMap.addControl(new RouteLegend());
}

function initHomeMap() {
  if (homeMap) return;

  homeMap = L.map('map').setView([36.8065, 10.1815], 7);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &amp; CartoDB',
  }).addTo(homeMap);

  if (typeof initBusStopLayer === 'function') {
    initBusStopLayer(homeMap);
  }

  loadHazardsForCurrentView();
  homeMap.on('moveend zoomend', scheduleHazardReload);

  MAP_STATIONS.forEach(station => {
    const stationMarker = L.marker([station.lat, station.lng], { icon: goldIcon() })
      .addTo(homeMap)
      .bindPopup(`<b>${station.name}</b>`);
    stationMarkers.push({ marker: stationMarker, name: station.name });
    stationMarker.on('add', updateStationMarkerVisibility);
  });

  // Populate station dropdowns BEFORE Choices.js wraps them
  const fromSel = document.getElementById('fromStation');
  const toSel   = document.getElementById('toStation');
  if (fromSel && toSel) {
    fromSel.value = MAP_STATIONS[0]?.name || '';
    toSel.value = MAP_STATIONS[1]?.name || '';
  }

  injectInMapUiStyles();
  addInMapRoutingControl();
  const routePanel = document.querySelector('.map-route-panel');
  const routeSidebar = document.getElementById('map-controls');
  if (routePanel && routeSidebar && routePanel.parentElement !== routeSidebar) {
    routeSidebar.appendChild(routePanel);
  }
  addInMapRouteLegendControl();
  updateStationMarkerVisibility();
  homeMap.on('zoomend', updateStationMarkerVisibility);
  homeMap.on('moveend', updateStationMarkerVisibility);
  window.homeMap = homeMap;
}

/**
 * Calculate and display a route on the home map.
 * @param {Function} [callback] - optional fn(result) where result = { dist, dur, demo, error }
 */
async function showRoute(callback) {
  const fromSel = document.getElementById('fromStation');
  const toSel   = document.getElementById('toStation');
  const btn     = document.getElementById('btn-show-route');

  const start = getStationByQuery(fromSel ? fromSel.value : '');
  const end   = getStationByQuery(toSel   ? toSel.value   : '');

  const fail = (msg) => {
    if (callback) callback({ error: msg });
    else alert(msg);
  };

  if (!start || !end) {
    return fail('Please type valid departure and arrival stations.');
  }
  if (start.name === end.name) {
    return fail('Please select different origin and destination stations.');
  }

  if (fromSel) fromSel.value = start.name;
  if (toSel) toSel.value = end.name;

  await renderRoute(start, end, {
    buttonEl: btn,
    idleText: '🗺️ Show Route',
    busyText: '⌛ Calculating…',
    routeColor: '#f5c518',
    errorPrefix: 'Could not calculate route',
    highlightStations: [start.name, end.name],
  }, callback);
}

/**
 * Calculate route from geolocated current position to selected destination.
 * @param {Function} [callback] - optional fn(result) where result = { dist, dur, demo, error }
 */
async function showRouteFromCurrentLocation(callback, options = {}) {
  const toSel = document.getElementById('toStation');
  const btn   = options.buttonEl || document.getElementById('btn-route-from-current');

  const end = Number.isInteger(options.toIndex)
    ? MAP_STATIONS[options.toIndex] || null
    : getStationByQuery(toSel ? toSel.value : '');

  const fail = (msg) => {
    if (callback) callback({ error: msg });
    else alert(msg);
  };

  if (!end) {
    return fail('Please type a valid destination station.');
  }

  if (toSel) toSel.value = end.name;

  try {
    const start = await showCurrentLocationOnMap();
    await renderRoute(start, end, {
      buttonEl: btn,
      idleText: options.idleText || '📍 Route From My Location',
      busyText: options.busyText || '⌛ Calculating…',
      routeColor: '#4fc3f7',
      errorPrefix: 'Could not calculate route from current location',
      highlightStations: [end.name],
    }, callback);
  } catch (err) {
    const msg = err.message || 'Unknown error';
    fail(`Could not calculate route from current location: ${msg}`);
  }
}

window.showRoute   = showRoute;
window.showCurrentLocationOnMap = showCurrentLocationOnMap;
window.showRouteFromCurrentLocation = showRouteFromCurrentLocation;
window.initHomeMap = initHomeMap;
