let title = document.getElementById("title");
let btnEditProfile;
let btnNewPost = document.getElementById("btn-newPost");
let posts = document.getElementById("posts");


async function getPostCardTemplate() {
  const response = await fetch(
    "../../../src/components/catalogPostCard/cpostCard.html"
  );

  const text = await response.text();
  return text;
}

async function getProfileTemplate() {
  const response = await fetch("../../../src/components/profile/profile.html");

  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  return doc;
}

let id;

async function getData() {

  const profileTemplate = await getProfileTemplate();

  document.getElementById("profile").appendChild(profileTemplate.body);

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

      id = rsp.data.id;

      document.getElementById("profile_img").src = rsp.data.profileImage;

      document.getElementById("detail").innerText = "publicaciones";

      document.getElementById("name").innerHTML = rsp.data.name;

      // Insertar email
      let emailDiv = document.getElementById('emailDiv');
      emailDiv.textContent = `email: ${rsp.data.email}`;

      // Insertar phone
      let phoneDiv = document.getElementById('phoneDiv');
      phoneDiv.textContent = `numero de contacto: ${rsp.data.phoneNumber}`;

      // Insertar description
      let descriptionDiv = document.getElementById('descriptionDiv');
      descriptionDiv.textContent = rsp.data.description;

    }).catch((error) => {
      console.log(error);
    });
  }
  //ROL USER
  else if (sessionStorage.getItem("rol") === "user") {

    document.getElementById("profile_avatar").classList.add("ocultar");
    document.getElementById("descriptionDiv").classList.add("ocultar");

    fetch("http://localhost:3010/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")
      }
    }).then(async (response) => {

      const rsp = await response.json()
      console.log(rsp);

      id = rsp.data.id;

      document.getElementById("name").innerHTML = rsp.data.name;

      document.getElementById("detail").innerText = "guardados";

      // Insertar email
      let emailDiv = document.getElementById('emailDiv');
      emailDiv.textContent = `email: ${rsp.data.email}`;

      // Insertar phone
      let phoneDiv = document.getElementById('phoneDiv');
      phoneDiv.textContent = `numero de contacto: ${rsp.data.phoneNumber}`;

      // Insertar description
      let descriptionDiv = document.getElementById('descriptionDiv');
      descriptionDiv.display = "none";
    }).catch((error) => {
      console.log(error);
    });
  }

  btnEditProfile = document.getElementById("edit-profile");

  btnEditProfile.addEventListener("click", () => {

    let dataDiv = document.getElementById("data");
    let editDiv = document.getElementById("edit");
    let name = document.getElementById("name");
    let nameInput = document.getElementById("nameInput");
    let btnSave = document.getElementById("save");
    let btnDiscard = document.getElementById("discard");

    dataDiv.classList.add("ocultar");
    editDiv.classList.remove("ocultar");

    name.classList.add("ocultar");
    nameInput.classList.remove("ocultar");

    btnEditProfile.classList.add("ocultar");
    btnSave.classList.remove("ocultar");

    let descriptionInput = document.getElementById('descriptionInput');
    if (sessionStorage.getItem("rol") === "user") {
      document.getElementById("descriptionZone").classList.add("ocultar");
    }
    else if (sessionStorage.getItem("rol") === "seller") {
      descriptionInput.value = document.getElementById('descriptionDiv').textContent;
    }

    btnSave.addEventListener("click", () => {
      if (sessionStorage.getItem("rol") === "seller") {
        fetch("http://localhost:3010/seller/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token")
          },
          body: JSON.stringify({
            name: document.getElementById("nameInput").value,
            profileImage: document.getElementById("profile_img").src,
            email: document.getElementById("emailInput").value,
            phoneNumber: document.getElementById("phoneInput").value,
            description: document.getElementById("descriptionInput").value,
          })
        }).then(async (response) => {
          if (response.status === 200) {
            let data = await response.json()
            console.log(data.data.token)
            sessionStorage.setItem("token", data.data.token)
            window.location.reload();
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
          body: JSON.stringify({
            name: document.getElementById("nameInput").value,
            email: document.getElementById("emailInput").value,
            phoneNumber: document.getElementById("phoneInput").value,
          })
        }).then(async (response) => {
          if (response.status === 200) {
            let data = await response.json()
            console.log(data)
            sessionStorage.setItem("token", data.data.token)
            window.location.reload();
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    });

    btnDiscard.addEventListener("click", () => {
      dataDiv.classList.remove("ocultar");
      editDiv.classList.add("ocultar");

      name.classList.remove("ocultar");
      nameInput.classList.add("ocultar");

      btnEditProfile.classList.remove("ocultar");
      btnSave.classList.add("ocultar");
    });

  });
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

        document.getElementById("cant-posts").innerText = data.data.length

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
            let idPost = btnEdit.getAttribute("on-post");
            console.log("edit en " + idPost);
            window.location.href = `../../../src/seller/editPost/editPost.html?id=${idPost}`;
          });

          // Boton Estado
          let btnState = document.querySelector(`[post="${post.id}"]`)
          btnState.classList.toggle("fa-solid");
          if (post.published) {
            btnState.classList.toggle("fa-globe");
          }
          else {
            btnState.classList.toggle("fa-arrow-up-from-bracket");
          }

          btnState.addEventListener("click", () => {
            event.preventDefault();
            let idPost = btnState.getAttribute("post");

            if (btnState.classList.contains("fa-globe")) {
              window.location.href = `../../../src/shd/publication/post.html?id=${idPost}`;
            }
            else if (btnState.classList.contains("fa-arrow-up-from-bracket")) {
              window.location.href = `../../../src/seller/editPost/editPost.html?id=${idPost}`;
            }
          });

          // Boton Borrar
          let btnDelete = document.querySelector(`[post-delete="${post.id}"]`)
          btnDelete.addEventListener("click", () => {
            event.preventDefault();
            let idPost = btnDelete.getAttribute("post-delete");

            fetch("http://localhost:3010/seller/post/delete/" + idPost, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token")
              },
            }).then((response) => {
              if (response.status === 200) {
                console.log("publicacion eliminada");
                window.location.reload();
              }
            }).catch((error) => {
              console.log(error);
            });
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

        document.getElementById("cant-posts").innerText = data.data.length

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

          let btnStatus = document.querySelector(`[post = "${post.id}"]`);
          btnStatus.style.display = "none";
          let btnDelete = document.querySelector(`[post-delete="${post.id}"]`);
          btnDelete.style.display = "none";

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
      await getData()
      getPosts()

    } else if (rsp.message === "user") {
      title.innerHTML = "Tus favoritos";

      await getData()
      getPosts()
    }
  })

});




btnNewPost.addEventListener("click", () => {
  window.location.href = "../../../src/seller/newPost/newPost.html";
});

