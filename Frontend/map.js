
const stations = [
  { name: "Tunis", lat: 36.8065, lng: 10.1815 },
  { name: "Sousse", lat: 35.8256, lng: 10.6369 },
  { name: "Sfax", lat: 34.7406, lng: 10.7603 },
  { name: "Bizerte", lat: 37.2744, lng: 9.8739 }
];

// Initialize Leaflet map
const map = L.map('map').setView([36.8065, 10.1815], 7);

// Dark map theme
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CartoDB'
}).addTo(map);

// Gold icon for stations
const goldIcon = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  iconSize: [32, 32]
});

// Add stations on map
stations.forEach(station => {
  L.marker([station.lat, station.lng], { icon: goldIcon })
    .addTo(map)
    .bindPopup(station.name);
});

// Fill dropdowns
const fromSelect = document.getElementById("fromStation");
const toSelect = document.getElementById("toStation");
stations.forEach((s, i) => {
  fromSelect.innerHTML += `<option value="${i}">${s.name}</option>`;
  toSelect.innerHTML += `<option value="${i}">${s.name}</option>`;
});

let routeLayer = null;

// Show route
function showRoute() {
  const start = stations[fromSelect.value];
  const end = stations[toSelect.value];

  if (routeLayer) map.removeLayer(routeLayer);

  fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`)
    .then(res => res.json())
    .then(data => {
      const route = data.routes[0].geometry;

      routeLayer = L.geoJSON(route, { style: { color: "gold", weight: 5 } }).addTo(map);
      map.fitBounds(routeLayer.getBounds());
    })
    .catch(err => console.error("Routing error:", err));
}
