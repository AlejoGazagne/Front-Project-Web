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
const nombreUsuario = document.getElementById("regNombre")
const numeroUsuario = document.getElementById("regNumero")
const emailUsuario = document.getElementById("regGmail");
const contraseniaUsuario = document.getElementById("regContrasenia");

const formPublicador = document.getElementById("formPublicador");
const imagenPublicador = document.getElementById("pubImage")
const nombrePublicador = document.getElementById("pubNombre");
const numeroPublicador = document.getElementById("pubNumero");
const descripcionPublicador = document.getElementById("pubDescripcion")
const emailPublicador = document.getElementById("pubGmail");
const contraseniaPublicador = document.getElementById("pubContrasenia");

const error = document.getElementById("error");

// Funciones

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

      modifyView();

      registrarse.style.display = "none";
      iniciarSesion.style.display = "flex";
      recuperarContrasenia.style.display = "none";

      sessionStorage.setItem("token", rsp.token);
      // Fetch para setear el rol
      fetch("http://localhost:3010/validate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("token")
        }
      }).then(async (response) => {
        const rsp = await response.json()
        sessionStorage.setItem("rol", rsp.message);
      }).catch((error) => {
        console.log(error);
      });


    })
    .catch((error) => {
      console.log(error);
    });
}

// Inicio de Sesion

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
          // Fetch para setear el rol
          fetch("http://localhost:3010/validate", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": sessionStorage.getItem("token")
            }
          }).then(async (response) => {
            const rsp = await response.json()
            sessionStorage.setItem("rol", rsp.message);
          }).catch((error) => {
            console.log(error);
          });
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

// Cambios de vista

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

// Generacion de Link para imagen de perfil
async function uploadImage(image) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: "Client-ID 53fe1a7ee9c3b07",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data.link;
}

// Registro

btnRegistrar.addEventListener("click", () => {
  event.preventDefault();

  if (seleccionCuenta.value == 1 && emailUsuario.value != "" && contraseniaUsuario.value != ""
    && nombreUsuario.value != "" && numeroUsuario.value != "") {
    let bodyContent = JSON.stringify({
      name: nombreUsuario.value,
      phoneNumber: numeroUsuario.value,
      email: emailUsuario.value,
      password: contraseniaUsuario.value,
      type: parseInt(seleccionCuenta.value),
    });

    register(bodyContent);
  }
  else if (seleccionCuenta.value == 2 &&
    nombrePublicador.value != "" &&
    numeroPublicador.value != "" &&
    emailPublicador.value != "" &&
    contraseniaPublicador.value != "") {

    // Carga de imagen y generacion de link

    let urlImage;
    imagenPublicador.addEventListener("change", async (e) => {
      const file = e.target.files;

      console.log(file)

      if (!file) {
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = async () => {
        urlImage = await uploadImage(file[0]);
      }
    })

    let bodyContent = JSON.stringify({
      profileImage: urlImage,
      name: nombrePublicador.value,
      phoneNumber: numeroPublicador.value,
      description: descripcionPublicador.value,
      email: emailPublicador.value,
      password: contraseniaPublicador.value,
      type: parseInt(seleccionCuenta.value),
    });

    console.log(bodyContent)

    register(bodyContent);
  }
  else {
    error.textContent = "Por favor, rellena todos los campos"
    error.classList.add("mostrar");
    console.log("error");
  }

});
