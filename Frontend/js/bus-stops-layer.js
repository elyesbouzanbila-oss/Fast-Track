/**
 * bus-stops-layer.js
 * ─────────────────────────────────────────────────────────────────────────
 * Adds a toggleable bus stop layer to any Leaflet map on the page.
 * Depends on:
 *   - Leaflet (already loaded)
 *   - Leaflet.markercluster (loaded below via CDN if not already present)
 *   - config.js + api-client.js (navigationAPI.request)
 *
 * Usage — call once after the map is initialised:
 *   initBusStopLayer(leafletMapInstance);
 *
 * The function adds a ⊞ Bus Stops toggle button to the map and lazily
 * fetches stops from the backend as the viewport moves.
 */

(function () {
  'use strict';

  // ── 1. Load Leaflet.markercluster if not already present ───────────────
  const CLUSTER_CSS = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
  const CLUSTER_DEF_CSS = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
  const CLUSTER_JS  = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';

  function loadAsset(tag, attrs) {
    return new Promise((resolve) => {
      const el = document.createElement(tag);
      Object.assign(el, attrs);
      el.onload = resolve;
      el.onerror = resolve; // don't block on CDN failure
      document.head.appendChild(el);
    });
  }

  async function ensureClusterLib() {
    if (window.L && window.L.markerClusterGroup) return; // already loaded
    await loadAsset('link', { rel: 'stylesheet', href: CLUSTER_CSS });
    await loadAsset('link', { rel: 'stylesheet', href: CLUSTER_DEF_CSS });
    await loadAsset('script', { src: CLUSTER_JS });
    // Wait until L.markerClusterGroup is available
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (window.L && window.L.markerClusterGroup) { clearInterval(check); resolve(); }
      }, 80);
    });
  }

  // ── 2. Custom bus stop SVG icon ────────────────────────────────────────

  function makeBusIcon(type = 'bus') {
    const icons = {
      bus:   { symbol: '🚌', color: '#d4af37' },
      tram:  { symbol: '🚋', color: '#4fc3f7' },
      metro: { symbol: '🚇', color: '#ab47bc' },
      train: { symbol: '🚉', color: '#ef5350' },
    };
    const { symbol, color } = icons[type] || icons.bus;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="40" viewBox="0 0 34 40">
        <defs>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.55)"/>
          </filter>
        </defs>
        <!-- Pin body -->
        <path d="M17 2 C9.3 2 3 8.3 3 16 C3 24.5 17 38 17 38 C17 38 31 24.5 31 16 C31 8.3 24.7 2 17 2Z"
              fill="${color}" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" filter="url(#shadow)"/>
        <!-- White circle -->
        <circle cx="17" cy="15" r="9" fill="rgba(0,0,0,0.55)"/>
        <!-- Icon text -->
        <text x="17" y="19.5" text-anchor="middle" font-size="11" font-family="Segoe UI Emoji,Apple Color Emoji,sans-serif">${symbol}</text>
      </svg>`;

    return L.divIcon({
      html: svg,
      className: 'bus-stop-icon',
      iconSize:   [34, 40],
      iconAnchor: [17, 40],
      popupAnchor:[0, -38],
    });
  }

  // ── 3. Popup content ───────────────────────────────────────────────────

  function makePopup(stop) {
    const wc = stop.wheelchair_boarding === 1 ? '♿ Accessible' :
               stop.wheelchair_boarding === 2 ? '🚫 Not accessible' : '';
    const ref = stop.platform_code ? `<div class="stop-ref">Ref: ${stop.platform_code}</div>` : '';
    const acc = wc ? `<div class="stop-acc">${wc}</div>` : '';
    const desc = stop.description ? `<div class="stop-desc">${stop.description}</div>` : '';

    return `
      <div style="
        font-family:'Segoe UI',Arial,sans-serif;
        background:#1a1a1a;
        color:#e8e0d9;
        padding:10px 14px;
        border-radius:8px;
        min-width:160px;
        max-width:220px;
        line-height:1.5;
      ">
        <div style="
          font-weight:700;
          font-size:0.95rem;
          color:#f5c518;
          margin-bottom:4px;
          border-bottom:1px solid rgba(212,175,55,0.25);
          padding-bottom:4px;
        ">🚌 ${stop.name}</div>
        ${desc}
        ${ref}
        ${acc}
        <div style="
          font-size:0.72rem;
          color:#5a5040;
          margin-top:6px;
        ">${stop.lat.toFixed(5)}, ${stop.lng.toFixed(5)}</div>
      </div>`;
  }

  // ── 4. Fetch stops from backend ────────────────────────────────────────

  async function fetchStopsInBounds(bounds) {
    const now = Date.now();
    if (fetchStopsInBounds.cooldownUntil && now < fetchStopsInBounds.cooldownUntil) {
      return [];
    }

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const key = [
      sw.lng.toFixed(3),
      sw.lat.toFixed(3),
      ne.lng.toFixed(3),
      ne.lat.toFixed(3),
    ].join(':');

    // Skip repeated requests for nearly identical viewports.
    if (fetchStopsInBounds.lastKey === key && fetchStopsInBounds.lastAt && (now - fetchStopsInBounds.lastAt) < 6000) {
      return [];
    }

    fetchStopsInBounds.lastKey = key;
    fetchStopsInBounds.lastAt = now;

    const url = `/api/route/stops-in-bbox?minLng=${sw.lng}&minLat=${sw.lat}&maxLng=${ne.lng}&maxLat=${ne.lat}&limit=200`;

    try {
      const data = await navigationAPI.request(url);
      return Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      if (err && err.status === 429) {
        // Back off when API says we're sending too many requests.
        fetchStopsInBounds.cooldownUntil = Date.now() + 20000;
      }
      console.warn('[bus-stops-layer] fetch failed:', err.message);
      return [];
    }
  }

  // ── 5. Main init function ──────────────────────────────────────────────

  async function initBusStopLayer(leafletMap) {
    if (!leafletMap) {
      console.error('[bus-stops-layer] No Leaflet map instance provided.');
      return;
    }

    // Load clustering library
    await ensureClusterLib();

    let clusterGroup   = null;
    let stopsVisible   = true;
    let loadedStopIds  = new Set();
    let isLoading      = false;
    let toggleBtn      = null;

    function createClusterGroup() {
      return L.markerClusterGroup({
        maxClusterRadius: 45,
        disableClusteringAtZoom: 15,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction(cluster) {
          const count = cluster.getChildCount();
          const size  = count < 10 ? 'sm' : count < 50 ? 'md' : 'lg';
          return L.divIcon({
            html: `<div class="bus-cluster bus-cluster--${size}">
                     <span>${count}</span>
                   </div>`,
            className: '',
            iconSize: L.point(40, 40),
          });
        },
      });
    }

    // ── Toggle button ──────────────────────────────────────────────────
    const BusToggleControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd() {
        const btn = L.DomUtil.create('button', 'bus-stops-toggle');
        btn.innerHTML = '🚌 Bus Stops';
        btn.title     = 'Toggle bus stop layer';
        L.DomEvent.disableClickPropagation(btn);
        toggleBtn = btn;

        // Default state: visible on load.
        btn.classList.add('bus-stops-toggle--active');

        btn.addEventListener('click', async () => {
          stopsVisible = !stopsVisible;
          btn.classList.toggle('bus-stops-toggle--active', stopsVisible);

          if (stopsVisible) {
            if (!clusterGroup) {
              clusterGroup = createClusterGroup();
              leafletMap.addLayer(clusterGroup);
            } else {
              leafletMap.addLayer(clusterGroup);
            }
            await loadVisibleStops();
          } else {
            if (clusterGroup) leafletMap.removeLayer(clusterGroup);
          }
        });

        return btn;
      },
    });

    leafletMap.addControl(new BusToggleControl());

    // ── Legend control ────────────────────────────────────────────────
    const BusLegendControl = L.Control.extend({
      options: { position: 'bottomleft' },
      onAdd() {
        const legend = L.DomUtil.create('div', 'bus-map-legend bus-map-legend--collapsed');
        legend.innerHTML = `
          <button class="bus-map-legend__toggle" type="button">🧾 Bus Map Guide</button>
          <div class="bus-map-legend__body">
            <div class="bus-map-legend__title">What You Are Seeing</div>
            <div class="bus-map-legend__row"><span class="bus-map-legend__icon">🚌</span><span>Single bus stop</span></div>
            <div class="bus-map-legend__row"><span class="bus-map-legend__dot bus-map-legend__dot--sm"></span><span>Few nearby stops</span></div>
            <div class="bus-map-legend__row"><span class="bus-map-legend__dot bus-map-legend__dot--md"></span><span>Many nearby stops</span></div>
            <div class="bus-map-legend__row"><span class="bus-map-legend__dot bus-map-legend__dot--lg"></span><span>Very dense stop area</span></div>
          </div>
        `;
        legend.querySelector('.bus-map-legend__toggle')?.addEventListener('click', () => {
          legend.classList.toggle('bus-map-legend--collapsed');
        });
        L.DomEvent.disableClickPropagation(legend);
        return legend;
      },
    });

    leafletMap.addControl(new BusLegendControl());

    // Show stops immediately on first load.
    clusterGroup = createClusterGroup();
    leafletMap.addLayer(clusterGroup);

    // ── Load stops for current viewport ───────────────────────────────
    async function loadVisibleStops() {
      if (!stopsVisible || isLoading) return;

      // Fetch from initial map zoom so stops are visible right away.
      if (leafletMap.getZoom() < 7) {
        if (clusterGroup) clusterGroup.clearLayers();
        loadedStopIds.clear();
        showZoomHint();
        return;
      }

      hideZoomHint();
      isLoading = true;

      const stops = await fetchStopsInBounds(leafletMap.getBounds());

      const newStops = stops.filter(s => !loadedStopIds.has(s.id));

      if (newStops.length && clusterGroup) {
        const markers = newStops.map(stop => {
          loadedStopIds.add(stop.id);
          const marker = L.marker([stop.lat, stop.lng], { icon: makeBusIcon() });
          marker.bindPopup(makePopup(stop), {
            maxWidth: 240,
            className: 'bus-popup',
          });
          return marker;
        });
        clusterGroup.addLayers(markers);
      }

      isLoading = false;
    }

    // Re-load when map moves (debounced)
    let moveTimer = null;
    leafletMap.on('moveend zoomend', () => {
      if (!stopsVisible) return;
      clearTimeout(moveTimer);
      moveTimer = setTimeout(loadVisibleStops, 1200);
    });

    // ── Zoom hint overlay ──────────────────────────────────────────────
    let zoomHint = null;

    function showZoomHint() {
      if (zoomHint) return;
      zoomHint = L.popup({ closeButton: false, autoClose: false, closeOnClick: false })
        .setLatLng(leafletMap.getCenter())
        .setContent(`<div style="
            font-family:'Segoe UI',Arial,sans-serif;
            color:#e8e0d9;background:#1a1a1a;
            padding:8px 14px;border-radius:8px;
            border:1px solid rgba(212,175,55,0.3);
            font-size:0.85rem;text-align:center;">
            🔍 Zoom in a bit more to see bus stops
          </div>`)
        .openOn(leafletMap);
    }
    function hideZoomHint() {
      if (zoomHint) { leafletMap.closePopup(zoomHint); zoomHint = null; }
    }

    await loadVisibleStops();
    if (toggleBtn) toggleBtn.classList.add('bus-stops-toggle--active');

    console.info('[bus-stops-layer] Initialised ✅ (visible by default)');
  }

  // ── 6. Inject cluster + toggle CSS ────────────────────────────────────

  const style = document.createElement('style');
  style.textContent = `
    /* Bus stop cluster bubbles */
    .bus-cluster {
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-weight: 700;
      color: #0d0d0d;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
      border: 2px solid rgba(0,0,0,0.3);
    }
    .bus-cluster--sm { width:36px;height:36px; font-size:0.8rem;  background:#d4af37; }
    .bus-cluster--md { width:42px;height:42px; font-size:0.85rem; background:#f5c518; }
    .bus-cluster--lg { width:50px;height:50px; font-size:0.9rem;  background:#ffde57; }

    /* Prevent default Leaflet DivIcon wrapper styling */
    .bus-stop-icon { background: none !important; border: none !important; }

    /* Toggle button */
    .bus-stops-toggle {
      padding: 7px 13px;
      background: rgba(18,18,18,0.92);
      color: #e8e0d9;
      border: 1.5px solid rgba(212,175,55,0.35);
      border-radius: 8px;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.4);
      transition: border-color .22s, background .22s, color .22s;
      white-space: nowrap;
    }
    .bus-stops-toggle:hover {
      border-color: #d4af37;
      background: rgba(26,26,26,0.96);
    }
    .bus-stops-toggle--active {
      background: rgba(212,175,55,0.15) !important;
      border-color: #d4af37 !important;
      color: #f5c518 !important;
    }

    /* Leaflet popup override for dark theme */
    .bus-popup .leaflet-popup-content-wrapper {
      padding: 0 !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }
    .bus-popup .leaflet-popup-content { margin: 0 !important; }
    .bus-popup .leaflet-popup-tip-container { display: none; }

    /* Map legend */
    .bus-map-legend {
      background: rgba(18,18,18,0.93);
      color: #e8e0d9;
      border: 1.5px solid rgba(212,175,55,0.35);
      border-radius: 10px;
      padding: 9px 10px;
      min-width: 190px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.35);
      backdrop-filter: blur(8px);
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.25;
    }
    .bus-map-legend__toggle {
      width: 100%;
      border: none;
      background: transparent;
      color: #f5c518;
      text-align: left;
      font-weight: 700;
      padding: 8px 8px 7px;
      cursor: pointer;
      border-bottom: 1px solid rgba(212,175,55,0.2);
    }
    .bus-map-legend--collapsed .bus-map-legend__body { display: none; }
    .bus-map-legend__body { padding-top: 5px; }
    .bus-map-legend__title {
      color: #f5c518;
      font-weight: 700;
      margin-bottom: 6px;
      border-bottom: 1px solid rgba(212,175,55,0.2);
      padding-bottom: 4px;
    }
    .bus-map-legend__row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 5px 0;
      white-space: nowrap;
    }
    .bus-map-legend__icon {
      width: 16px;
      text-align: center;
    }
    .bus-map-legend__dot {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      display: inline-block;
      border: 1px solid rgba(0,0,0,0.3);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
    }
    .bus-map-legend__dot--sm { background: #d4af37; }
    .bus-map-legend__dot--md { background: #f5c518; }
    .bus-map-legend__dot--lg { background: #ffde57; }
  `;
  document.head.appendChild(style);

  // ── 7. Expose globally ─────────────────────────────────────────────────
  window.initBusStopLayer = initBusStopLayer;

})();
