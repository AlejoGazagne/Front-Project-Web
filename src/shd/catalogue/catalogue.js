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

// ---------------------------------------------- //

let type = document.getElementById("type");
let price = document.getElementById("priceInput");

let btnDRoom = document.getElementById("decrementRoom");
let roomCount = document.getElementById("bedroomCount");
let btnIRoom = document.getElementById("incrementRoom");

let btnDBathroom = document.getElementById("decrementBathroom");
let bathroomCount = document.getElementById("bathroomCount");
let btnIBathroom = document.getElementById("incrementBathroom");

let btnDGarage = document.getElementById("decrementGarage");
let garageCount = document.getElementById("garageCount");
let btnIGarage = document.getElementById("incrementGarage");

let pool = document.getElementById("poolCheck");
let pets = document.getElementById("petsCheck");

let search = document.getElementById("btnSearch");

btnDRoom.addEventListener("click", () => {
  if (roomCount.value > 0) {
    roomCount.value = parseInt(roomCount.value) - 1;
  }
});

btnIRoom.addEventListener("click", () => {
  roomCount.value = parseInt(roomCount.value) + 1;
});

btnDBathroom.addEventListener("click", () => {
  if (bathroomCount.value > 0) {
    bathroomCount.value = parseInt(bathroomCount.value) - 1;
  }
});

btnIBathroom.addEventListener("click", () => {
  bathroomCount.value = parseInt(bathroomCount.value) + 1;
});

btnDGarage.addEventListener("click", () => {
  if (garageCount.value > 0) {
    garageCount.value = parseInt(garageCount.value) - 1;
  }
});

btnIGarage.addEventListener("click", () => {
  garageCount.value = parseInt(garageCount.value) + 1;
});

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

/////////////////////////////////////
//DESARROLLAR LA LOGICA CON EL BACK//
/////////////////////////////////////

async function getPostCardTemplate() {
  const response = await fetch(
    "../../components/catalogPostCard/cpostCard.html"
  );

  const text = await response.text();
  return text;
}

let postSection = document.getElementById("posts");

window.addEventListener("load", async () => {

  fetch("http://localhost:3010/catalogue", {
    method: "GET",
  }).then(async (response) => {
    const postCardTemplate = await getPostCardTemplate();
    const rsp = await response.json()

    console.log(rsp)

    rsp.forEach(function (post) {

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

      // Selecciona todos los elementos con la clase .card__description
      const descriptions = document.querySelectorAll('.card__description');

      descriptions.forEach(description => {

        if (description.scrollHeight > description.clientHeight) {
          // Si el texto es más alto, aplica la clase .fade
          description.classList.add('fade');
        }
      });

      // Boton Favorito
      let btnFav = document.querySelector(`[id-fav="${post.id}"]`)
      if (sessionStorage.getItem("rol") === "seller") {
        btnFav.style.display = "none";
      }
      btnFav.addEventListener("click", () => {
        event.preventDefault();
        let idPost = btnFav.getAttribute("id-fav");
        console.log("edit en " + idPost);
        fetch("http://localhost:3010/user/favorite/createFavorite", {
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

      });

      // Boton Ver Mas
      let btnVM = document.querySelector(`[data-id="${post.id}"]`)
      btnVM.addEventListener("click", () => {
        event.preventDefault();
        let idPost = btnVM.getAttribute("data-id");
        console.log("click en " + idPost);
        window.location.href = `../../../src/shd/publication/post.html?id=${idPost}`;
      });
    });



  })
    .catch((error) => {
      console.error("Error:", error);
    });
});



search.addEventListener("click", async () => {
  event.preventDefault();

  const postCardTemplate = await getPostCardTemplate();


  let post = postCardTemplate
    .replace("Title", "Casa en venta")
    .replace("Price", "Precio: $1000000")
    .replace("Description", "Casa en venta en la zona de la playa")
    .replace("Rooms", "3")
    .replace("WC", "2")
    .replace("Garage", "1");

  postSection.insertAdjacentHTML("beforeend", post);
});

// ------------------------------------- //
