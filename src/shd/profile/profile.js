let title = document.getElementById("title");
let btnNewPost = document.getElementById("btn-newPost");
let btnEdit = document.getElementById("btn-edit");
let posts = document.getElementById("posts");


async function getPostCardTemplate() {
  const response = await fetch(
    "../../../src/components/catalogPostCard/cpostCard.html"
  );

  const text = await response.text();
  return text;
}

async function getData() {

  //ROL SELLER
  if (sessionStorage.getItem("rol") === "seller") {
    fetch("http://localhost:3010/seller/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")
      }
    }).then(async (response) => {

      const rsp = await response.json()
      console.log(rsp);

      document.getElementById("yourName").textContent = rsp.data.name;
      document.getElementById("email-value").textContent = rsp.data.email;
      document.getElementById("phone-value").textContent = rsp.data.phoneNumber;

      document.getElementById("name").value = rsp.data.name;
      document.getElementById("mail").value = rsp.data.email;
      document.getElementById("phoneNumber").value = rsp.data.phoneNumber;

    }).catch((error) => {
      console.log(error);
    });
  }
  //ROL USER
  else if (sessionStorage.getItem("rol") === "user") {
    document.getElementById("phone").classList.add("ocultar");
    fetch("http://localhost:3010/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")
      }
    }).then(async (response) => {

      const rsp = await response.json()
      console.log(rsp);
      document.getElementById("email-value").textContent = rsp.data.email;
    }).catch((error) => {
      console.log(error);
    });
  }
}

async function getPosts() {
  if (sessionStorage.getItem("rol") === "seller") {
    fetch("http://localhost:3010/seller/post/", {
      method: "GET",
      headers: {
        "Authorization": sessionStorage.getItem("token"),
      }
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.data.forEach(async (post) => {
          const postCardTemplate = await getPostCardTemplate();
          let cardPost = postCardTemplate.replace('img-source', post.frontImage)
            .replace(/idPost/gi, post.id)
            .replace("Title", post.title)
            .replace("value", post.price)
            .replace("Description", post.content)
            .replace("Ubication", post.ubication)
            .replace("Rooms", post.rooms)
            .replace("WC", post.bathrooms)
            .replace("Garage", post.garage)
            .replace("Ver más", "Editar");

          posts.insertAdjacentHTML("beforeend", cardPost);

          // Boton Editar
          let btnEdit = document.querySelector(`[on-post="${post.id}"]`)
          btnEdit.addEventListener("click", () => {
            event.preventDefault();
            let idPost = btnEdit.getAttribute("post-edit");
            console.log("edit en " + idPost);
            window.location.href = `../../../src/seller/editPost/editPost.html?id=${idPost}`;
          });

          // Boton Ver Mas
          let btnVM = document.querySelector(`[data-id="${post.id}"]`)
          btnVM.addEventListener("click", () => {
            event.preventDefault();
            let idPost = btnVM.getAttribute("data-id");
            console.log("click en " + idPost);
            window.location.href = `../../../src/shd/publication/post.html?id=${idPost}`;
          });
        })

      })
      .catch((error) => {
        console.log(error);
      });


  }
  else if (sessionStorage.getItem("rol") === "user") {
    // Fetch a la base de datos para traer los favoritos
    console.log("fetch a favoritos")
    fetch("http://localhost:3010/user/favorite/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")
      }
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.data.forEach(async (post) => {
          const postCardTemplate = await getPostCardTemplate();
          let cardPost = postCardTemplate.replace('img-source', post.frontImage)
            .replace(/idPost/gi, post.id)
            .replace("Title", post.title)
            .replace("value", post.price)
            .replace("Description", post.content)
            .replace("Ubication", post.ubication)
            .replace("Rooms", post.rooms)
            .replace("WC", post.bathrooms)
            .replace("Garage", post.garage)
            .replace("Ver más", "Editar");

          posts.insertAdjacentHTML("beforeend", cardPost);

          let btnEdit = document.querySelector(`[on-post="${post.id}"]`)
          btnEdit.style.display = "none";

          let btnFav = document.querySelector(`[id-fav="${post.id}"]`)
          btnFav.style.display = "inline";
          btnFav.classList.add("card__btn--like");

          btnFav.addEventListener("click", () => {
            event.preventDefault();
            let idPost = btnFav.getAttribute("id-fav");
            console.log("fav en " + idPost);

            if (btnFav.classList.contains("card__btn--like")) {
              btnFav.classList.remove("card__btn--like");
              fetch("http://localhost:3010/user/favorite/delete/" + idPost, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": sessionStorage.getItem("token")
                },
              }).then((response) => {
                if (response.status === 200) {
                  console.log("favorito eliminado");
                }
              }).catch((error) => {
                console.log(error);
              });
            }
            else {
              btnFav.classList.add("card__btn--like");
              fetch("http://localhost:3010/user/favorite/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                  postId: parseInt(idPost),
                })
              }).then(async (response) => {
                const rsp = await response.json()
                console.log(rsp)
              }).catch((error) => {
                console.log(error);
              });
            }
          });

          // Boton Ver Mas
          let btnVM = document.querySelector(`[data-id="${post.id}"]`)
          btnVM.addEventListener("click", () => {
            event.preventDefault();
            let idPost = btnVM.getAttribute("data-id");
            console.log("click en " + idPost);
            window.location.href = `../../../src/shd/publication/post.html?id=${idPost}`;
          });
        })

      })
      .catch((error) => {
        console.log(error);
      });

  }
}
document.addEventListener("DOMContentLoaded", () => {

  console.log(Date())

  fetch("http://localhost:3010/validate", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": sessionStorage.getItem("token")
    }
  }).then(async (response) => {
    const rsp = await response.json()
    sessionStorage.setItem("rol", rsp.message);

    if (response.status === 401 || response.status === 403) {
      window.location.href = "../../../src/index.html";

    }
    if (rsp.message === "seller") {
      title.innerHTML = "Tus publicaciones";
      btnNewPost.classList.add("mostrar");
      getData()
      getPosts()

    } else if (rsp.message === "user") {
      title.innerHTML = "Tus favoritos";

      getData()
      getPosts()
    }
  })

});

btnEdit.addEventListener("click", () => {
  event.preventDefault();
  let info = document.getElementById("datos");
  let edit = document.getElementById("editDatos");

  info.classList.toggle("ocultar");
  edit.classList.remove("ocultar");

  let btnGuardar = document.getElementById("btn-save");

  btnGuardar.addEventListener("click", () => {
    event.preventDefault();
    if (sessionStorage.getItem("rol") === "seller") {

      let newName = document.getElementById("name").value;
      let newEmail = document.getElementById("mail").value;
      let newTelefono = document.getElementById("phoneNumber").value;
      let newPassword = document.getElementById("password").value;

      let body = {
        name: newName,
        email: newEmail,
        phoneNumber: newTelefono,
        password: newPassword
      }

      body = JSON.stringify(body);
      console.log(body)

      if (newName === "" || newEmail === "" || newTelefono === "" || newPassword === "") {
        alert("Por favor llene todos los campos");
        return;
      }
      if (newPassword.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
      }

      if (sessionStorage.getItem("rol") === "seller") {
        fetch("http://localhost:3010/seller/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token")
          },
          body: body,

        }).then((response) => {
          if (response.status === 200) {
            getData()
            info.classList.remove("ocultar");
            edit.classList.add("ocultar");
          }
        }).catch((error) => {
          console.log(error);
        });
      }
      else if (sessionStorage.getItem("rol") === "user") {
        fetch("http://localhost:3010/user/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token")
          },
          body: body,
        }).then((response) => {
          if (response.status === 200) {
            getData()
            info.classList.remove("ocultar");
            edit.classList.add("ocultar");
          }
        }).catch((error) => {
          console.log(error);
        });
      }

    }
  });
});

btnNewPost.addEventListener("click", () => {
  window.location.href = "../../../src/seller/newPost/newPost.html";
});

