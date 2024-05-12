let map = L.map("map", {
  center: [-31.433519266013796, -64.27658547423133],
  zoom: 13,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);
