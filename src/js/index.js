const navbar = document.getElementById("navbar");
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

    log_reg.addEventListener("load", () => {
      btnContinuar = log_reg.contentDocument.getElementById("continuar");
      btnIniciarSesion =
        log_reg.contentDocument.getElementById("iniciar-sesion");

      btnIniciarSesion.addEventListener("click", () => {
        console.log("click");
        if (inputGmail.value != "" && inputContrasenia.value != "") {
          fetch("http://localhost:3010/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: inputGmail.value,
              password: inputContrasenia.value,
            }),
          }).then(async (response) => {
            const rsp = await response.json();
            localStorage.setItem("token", rsp.token);
            localStorage.setItem("user", rsp.user);
            modalRegistro.classList.remove("mostrar");
          });
        }
      });
    });
  });
});

atras.addEventListener("click", () => {
  log_reg.classList.remove("mostrar");
  atras.classList.remove("mostrar");
  marcoFlotante.classList.remove("mostrar");
});
