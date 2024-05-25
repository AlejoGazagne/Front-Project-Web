// Componentes Externos
const parent = window.parent.document;
const log_reg = parent.getElementById("log-reg");
const marcoFlotante = parent.getElementById("marco-flotante");
const atras = parent.getElementById("atras");
const navbar = parent.getElementById("navbar");
const btnSesion = navbar.contentDocument.getElementById("btn-sesion");
const btnProfile = navbar.contentDocument.getElementById("btn-profile");
const btnLogout = navbar.contentDocument.getElementById("btn-logout");


// Botones internos
const btnIniciarSesion = document.getElementById("iniciar-sesion");
const btnIrOlvContrasenia = document.getElementById("olvide-contrasenia");
const btnIrRegistrarse = document.getElementById("registrarme");

//Login
const iniciarSesion = document.getElementById("init-sesion");

const mail = document.getElementById("gmail");
const password = document.getElementById("contrasenia");

const recuperarContrasenia = document.getElementById("recuperar-contrasenia");
const continuarRecuperacion = document.getElementById("continuar-rec");

const registrarse = document.getElementById("regist");
const btnRegistrar = document.getElementById("btn-register");

// Registro de Cuenta
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

function modifyView() {
  log_reg.classList.remove("mostrar");
  atras.classList.remove("mostrar");
  marcoFlotante.classList.remove("mostrar");

  btnSesion.classList.remove("mostrar");
  btnProfile.classList.add("mostrar");
  btnLogout.classList.add("mostrar");
}

function register(bodyContent) {
  fetch("http://localhost:3010/account/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyContent,
  })
    .then(async (response) => {
      const rsp = await response.json();
      if (response.status !== 200) {
        error.innerHTML = rsp.error;
        error.classList.add("mostrar");
        return;
      }

      sessionStorage.setItem("token", rsp.token);

      modifyView();

      registrarse.style.display = "none";
      iniciarSesion.style.display = "flex";
      recuperarContrasenia.style.display = "none";
    })
    .catch((error) => {
      console.log(error);
    });
}


btnIniciarSesion.addEventListener("click", () => {
  event.preventDefault();
  error.classList.remove("mostrar");

  if (mail.value != "" && password.value != "") {

    let bodyContent = JSON.stringify({
      email: mail.value,
      password: password.value,
    });

    fetch("http://localhost:3010/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyContent,
    })
      .then(async (response) => {

        const rsp = await response.json()

        if (response.status === 200) {
          sessionStorage.setItem("token", rsp.token);
          modifyView();

        }
        else {
          error.innerHTML = "Email o contraseña incorrectos. <br>Deseas crear una cuenta? Pulsa el boton \"Registrarme\"";
          error.classList.add("mostrar");
        }


      })
      .catch((error) => {
        console.log(error);
      });
  }
  else {
    error.textContent = "Por favor, rellena todos los campos"
    error.classList.add("mostrar");
    console.log("error");

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

// seleccionCuenta.addEventListener("click", () => {
//   if (seleccionCuenta.value == 1) {
//     formVisitante.style.display = "flex";
//     formPublicador.style.display = "none";
//   }
//   if (seleccionCuenta.value == 2) {
//     formVisitante.style.display = "none";
//     formPublicador.style.display = "flex";
//   }
// });

btnRegistrar.addEventListener("click", () => {
  event.preventDefault();

  if (seleccionCuenta.value == 1 && emailPublicador.value != "" && contraseniaPublicador.value != "") {
    let bodyContent = JSON.stringify({
      email: emailPublicador.value,
      password: contraseniaPublicador.value,
      type: parseInt(seleccionCuenta.value),
      name: nombrePublicador.value,
      phoneNumber: numeroPublicador.value,
    });

    register(bodyContent);
  }
  else if (seleccionCuenta.value == 2 &&
    nombrePublicador.value != "" &&
    numeroPublicador.value != "" &&
    emailPublicador.value != "" &&
    contraseniaPublicador.value != "") {

    let bodyContent = JSON.stringify({
      name: nombrePublicador.value,
      phoneNumber: numeroPublicador.value,
      email: emailPublicador.value,
      password: contraseniaPublicador.value,
      type: parseInt(seleccionCuenta.value),
    });

    register(bodyContent);
  }
  else {
    error.textContent = "Por favor, rellena todos los campos"
    error.classList.add("mostrar");
    console.log("error");
  }

});
