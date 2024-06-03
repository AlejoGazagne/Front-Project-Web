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

/// CARGA INICIAL DE PUBLICACIONES ///

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

// CARGA DE PUBLICACIONES

async function getPosts() {
  fetch(`http://localhost:3010/properties/${currentPage}`, {
    method: "GET",
  }).then(async (response) => {

    const rsp = await response.json();

    loadPosts(rsp.data);

  }).catch((error) => {
    console.error("Error:", error);
  });
}

window.addEventListener("load", async () => {
  await getFavorites();
  await getPosts();

});

// ---------BUSQUEDA POR FILTROS--------- //

async function searchPosts(urlParameters) {
  fetch(`http://localhost:3010/properties/search/${urlParameters}`, {
    method: "GET",
  }).then(async (response) => {
    const rsp = await response.json();
    if (rsp.data.length != 0) {
      postSection.innerHTML = "<h2>Disculpe... No encontramos coincidencias</h2>"
    }
    loadPosts(rsp.data);
  }).catch((error) => {
    console.log("Error:", error);
  });
}



search.addEventListener("click", async () => {
  event.preventDefault();

  currentPage = 1;

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

  console.log(urlParameters)
  console.log(urlParameters.join('&'))

  searchPosts(urlParameters)
});

// ------------------------------------- //
