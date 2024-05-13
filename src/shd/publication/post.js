let btnContact = document.getElementById("contactar");

// Crea el mapa con las coordenadas iniciales y un zoom por defecto
let map = L.map("map", {
  center: [-31.433519266013796, -64.27658547423133],
  zoom: 13,
});

// Carga los tiles desde el servidor de leaflet
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Agrega un marcador en la posición
let marker = L.marker([-31.433519266013796, -64.27658547423133]).addTo(map);

// Boton para envio de consulta, desarrollar cuando este implementado el back
btnContact.addEventListener("click", () => {});
