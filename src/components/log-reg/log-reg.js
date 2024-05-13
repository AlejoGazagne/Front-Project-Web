const btnSesion = document.getElementById("iniciar-sesion");
const btnIrOlvContrasenia = document.getElementById("olvide-contrasenia");
const btnIrRegistrarse = document.getElementById("registrarme");

const mail = document.getElementById("gmail");
const password = document.getElementById("contrasenia");

const iniciarSesion = document.getElementById("init-sesion");

const recuperarContrasenia = document.getElementById("recuperar-contrasenia");
const continuarRecuperacion = document.getElementById("continuar-rec");

const registrarse = document.getElementById("regist");
const btnRegistrar = document.getElementById("probando");

const seleccionCuenta = document.getElementById("seleccion-cuenta");
const formVisitante = document.getElementById("formVisitante");
const emailUsuario = document.getElementById("regGmail");
const contraseniaUsuario = document.getElementById("regContrasenia");

const formPublicador = document.getElementById("formPublicador");
const nombrePublicador = document.getElementById("pubNombre");
const numeroPublicador = document.getElementById("pubNumero");
const emailPublicador = document.getElementById("pubGmail");
const contraseniaPublicador = document.getElementById("pubContrasenia");

const error = document.getElementById("error");

btnSesion.addEventListener("click", () => {
  if (mail.value != "" && password.value != "") {
    console.log("click");
    console.log(mail.value);
    console.log(password.value);
    // fetch('http://localhost:3000/login',{
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         email: mail.value,
    //         password: password.value
    //     })
    // }).then(async response  => {
    //     const rsp = await response.json();
    //     localStorage.setItem('token', rsp.token);
    //     localStorage.setItem('user', rsp.user);
    //     modalRegistro.classList.remove('mostrar');
    // })
  }
});

btnIrOlvContrasenia.addEventListener("click", () => {
  recuperarContrasenia.style.display = "flex";
  iniciarSesion.style.display = "none";
  registrarse.style.display = "none";
});

continuarRecuperacion.addEventListener("click", () => {
  recuperarContrasenia.style.display = "none";
  iniciarSesion.style.display = "flex";
});

btnIrRegistrarse.addEventListener("click", () => {
  registrarse.style.display = "flex";
  iniciarSesion.style.display = "none";
  recuperarContrasenia.style.display = "none";
});

seleccionCuenta.addEventListener("click", () => {
  if (seleccionCuenta.value == 1) {
    formVisitante.style.display = "flex";
    formPublicador.style.display = "none";
  }
  if (seleccionCuenta.value == 2) {
    formVisitante.style.display = "none";
    formPublicador.style.display = "flex";
  }
});

btnRegistrar.addEventListener("click", () => {
  event.preventDefault();
  if ((emailUsuario.value == "" || contraseniaUsuario.value == "") && seleccionCuenta.value == 1) {
    error.classList.add("mostrar");
    console.log("error");
  } else if (
    (nombrePublicador.value == "" ||
      numeroPublicador.value == "" ||
      emailPublicador.value == "" ||
      contraseniaPublicador.value == "") &&
    seleccionCuenta.value == 2
  ) {
    error.classList.add("mostrar");
    console.log("error");
  } else if (seleccionCuenta.value != 1 && seleccionCuenta.value != 2) {
    error.classList.add("mostrar");
    console.log("error");
  } else {
    error.classList.remove("mostrar");
    recuperarContrasenia.style.display = "none";
    iniciarSesion.style.display = "flex";
    registrarse.style.display = "none";
    console.log("click");
  }
});
