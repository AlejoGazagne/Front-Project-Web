let parent = window.parent.document;
let navbar = parent.getElementById("navbar");
let btnSesion = navbar.contentDocument.getElementById("btn-sesion");
let btnProfile = navbar.contentDocument.getElementById("btn-profile");

const btnIniciarSesion = document.getElementById("iniciar-sesion");
const btnIrOlvContrasenia = document.getElementById("olvide-contrasenia");
const btnIrRegistrarse = document.getElementById("registrarme");

const iniciarSesion = document.getElementById("init-sesion");

const mail = document.getElementById("gmail");
const password = document.getElementById("contrasenia");

const recuperarContrasenia = document.getElementById("recuperar-contrasenia");
const continuarRecuperacion = document.getElementById("continuar-rec");

const registrarse = document.getElementById("regist");
const btnRegistrar = document.getElementById("btn-register");

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

btnIniciarSesion.addEventListener("click", () => {
  event.preventDefault();
  error.classList.remove("mostrar");

  if (mail.value != "" && password.value != "") {

    let bodyContent = JSON.stringify({
      email: mail.value,
      password: password.value,
    });

    console.log(bodyContent);

    fetch("http://localhost:3010/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyContent,
    })
      .then(async (response) => {
      
        const rsp = await response.json()

        if(response.status === 200){
          sessionStorage.setItem("token", rsp.token);

          const index = window.parent.document;
          const log_reg = index.getElementById("log-reg");
          const marcoFlotante = index.getElementById("marco-flotante");
          const atras = index.getElementById("atras");

          log_reg.classList.remove("mostrar");
          atras.classList.remove("mostrar");
          marcoFlotante.classList.remove("mostrar");

          btnSesion.classList.remove("mostrar");
          btnProfile.classList.add("mostrar");
        }
        else{
          error.innerHTML = "Email o contraseña incorrectos. <br>Deseas crear una cuenta? Pulsa el boton \"Registrarme\"";
          error.classList.add("mostrar");
        }
        
        
      })
      .catch((error) => {
        console.log(error);
      });
  }
  else{
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

  if(seleccionCuenta.value == 1 && emailUsuario.value != "" && contraseniaUsuario.value != ""){
    let bodyContent = JSON.stringify({
      email: emailUsuario.value,
      password: contraseniaUsuario.value,
      type: parseInt(seleccionCuenta.value),
    });

    console.log(bodyContent)

    fetch("http://localhost:3010/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyContent,
    })
      .then(async (response) => {
        const rsp = await response.json();
        sessionStorage.setItem("token", rsp.token);

        const index = window.parent.document;
        const log_reg = index.getElementById("log-reg");
        const marcoFlotante = index.getElementById("marco-flotante");
        const atras = index.getElementById("atras");

        log_reg.classList.remove("mostrar");
        atras.classList.remove("mostrar");
        marcoFlotante.classList.remove("mostrar");

        registrarse.style.display = "none";
        iniciarSesion.style.display = "flex";
        recuperarContrasenia.style.display = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  }
  else if(seleccionCuenta.value == 2 && 
    nombrePublicador.value != "" && 
    numeroPublicador.value != "" && 
    emailPublicador.value != "" && 
    contraseniaPublicador.value != ""){
    
    let bodyContent = JSON.stringify({
      name: nombrePublicador.value,
      phoneNumber: numeroPublicador.value,
      email: emailPublicador.value,
      password: contraseniaPublicador.value,
      type: parseInt(seleccionCuenta.value),
    });

    console.log(bodyContent)

    fetch("http://localhost:3010/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyContent,
    })
      .then(async (response) => {
        const rsp = await response.json();
        sessionStorage.setItem("token", rsp.token);

        const index = window.parent.document;
        const log_reg = index.getElementById("log-reg");
        const marcoFlotante = index.getElementById("marco-flotante");
        const atras = index.getElementById("atras");

        log_reg.classList.remove("mostrar");
        atras.classList.remove("mostrar");
        marcoFlotante.classList.remove("mostrar");

        registrarse.style.display = "none";
        iniciarSesion.style.display = "flex";
        recuperarContrasenia.style.display = "none";
        
      })
      .catch((error) => {
        console.log(error);
      });
  }
  else{
    error.classList.add("mostrar");
    console.log("error");
  }
  
});
