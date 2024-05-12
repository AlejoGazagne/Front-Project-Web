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

pool.addEventListener("click", () => {
  console.log(pool.checked);
  if (pool.checked) {
    pool.checked = false;
  } else {
    pool.checked = true;
  }
});

pets.addEventListener("click", () => {
  if (pets.checked) {
    pets.checked = false;
  } else {
    pets.checked = true;
  }
});

search.addEventListener("click", () => {});