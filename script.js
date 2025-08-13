const navMenu = document.querySelector("#navMenu");
const abrirMenuJS = document.querySelector("#abrirMenuJS");
const CerrarMenu = document.querySelector("#CerrarMenu");

abrirMenuJS.addEventListener("click", () => {
    navMenu.classList.add("visible");
});
CerrarMenu.addEventListener("click", () =>{
    navMenu.classList.remove("visible");
});

// const botonIzq = document.querySelector(".boton-izq"),
//       botonDer = document.querySelector(".boton-der"),
//       carrucel = document.querySelector("#carrucel"),
//       seccionImagenes = document.querySelectorAll(".seccion-img");


// botonIzq.addEventListener("click", e => moverIzquierda()) 
// botonDer.addEventListener("click", e => moverDerecha())

// let operacion = 0,
//     contador=0, 
//     anchoImagen = 100 / seccionImagenes.length;

// function moverDerecha(){
//     if(contador >= seccionImagenes.length-1){
//         contador = 0;
//         operacion = 0;
//         carrucel.style.transform = `translate(-${operacion}%)`
//         slider.style.transition ="none";
//         return;
//     }
//     contador++;
//     operacion = operacion + anchoImagen;
//     carrucel.style.transform = `translate(-${operacion}%)`
//     slider.style.transition = ("all ease .6s")
     
// }
// function moverIzquierda(){
//     contador--;
//     if(contador < 0){
//         contador = seccionImagenes.length-1;
//         operacion = anchoImagen * (seccionImagenes.length-1)
//         carrucel.style.transform = `translate(-${operacion}%)`
//         slider.style.transition ="none";
//         return;
//     }
//     operacion = operacion - anchoImagen;
//     carrucel.style.transform = `translate(-${operacion}%)`
//     slider.style.transition = ("all ease .9s")

    
// }
 
const botonIzq = document.querySelector(".boton-izq"),
      botonDer = document.querySelector(".boton-der"),
      carrucel = document.querySelector("#carrucel"),
      seccionImagenes = document.querySelectorAll(".seccion-img");

let operacion = 0,
    contador = 0, 
    anchoImagen = 100 / seccionImagenes.length;

// 👉 Este elemento 'slider' no está declarado en tu código original
// Asegúrate de que 'slider' es lo mismo que 'carrucel' o define correctamente
const slider = carrucel; // Suponemos que son lo mismo

// Event Listeners
botonIzq.addEventListener("click", () => moverIzquierda());
botonDer.addEventListener("click", () => moverDerecha());

// Función para mover hacia la derecha
function moverDerecha(){
    if(contador >= seccionImagenes.length - 1){
        contador = 0;
        operacion = 0;
        carrucel.style.transform = `translateX(-${operacion}%)`;
        slider.style.transition = "none";
        return;
    }
    contador++;
    operacion = contador * anchoImagen;
    carrucel.style.transform = `translateX(-${operacion}%)`;
    slider.style.transition = "all ease 1s";
}

// Función para mover hacia la izquierda
function moverIzquierda(){
    contador--;
    if(contador < 0){
        contador = seccionImagenes.length - 1;
        operacion = contador * anchoImagen;
        carrucel.style.transform = `translateX(-${operacion}%)`;
        slider.style.transition = "none";
        return;
    }
    operacion = contador * anchoImagen;
    carrucel.style.transform = `translateX(-${operacion}%)`;
    slider.style.transition = "all ease 0.9s";
}

// ⏱️ Auto deslizar cada 5 segundos
setInterval(() => {
    moverDerecha();
}, 3000); // Cambia el tiempo si deseas una velocidad distinta
$(function(){

    $(".div-img-plano").click(function(){
        $(".div-img-plano").removeClass("active");
        $(this).addClass("active");
    })
});

