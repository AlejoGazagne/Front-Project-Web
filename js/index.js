const navbar = document.getElementById("navbar");
const modalRegistro = document.getElementById("modal-registro");
const inputGmail = document.getElementById("gmail");
const inputContrasenia = document.getElementById("contrasenia");

navbar.addEventListener('load', () => {
  btnRegistro = navbar.contentDocument.getElementById("btn-registro");
  
  btnRegistro.addEventListener('click', () => {
    btnContinuar = document.getElementById("continuar");

    modalRegistro.classList.add('mostrar');

    btnContinuar.addEventListener('click', () => {
      if(inputGmail.value != null && inputContrasenia.value != null){
      console.log("entro?")
      fetch('http://localhost:3000/login',{
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: inputGmail.value,
          password: inputContrasenia.value
        })
      }).then(async response  => {
        const rsp = await response.json();
        localStorage.setItem('token', rsp.token);
        localStorage.setItem('user', rsp.user);
        modalRegistro.classList.remove('mostrar');
      })

      }
    });

  });

});