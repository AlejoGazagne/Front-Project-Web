// LOGICA DEL HEADER //
// ------------------------------------- //
let navbar = document.getElementById("navbar");
const log_reg = document.getElementById("log-reg");

const marcoFlotante = document.getElementById("marco-flotante");

const inputGmail = log_reg.contentDocument.getElementById("gmail");
const inputContrasenia = log_reg.contentDocument.getElementById("contrasenia");
const atras = document.getElementById("atras");

navbar.addEventListener("load", () => {
  btnSesion = navbar.contentDocument.getElementById("btn-sesion");

  btnSesion.addEventListener("click", () => {
    log_reg.classList.add("mostrar");
    atras.classList.add("mostrar");
    marcoFlotante.classList.add("mostrar");
  });
});

atras.addEventListener("click", () => {
  log_reg.classList.remove("mostrar");
  atras.classList.remove("mostrar");
  marcoFlotante.classList.remove("mostrar");
});

// --------------LOGICA DE FILTROS------------------ //

let type = document.getElementById("type");
let operation = document.getElementById("operation");
let priceMin = document.getElementById("precio-min");
let priceMax = document.getElementById("precio-max");

let city = document.getElementById("city");
let neighborhood = document.getElementById("neighborhood");

let roomCount = document.getElementById("bedroomCount");

let bathroomCount = document.getElementById("bathroomCount");

let garageCount = document.getElementById("garageCount");

let pool = document.getElementById("poolCheck");
let pets = document.getElementById("petsCheck");

let search = document.getElementById("btnSearch");

let currentPage = 1;

let wasChecked = {};

pool.addEventListener("click", function () {
  if (wasChecked[this.id]) {
    this.checked = false;
  }
  wasChecked[this.id] = this.checked;
});

pets.addEventListener("click", function () {
  if (wasChecked[this.id]) {
    this.checked = false;
  }
  wasChecked[this.id] = this.checked;
});

/// FUNCIONES ///

async function getPostCardTemplate() {
  const response = await fetch(
    "../../components/catalogPostCard/cpostCard.html"
  );

  const text = await response.text();
  return text;
}

let postSection = document.getElementById("posts");
let favorites = [];

async function getFavorites() {
  if (sessionStorage.getItem("rol") === "user") {
    console.log("favoritos")
    await fetch("http://localhost:3010/user/favorite/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")
      }
    }).then(async (response) => {
      const rsp = await response.json();
      favorites = rsp.data;
      console.log(favorites)

    }).catch((error) => {
      console.log(error);
    });
  }
}

async function loadPosts(rsp) {

  const postCardTemplate = await getPostCardTemplate();

  postSection.innerHTML = "";

  for (let i = 0; i < rsp.length; i++) {
    let post = rsp[i];

    let newPost = postCardTemplate.replace('img-source', post.frontImage)
      .replace(/idPost/gi, post.id)
      .replace("Title", post.title)
      .replace("value", post.price)
      .replace("Description", post.content)
      .replace("Ubication", post.ubication)
      .replace("Rooms", post.rooms)
      .replace("WC", post.bathrooms)
      .replace("Garage", post.garage);

    postSection.insertAdjacentHTML("beforeend", newPost);

    // Boton Favorito
    let btnFav = document.querySelector(`[id-fav="${post.id}"]`)
    if (sessionStorage.getItem("rol") === "seller") {
      btnFav.style.display = "none";
    }
    else {
      // Verificacion de existencia en favoritoS
      for (let j = 0; j < favorites.length; j++) {
        console.log("vuelta " + favorites[j].postId + " " + post.id)
        if (favorites[j].id === post.id) {
          btnFav.classList.toggle("card__btn--like");
        }
      }

      btnFav.addEventListener("click", () => {
        event.preventDefault();
        if (sessionStorage.getItem("token") === null) {
          log_reg.classList.add("mostrar");
          atras.classList.add("mostrar");
          marcoFlotante.classList.add("mostrar");
          return;
        }
        let idPost = btnFav.getAttribute("id-fav");

        if (!btnFav.classList.contains("card__btn--like")) {
          btnFav.classList.toggle("card__btn--like");
          fetch("http://localhost:3010/user/favorite/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": sessionStorage.getItem("token")
            },
            body: JSON.stringify({
              postId: parseInt(idPost),
            })
          }).then(async (response) => {
            const rsp = await response.json()
            console.log(rsp)
          }).catch((error) => {
            console.log(error);
          });

        }
        else {
          btnFav.classList.remove("card__btn--like");
          fetch("http://localhost:3010/user/favorite/delete/" + idPost, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": sessionStorage.getItem("token")
            }
          }).then(async (response) => {
            const rsp = await response.json()
            console.log(rsp)
          }).catch((error) => {
            console.log(error);
          });
        }

      });
    }

    // Boton Ver Mas
    let btnVM = document.querySelector(`[data-id="${post.id}"]`)
    btnVM.addEventListener("click", () => {
      event.preventDefault();
      let idPost = btnVM.getAttribute("data-id");
      console.log("click en " + idPost);
      window.location.href = `../../../src/shd/publication/post.html?id=${idPost}`;
    });
  }

}

let pages;

async function buildPages(size) {
  pages = Math.ceil(size / 10);

  let pagination = document.getElementById("pagination");

  pagination.innerHTML = "";

  let previous = "<li class=\"page-item\">  <a id=\"previousPage\" class=\"page-link\" href=\"#\" aria-label=\"Previous\"> <span aria-hidden=\"true\">&laquo;</span> </a></li >";
  pagination.insertAdjacentHTML("beforeend", previous);

  for (let i = 1; i <= pages; i++) {
    let newPage = `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
    pagination.insertAdjacentHTML("beforeend", newPage);
  }

  let next = "<li class=\"page-item\"> <a id=\"nextPage\" class=\"page-link\" href=\"#\" aria-label=\"Next\"> <span aria-hidden=\"true\">&raquo;</span> </a> </li>";
  pagination.insertAdjacentHTML("beforeend", next);

  let paginationLinks = document.querySelectorAll('#pagination a');
  paginationLinks.forEach(link => {
    link.addEventListener('click', handlePaginationClick);
  });
}

// CARGA DE PUBLICACIONES

async function getPosts() {

  console.log("pagina actual " + currentPage)

  fetch(`http://localhost:3010/properties?page=${currentPage}`, {
    method: "GET",
  }).then(async (response) => {

    const rsp = await response.json();
    console.log(rsp)

    await buildPages(rsp.data.size);
    loadPosts(rsp.data.items);

  }).catch((error) => {
    console.error("Error:", error);
  });

}

window.addEventListener("load", async () => {
  await getFavorites();
  await getPosts();

});

// ---------BUSQUEDA POR FILTROS--------- //

async function searchPosts() {

  console.log("pagina actual " + currentPage)

  let filters = {
    type: type.value === "Tipo de propiedad" || type.value === "Ambos" ? "" : type.value,
    onSale: operation.value === "Operación" ? "" : operation.value === "Venta" ? true : false,
    priceMin: priceMin.value === "" ? "" : priceMin.value,
    priceMax: priceMax.value === "" ? "" : priceMax.value,
    city: city.value === "" ? "" : city.value,
    neighborhood: neighborhood.value === "" ? "" : neighborhood.value,
    roomCount: roomCount.value === "Habitaciones" ? "" : roomCount.value,
    bathroomCount: bathroomCount.value === "Baños" ? "" : bathroomCount.value,
    garageCount: garageCount.value === "Plazas de Garage" ? "" : garageCount.value,
    pool: pool.checked,
    pets: pets.checked,
    page: currentPage
  };

  let urlParameters = [];

  for (let [key, value] of Object.entries(filters)) {
    //console.log(key, value)  
    urlParameters.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  urlParameters = urlParameters.join("&");

  fetch(`http://localhost:3010/properties/search?${urlParameters}`, {
    method: "GET",
  }).then(async (response) => {
    const rsp = await response.json();
    if (rsp.data.size == 0) {
      postSection.innerHTML = "<h2>Disculpe... No encontramos coincidencias</h2>"
      return;
    }

    await buildPages(rsp.data.size);
    loadPosts(rsp.data.items);

  }).catch((error) => {
    console.log("Error:", error);
  });

  console.log("pagina actual " + currentPage + "\n paginas: " + pages)
}

let searchActive = false;

search.addEventListener("click", async () => {
  event.preventDefault();

  currentPage = 1;
  searchActive = true;
  await searchPosts();

});

// --------PAGINACION-------- //

function handlePaginationClick(event) {
  event.preventDefault();

  let target = event.currentTarget;

  // Si se hizo clic en "previous" y no estamos en la primera página
  if (target.id === 'previousPage' && currentPage > 1) {
    currentPage--;
  }
  // Si se hizo clic en "next" y no estamos en la última página
  else if (target.id === 'nextPage' && currentPage < pages) {
    currentPage++;
  }
  // Si se hizo clic en un número de página
  else if (!isNaN(target.textContent)) {
    currentPage = Number(target.textContent);
  }

  // Llama a la función correspondiente
  if (searchActive) {
    searchPosts();
  } else {
    getPosts();
  }
}