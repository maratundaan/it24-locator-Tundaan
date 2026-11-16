const map = L.map('map')
.setView([12.8797, 121.7740], 6);

L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
maxZoom: 20,
subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
attribution: '&copy; Google Maps'
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);

const form = document.getElementById('searchForm');
const input = document.getElementById('cityInput');

form.addEventListener('submit', async (event) => {
event.preventDefault();
const city = input.value.trim();
if (city.length < 2) return;
markerLayer.clearLayers();

const url =
'https://geocoding-api.open-meteo.com/v1/search?' +
new URLSearchParams({
name: city, count: '5', language: 'en', format: 'json'
});

const response = await fetch(url);
if (!response.ok) throw new Error('Request failed');
const data = await response.json();
const locations = data.results ?? [];

const bounds = [];
locations.forEach((place) => {
const coords = [place.latitude, place.longitude];
bounds.push(coords);
L.marker(coords).addTo(markerLayer)
.bindPopup(place.name);
});

if (bounds.length === 1) map.setView(bounds[0], 11);
else if (bounds.length > 1)
map.fitBounds(bounds, { padding: [35, 35] });
});
