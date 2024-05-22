async function getPostCardTemplate() {
  const response = await fetch(
    "../../../src/components/catalogPostCard/cpostCard.html"
  );

  const text = await response.text();
  return text;
}


document.addEventListener("DOMContentLoaded", () => {
  // fetch("http://localhost:3010/api/usuarios")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  let posts = document.getElementById("seller-posts");

  fetch("http://localhost:3010/seller/post/getMyPosts",{
    method: "GET",
    headers: {
      "Authorization":sessionStorage.getItem("token"),
    }}).then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.data.forEach(async (post) => {
        const postCardTemplate = await getPostCardTemplate();    
        let cardPost = postCardTemplate.replace('img-source', post.frontImage)
          .replace("Title", post.title)
          .replace("Price", post.price)
          .replace("Description", post.content) 
          .replace("Rooms", post.rooms)
          .replace("WC", post.bathrooms)
          .replace("Garage", post.garage)
          .replace("Ver más", "Editar");

        posts.insertAdjacentHTML("beforeend", cardPost);
      })
    })
    .catch((error) => {
      console.log(error);
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
    // //Fetch a la base de datos
    // fetch("http://localhost:3010/api/usuarios", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     nombre: document.getElementById("name").value,
    //     email: document.getElementById("email").value,
    //     telefono: document.getElementById("phoneNumber").value,
    //   }),
    // }).then((res) => res.json()).then((data) => {
    //     console.log(data);
    //   }).catch((error) => {
    //     console.log(error);
    //   });

    info.classList.remove("ocultar");
    edit.classList.add("ocultar");
  });
});
