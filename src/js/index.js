const navbar = document.getElementById("navbar");
const log_reg = document.getElementById("log-reg");
const marcoFlotante = document.getElementById("marco-flotante");

const atras = document.getElementById("atras");

async function getPostCardTemplate() {
  const response = await fetch(
    "../src/components/catalogPostCard/cpostCard.html"
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
        let cardPost = postCardTemplate.replace('img-source', post.frontImage)
          .replace(/idPost/gi, post.id)
          .replace("Title", post.title)
          .replace("value", post.price)
          .replace("Description", post.content)
          .replace("Ubication", post.ubication)
          .replace("Rooms", post.rooms)
          .replace("WC", post.bathrooms)
          .replace("Garage", post.garage);

        anunces.insertAdjacentHTML("beforeend", cardPost);

        // Boton Favorito
        let btnFav = document.querySelector(`[id-fav="${post.id}"]`)
        btnFav.addEventListener("click", () => {
          let idPost = btnFav.getAttribute("id-fav");
          console.log("fav en " + idPost);
        });


        // Boton View More
        let btnVM = document.querySelector(`[data-id="${post.id}"]`)
        btnVM.addEventListener("click", () => {
          let idPost = btnVM.getAttribute("data-id");
          console.log("click en " + idPost);
          window.location.href = `../../src/shd/publication/post.html?id=${idPost}`;
        });

      });
    })
    .catch((error) => {
      console.log(error);
    });
});

atras.addEventListener("click", () => {
  log_reg.classList.remove("mostrar");
  atras.classList.remove("mostrar");
  marcoFlotante.classList.remove("mostrar");
});

/* boton de favoritos */
const likeButtons = document.querySelectorAll(".card__btn");
likeButtons.forEach((likeButton) => {
  likeButton.addEventListener("click", () => {
    console.log("like button clicked");
    likeButton.classList.toggle("card__btn--like");
  });
});