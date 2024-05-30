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

let favorites = [];

async function getFavorites() {
  if (sessionStorage.getItem("rol") === "user") {
    console.log("favoritos")
    await fetch("http://localhost:3010/user/favorite/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")
      }
    }).then(async (response) => {
      const rsp = await response.json();
      favorites = rsp.data;
      console.log(favorites)

    }).catch((error) => {
      console.log(error);
    });
  }
}

async function loadPosts() {
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
        if (sessionStorage.getItem("rol") === "seller") {
          btnFav.style.display = "none";
        }
        else {
          btnFav.style.display = "inline";
        }

        for (let j = 0; j < favorites.length; j++) {
          console.log("vuelta " + favorites[j].postId + " " + post.id)
          if (favorites[j].id === post.id) {
            btnFav.classList.toggle("card__btn--like");
          }
        }

        btnFav.addEventListener("click", () => {
          if (sessionStorage.getItem("token") === null) {
            log_reg.classList.add("mostrar");
            atras.classList.add("mostrar");
            marcoFlotante.classList.add("mostrar");
            return;
          }

          let idPost = btnFav.getAttribute("id-fav");
          console.log("fav en " + idPost);
          btnFav.classList.toggle("card__btn--like");
          if (btnFav.classList.contains("card__btn--like")) {
            fetch("http://localhost:3010/user/favorite/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token"),
              },
              body: JSON.stringify({
                postId: parseInt(idPost),
              })
            }).then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  console.log(data.error)
                }
                else {
                  console.log("nuevo favorito")
                }
              })
          }
          else {
            fetch("http://localhost:3010/user/favorite/delete/" + idPost, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token")
              }
            }).then(async (response) => {
              const rsp = await response.json()
              console.log(rsp)
            }).catch((error) => {
              console.log(error);
            });
          }

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
}

async function init() {
  await getFavorites();

  loadPosts();

}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

atras.addEventListener("click", () => {
  log_reg.classList.remove("mostrar");
  atras.classList.remove("mostrar");
  marcoFlotante.classList.remove("mostrar");
});

