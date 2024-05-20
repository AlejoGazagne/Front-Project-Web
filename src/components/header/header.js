let btnSesion = document.getElementById("btn-sesion");
let btnCatalogue = document.getElementById("btn-catalogue");
let btnProfile = document.getElementById("btn-profile");
let btnPost = document.getElementById("btn-post");
let logo = document.getElementById("logo");

const parent = window.parent.document;
const ref = window.parent;

const log_reg = parent.getElementById("log-reg");
const atras = parent.getElementById("atras");
const marcoFlotante = parent.getElementById("marco-flotante");

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3010/seller/validate",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        }
    }).then((response)=>{
        if (response.status === 200){
            btnSesion.classList.remove("mostrar");
            btnProfile.classList.add("mostrar");
        }else{
            btnSesion.classList.add("mostrar");
            btnProfile.classList.remove("mostrar");
        }
    })
});

logo.addEventListener("click", () => {
    ref.window.location.href = "../../../src/index.html";
});

btnCatalogue.addEventListener("click", () => {
    ref.window.location.href = "../../../src/shd/catalogue/catalogue.html";
});

btnPost.addEventListener("click", () => {
    fetch("http://localhost:3010/seller/validate",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        }
    }).then((response)=>{
        if (response.status === 200){
            ref.window.location.href = "../../../src/seller/newPost/newPost.html";
        }else{
            log_reg.classList.add("mostrar");
            atras.classList.add("mostrar");
            marcoFlotante.classList.add("mostrar");
        }
    })
    
});

btnSesion.addEventListener("click", () => {    
    log_reg.classList.add("mostrar");
    atras.classList.add("mostrar");
    marcoFlotante.classList.add("mostrar");
});

btnProfile.addEventListener("click", () => {
    ref.window.location.href = "../../../src/seller/profile/profile.html";
});



