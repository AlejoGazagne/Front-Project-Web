const navbar = document.getElementById("navbar");
const log_reg = document.getElementById("log-reg");
const marcoFlotante = document.getElementById("marco-flotante");

const atras = document.getElementById("atras");

async function getPostCardTemplate() {
  const response = await fetch(
    "../../components/catalogPostCard/cpostCard.html"
  );

  const text = await response.text();
  return text;
}

document.addEventListener("DOMContentLoaded", () => {
  let anunces = document.getElementById("anuncios-destacados");
  fetch("http://localhost:3010/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach(async (post) => {
        const postCardTemplate = await getPostCardTemplate();

        let cardPost = postCardTemplate
          .replace('"img-source"', '"' + post.frontImage + '"')
          .replace("Title", post.title)
          .replace("Price", post.price)
          .replace("Description", post.content)
          .replace("Rooms", post.rooms)
          .replace("WC", post.bathrooms)
          .replace("Garage", post.garage);

        anunces.insertAdjacentHTML("beforeend", cardPost);
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

navbar.addEventListener("load", () => {
  let btnSesion = navbar.contentDocument.getElementById("btn-sesion");
  let btnCatalogue = navbar.contentDocument.getElementById("btn-catalogue");
  let btnPost = navbar.contentDocument.getElementById("btn-post");

  btnSesion.addEventListener("click", () => {
    log_reg.classList.add("mostrar");
    atras.classList.add("mostrar");
    marcoFlotante.classList.add("mostrar");
  });

  btnCatalogue.addEventListener("click", () => {
    window.location.href = "../shd/catalogue/catalogue.html";
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

atras.addEventListener("click", () => {
  log_reg.classList.remove("mostrar");
  atras.classList.remove("mostrar");
  marcoFlotante.classList.remove("mostrar");
});
