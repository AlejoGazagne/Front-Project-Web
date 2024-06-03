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
  center: [0, 0],
  zoom: 13,
});

// Carga los tiles desde el servidor de leaflet
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Agrega un marcador en la posición
let marker = L.marker([0, 0]).addTo(map);

async function getCarrouselTemplate() {
  const response = await fetch(
    "../../components/carrousel/carrousel.html"
  );

  const text = await response.text();
  return text;
}

function buildCarousel(frontImage, images) {
  // Obtén los contenedores del carrusel, los indicadores y las imágenes
  const carousel = document.querySelector('#carousel');
  const indicatorsContainer = carousel.querySelector('.carousel-indicators');
  const imagesContainer = carousel.querySelector('.carousel-inner');

  // Establece la imagen frontal como la primera imagen del carrusel
  const ImageActive = imagesContainer.querySelector('.carousel-item img');
  ImageActive.src = frontImage;

  // Itera sobre las imágenes de la publicación
  for (let i = 1; i < images.length; i++) {
    // Crea un nuevo indicador
    const newIndicator = document.createElement('button');
    newIndicator.type = 'button';
    newIndicator.dataset.bsTarget = '#carousel';
    newIndicator.dataset.bsSlideTo = i;
    newIndicator.setAttribute('aria-label', `Slide ${i + 1}`);
    indicatorsContainer.appendChild(newIndicator);

    // Crea un nuevo elemento de imagen
    const newImageItem = document.createElement('div');
    newImageItem.classList.add('carousel-item');
    const newImage = document.createElement('img');
    newImage.src = images[i];
    newImage.classList.add('card-image', 'd-block', 'w-100');
    newImage.alt = `Slide ${i + 1}`;
    newImageItem.appendChild(newImage);
    imagesContainer.appendChild(newImageItem);
  }
}

window.addEventListener("load", async () => {
  const carrousel = await getCarrouselTemplate();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  console.log(id)
  fetch(`http://localhost:3010/properties/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then(async (response) => {
    const rsp = await response.json()
    const publication = rsp.data;

    // Inyeccion del carrusel
    document.getElementById("carrousel-img").innerHTML = carrousel;
    console.log(publication.frontImage, publication.images)
    buildCarousel(publication.frontImage, publication.images)

    console.log(publication)
    document.getElementById("title").innerText = publication.title;
    document.getElementById("price").innerText = publication.price;
    document.getElementById("description").innerText = publication.content;
    document.getElementById("area").innerText = publication.area;
    document.getElementById("rooms").innerText = publication.rooms;
    document.getElementById("wc").innerText = publication.bathrooms;
    document.getElementById("garage").innerText = publication.garage;
    if (publication.pets) {
      document.getElementById("pets").innerText = "Si";
    }
    else {
      document.getElementById("pets").innerText = "No";
    }
    if (publication.pool) {
      document.getElementById("pool").innerText = "Si";
    }
    else {
      document.getElementById("pool").innerText = "No";
    }

    console.log(publication.ubication)
    const ubication = await getLatLng(publication.ubication);
    if (ubication) {
      map.setView(ubication, 13);
      marker.setLatLng(ubication);
    }
  }).catch((error) => {
    console.log(error);
  });
});

// Boton para envio de consulta, desarrollar cuando este implementado el back
btnContact.addEventListener("click", () => { });