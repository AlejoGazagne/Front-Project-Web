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

  if (images.length === 0) {
    alert("Debe seleccionar al menos una imagen");
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
    !address
  ) {
    alert("Faltan completar campos");
  }

  let post = {
    title: title,
    content: description,
    price: parseFloat(price),
    onSale: operation === "Alquiler" ? false : true,
    ubication: address,
    frontImage: urlImages[0],
    images: urlImages,
    type: type,
    rooms: parseInt(rooms),
    bathrooms: parseInt(bathrooms),
    garage: parseInt(garages),
    area: parseFloat(area),
    pool: pool,
    pets: pets,
  };

  return post;
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

// Evento que se dispara cuando se seleccionan imagenes
let urlImages = [];

images.addEventListener("change", async (e) => {
  let files = e.target.files; // Imagenes seleccionadas

  if (!files) {
    return;
  }

  for (let i = 0; i < files.length; i++) {
    let reader = new FileReader();
    reader.readAsDataURL(files[i]);
    reader.onload =  () => {
      let img = document.createElement("img");
      img.src = reader.result;
      preview.appendChild(img);
    };
  }

  for (let i = 0; i < files.length; i++) {
    let url = await compressAndUploadImage(files[i]);
    urlImages.push(url);
  }
  console.log(urlImages); 
});

btnPost.addEventListener("click", async () => {
  event.preventDefault();

  let post = await buildPost();
  post.published = true;

  post = JSON.stringify(post);

  console.log(post);
  console.log(localStorage.getItem("token"));

  //Fetch al backend, crea el post autorizandose con el token del seller
  fetch("http://localhost:3010/seller/post/createPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization":localStorage.getItem("token"),
    },
    body: post,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
      }
      else{
        console.log("Producto creado con éxito"); 
      }

      
    });
});

btnSave.addEventListener("click", async () => {
  event.preventDefault();

  let { post, property } = await buildPost();
  post.published = false;

  console.log(post);
  console.log(property);
});
