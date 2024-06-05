// TRATAMIENTO DE IMAGENES

async function uploadImage(image) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: "Client-ID 53fe1a7ee9c3b07",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data.link;
}

async function compressAndUploadImage(file) {
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Mantén la relación de aspecto de la imagen original
  const MAX_WIDTH = 800;
  const scaleFactor = MAX_WIDTH / image.width;
  const width = MAX_WIDTH;
  const height = image.height * scaleFactor;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  // Convierte el canvas a blob
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8)
  );

  // Sube la imagen comprimida
  const url = await uploadImage(blob);
  return url;
}

//////////////////////////////////////////////////////

let images = document.getElementById("images");
let preview = document.getElementById("preview");
let btnPost = document.getElementById("btnPost");
let btnSave = document.getElementById("btnSave");


// Limpiar la preview de imagenes
document.addEventListener("DOMContentLoaded", () => {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
});

// EVENTO QUE SE DISPARA CON LA SELECCION DE IMAGENES
let urlImages = [];

images.addEventListener("change", async (e) => {
  let files = e.target.files; // Imagenes seleccionadas

  if (!files) {
    return;
  }

  // Convertir a array para poder usar métodos de array
  let filesArray = Array.from(files);

  for (let i = 0; i < filesArray.length; i++) {
    let reader = new FileReader();
    reader.readAsDataURL(filesArray[i]);
    reader.onload = async () => {
      let img = document.createElement("img");
      img.src = reader.result;


      let deleteButton = document.createElement("i");
      deleteButton.className = "fa-solid fa-trash";
      deleteButton.style.fontSize = "20px";
      deleteButton.style.color = "#c01c28";
      deleteButton.style.position = "absolute";
      deleteButton.style.top = "20px";
      deleteButton.style.right = "20px";
      deleteButton.style.cursor = "pointer";
      deleteButton.style.borderRadius = "0.5rem";
      deleteButton.style.padding = "0.3rem"
      deleteButton.style.backgroundColor = "rgba(255, 255, 255, 0.367)";

      let div = document.createElement("div");
      div.style.position = "relative";
      div.appendChild(img);
      div.appendChild(deleteButton);

      deleteButton.addEventListener('click', function () {
        // Elimina la imagen del arreglo
        filesArray.splice(i, 1);
        // Elimina la URL de la imagen del array urlImages
        urlImages.splice(i, 1);
        // Elimina el div (que contiene la imagen y el botón) del DOM
        div.remove();
      });

      // Comprime y sube la imagen, y guarda la URL en urlImages
      urlImages.push(await compressAndUploadImage(filesArray[i]));


      preview.appendChild(div);
    }
  }

  console.log(urlImages);
});

// ARMADO DEL POST

async function buildPost() {
  let images = document.getElementById("images").files;
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let type = document.getElementById("propertyType").value;
  let rooms = document.getElementById("rooms").value;
  let bathrooms = document.getElementById("bathrooms").value;
  let garages = document.getElementById("garages").value;
  let area = document.getElementById("coveredArea").value;
  let pool = document.getElementById("hasPool").checked;
  let pets = document.getElementById("allowsPets").checked;
  let price = document.getElementById("price").value;
  let operation = document.getElementById("operationType").value;

  // Captura todos los campos de ubicacion provistos
  let address =
    document.getElementById("number").value +
    " " +
    document.getElementById("street").value +
    ", " +
    document.getElementById("city").value +
    ", " +
    document.getElementById("province").value +
    ", Argentina";

  let city = document.getElementById("city").value;
  let neighborhood = document.getElementById("neighborhood").value;

  if (images.length === 0) {
    alert("Debe seleccionar al menos una imagen");
    return;
  }

  if (
    !title ||
    !description ||
    !type ||
    !rooms ||
    !bathrooms ||
    !garages ||
    !area ||
    !price ||
    !operation ||
    !address ||
    !city ||
    !neighborhood
  ) {
    alert("Faltan completar campos");
    return;
  }

  console.log(urlImages);

  // Construye el objeto post
  let post = {
    title: title,
    content: description,
    price: parseFloat(price),
    onSale: operation === "Alquiler" ? false : true,
    ubication: address,
    city: city,
    neighborhood: neighborhood,
    frontImage: urlImages[0],
    images: urlImages,
    type: type,
    rooms: parseInt(rooms),
    bathrooms: parseInt(bathrooms),
    garage: parseInt(garages),
    area: parseFloat(area),
    pool: pool,
    pets: pets,
    datetime: new Date().toISOString(),
  };

  return post;
}

// SUBIDA DEL POST

btnPost.addEventListener("click", async () => {
  event.preventDefault();

  let post = await buildPost();
  post.published = true;

  post = JSON.stringify(post);

  //Fetch al backend, crea el post autorizandose con el token del seller
  fetch("http://localhost:3010/seller/post/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": sessionStorage.getItem("token"),
    },
    body: post,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        let error = document.getElementById("error");

        error.innerHTML = "";

        for (let i = 0; i < data.error.length; i++) {
          let p = document.createElement("p");
          if (data.error[i].code === "custom") {
            p.textContent = data.error[i].message;
            error.appendChild(p);
          }
        }
      }
      else {
        console.log("Producto creado con éxito");
        window.location.href = "../../shd/profile/profile.html";
      }


    });
});

btnSave.addEventListener("click", async () => {
  event.preventDefault();

  let post = await buildPost();
  post.published = false;

  console.log(post);

  post = JSON.stringify(post);

  //Fetch al backend, crea el post autorizandose con el token del seller
  fetch("http://localhost:3010/seller/post/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": sessionStorage.getItem("token"),
    },
    body: post,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        let error = document.getElementById("error");

        error.innerHTML = "";

        for (let i = 0; i < data.error.length; i++) {
          let p = document.createElement("p");
          if (data.error[i].code === "custom") {
            p.textContent = data.error[i].message;
            error.appendChild(p);
          }
        }
      }
      else {
        console.log("Producto guardado con éxito");
        window.location.href = "../../shd/profile/profile.html";
      }


    });

});
