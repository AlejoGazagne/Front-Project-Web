const navbar = document.getElementById("navbar");

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3010/api/usuarios")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

navbar.addEventListener("load", () => {
  let btnCatalogue = navbar.contentDocument.getElementById("btn-catalogue");
  let btnPost = navbar.contentDocument.getElementById("btn-post");

  btnCatalogue.addEventListener("click", () => {
    window.location.href = "../../shd/catalogue/catalogue.html";
  });

  btnPost.addEventListener("click", () => {
    // fetch("http://localhost:3010/api/usuarios")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  });
});

let btnEdit = document.getElementById("btn-edit");

btnEdit.addEventListener("click", () => {
  event.preventDefault();
  let info = document.getElementById("datos");
  let edit = document.getElementById("editDatos");

  info.classList.toggle("ocultar");
  edit.classList.remove("ocultar");

  let btnGuardar = document.getElementById("btn-save");

  btnGuardar.addEventListener("click", () => {
    event.preventDefault();
    //Fetch a la base de datos
    info.classList.remove("ocultar");
    edit.classList.add("ocultar");
  });
});
