let btnContact = document.getElementById("contactar");

async function getLatLng(address) {
  let ubication;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
    );
    const data = await response.json();
    if (data.length > 0) {
      ubication = [data[0].lat, data[0].lon];
    } else {
      console.log("No se encontró la dirección");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return ubication;
}

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
btnContact.addEventListener("click", () => { });

async function getCarrouselTemplate() {
  const response = await fetch(
    "../../components/carrousel/carrousel.html"
  );

  const text = await response.text();
  return text;
}

window.addEventListener("load", async () => {
  const carrousel = await getCarrouselTemplate();


  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  fetch(`http://localhost:3010/publication/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": sessionStorage.getItem("token")
    }
  }).then(async (response) => {
    const rsp = await response.json()
    const publication = rsp.message;
    document.getElementById("title").innerText = publication.title;
    document.getElementById("price").innerText = publication.price;
    document.getElementById("description").innerText = publication.description;
    document.getElementById("address").innerText = publication.address;
    document.getElementById("rooms").innerText = publication.rooms;
    document.getElementById("bathrooms").innerText = publication.bathrooms;
    document.getElementById("garages").innerText = publication.garages;
    document.getElementById("pets").innerText = publication.pets;
    document.getElementById("pool").innerText = publication.pool;
    document.getElementById("garden").innerText = publication.garden;
    document.getElementById("barbecue").innerText = publication.barbecue;
    document.getElementById("floor").innerText = publication.floor;
    document.getElementById("expenses").innerText = publication.expenses;
    document.getElementById("operation").innerText = publication.operation;
    document.getElementById("type").innerText = publication.type;
    document.getElementById("status").innerText = publication.status;
    document.getElementById("date").innerText = publication.date;
    document.getElementById("user").innerText = publication.user;
    document.getElementById("phone").innerText = publication.phone;
    document.getElementById("email").innerText = publication.email;

    const ubication = await getLatLng(publication.address);
    if (ubication) {
      map.setView(ubication, 13);
      marker.setLatLng(ubication);
    }
  }).catch((error) => {
    console.log(error);
  });
});