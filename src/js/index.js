const navbar = document.getElementById("navbar");
const log_reg = document.getElementById("log-reg");
const marcoFlotante = document.getElementById("marco-flotante");

const atras = document.getElementById("atras");

navbar.addEventListener("load", () => {
  let btnSesion = navbar.contentDocument.getElementById("btn-sesion");

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
