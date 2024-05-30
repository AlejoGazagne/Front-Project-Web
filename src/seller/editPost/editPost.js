let preview = document.getElementById("preview");
let ready = false

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

let urlImages = [];

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

// AGREGADO DE IMAGENES AL PREVIEW

function addImageToDOOM(src) {
    let img = document.createElement("img");
    img.src = src;


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
        data.images.splice(i, 1);
        // Elimina el div (que contiene la imagen y el botón) del DOM
        div.remove();
    });

    preview.appendChild(div);
}

let newImages = [];
let inputImages = document.getElementById("images")

inputImages.addEventListener("change", async (e) => {
    let files = e.target.files; // Imagenes seleccionadas

    if (!files) {
        return;
    }

    for (let i = 0; i < files.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
            addImageToDOOM(reader.result);
        };
    }

    for (let i = 0; i < files.length; i++) {
        let url = await compressAndUploadImage(files[i]);
        urlImages.push(url);
    }
});

// CARGA INICIAL DE DATOS

const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get("id"));
let timestamp;

window.addEventListener("load", async () => {

    fetch("http://localhost:3010/properties/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data.data);

        data = data.data;

        // guardamos fecha de creacion del post
        timestamp = data.datetime;

        let number = data.ubication.split(",")[0].split(" ")[0].trim();
        let street = data.ubication.split(",")[0].replace(number, "").trim();
        let province = data.ubication.split(",")[2].trim();
        // Setea los valores de los campos con los datos del inmueble

        for (let i = 0; i < data.images.length; i++) {
            let link = data.images[i];
            addImageToDOOM(link);
        }

        document.getElementById("title").value = data.title;
        document.getElementById("description").value = data.content;
        document.getElementById("propertyType").value = data.type;
        document.getElementById("rooms").value = data.rooms;
        document.getElementById("bathrooms").value = data.bathrooms;
        document.getElementById("garages").value = data.garage;
        document.getElementById("coveredArea").value = data.area;
        document.getElementById("hasPool").checked = data.pool;
        document.getElementById("allowsPets").checked = data.pets;
        document.getElementById("price").value = data.price;
        document.getElementById("operationType").value = data.operation;
        document.getElementById("number").value = number;
        document.getElementById("street").value = street;
        document.getElementById("neighborhood").value = data.neighborhood;
        document.getElementById("city").value = data.city;
        document.getElementById("postalCode").value = "";
        document.getElementById("province").value = province;

    });

});

// BUILD POST

async function buildPost() {
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

    let imagesArray = [];
    let images = preview.getElementsByTagName("img");

    for (let i = 0; i < images.length; i++) {
        if (images[i].src.startsWith("http")) {
            imagesArray.push(images[i].src);
        }
    }


    let finalURLImg = imagesArray.concat(urlImages);
    console.log(finalURLImg);


    if (finalURLImg.length === 0) {
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

    // Construye el objeto post
    let post = {
        id: id,
        title: title,
        content: description,
        price: parseFloat(price),
        onSale: operation === "Alquiler" ? false : true,
        ubication: address,
        city: city,
        neighborhood: neighborhood,
        frontImage: finalURLImg[0],
        images: finalURLImg,
        type: type,
        rooms: parseInt(rooms),
        bathrooms: parseInt(bathrooms),
        garage: parseInt(garages),
        area: parseFloat(area),
        pool: pool,
        pets: pets,
        datetime: timestamp,
    };
    ready = true;
    return post;

}

// GUARDADO DE LA PUBLICACION

let btnPost = document.getElementById("btnPost");
let btnSave = document.getElementById("btnSave");

btnPost.addEventListener("click", async () => {
    event.preventDefault();

    let post = await buildPost();

    if (ready) {
        post.published = true;
        console.log(post);

        post = JSON.stringify(post);

        //Fetch al backend, actualiza el post autorizandose con el token del seller
        fetch("http://localhost:3010/seller/post/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token"),
            },
            body: post,
        }).then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    console.log("Producto actualizado con éxito");
                    window.location.href = "../../shd/profile/profile.html";
                }


            });
    }

});

btnSave.addEventListener("click", async () => {
    event.preventDefault();

    let post = await buildPost();

    if (ready) {
        post.published = false;
        console.log(post);

        post = JSON.stringify(post);

        //Fetch al backend, actualiza el post autorizandose con el token del seller
        fetch("http://localhost:3010/seller/post/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token"),
            },
            body: post,
        }).then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    console.log("Producto actualizado con éxito");
                    window.location.href = "../../shd/profile/profile.html";
                }
            });
    }
});