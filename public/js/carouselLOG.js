/**
 * @file carousel.js - Script para el carrusel de la página principal.
 * @author leusrox - https://codepen.io/leusrox (Modified by Pablo Olivares Martinez)
 * @version 1.0
 */

// Hay que cambiar las URL
const urls = ["scanQRCodeLuis()","scanQRCodeXimo()","scanQRCodePablo()"];
const images = ["../qr-codes/luiscrespo-QR.png", "../qr-codes/pablolivares-QR.png", "../qr-codes/ximosanz-QR.png"];
const titles = ["LUIS", "XIMO", "PABLO"];
let currentUrlIndex = 0;

/**
 * Obtiene la siguiente URL en el array y actualiza el índice.
 *
 * @function
 * @returns {string} - URL siguiente.
 */
function getNextUrl() {
    // Get the next URL and update the index
    currentUrlIndex = (currentUrlIndex + 1) % urls.length;
    return urls[currentUrlIndex];
}

/**
 * Obtiene la URL anterior en el array y actualiza el índice.
 *
 * @function
 * @returns {string} - URL anterior.
 */
function getPrevUrl() {
    // Get the previous URL and update the index
    currentUrlIndex = (currentUrlIndex - 1 + urls.length) % urls.length;
    return urls[currentUrlIndex];
}

/**
 * Obtiene la ruta de la imagen correspondiente a la URL actual.
 *
 * @function
 * @returns {string} - Ruta de la imagen.
 */
function getImage() {
    return images[currentUrlIndex];
}


// Define a function to select a DOM element by its CSS selector
const $ = selector => {
    return document.querySelector(selector);
};

function next() {
    // Actualizar el índice actual antes de hacer cambios
    currentUrlIndex = (currentUrlIndex + 1) % urls.length;

    if ($(".hide")) {
        $(".hide").remove();
    }

    if ($(".act-button")) {
        $(".act-button").remove();
    }

    if ($(".prev")) {
        $(".prev").classList.add("hide");
        $(".prev").classList.remove("prev");
    }

    $(".act").classList.add("prev");
    $(".act").classList.remove("act");

    $(".next").classList.add("act");
    $(".next").classList.remove("next");

    $(".new-next").classList.add("next");
    $(".new-next").classList.remove("new-next");

    const addedEl = document.createElement('div');
    $(".list").appendChild(addedEl);
    addedEl.classList.add("next", "new-next");

    if (!$(".act-button")) {
        $(".act").innerHTML += "<button class='act-button'></button>";
    }

    // Ejecutar la función correspondiente y actualizar la imagen y el título
    $(".act-button").setAttribute("onclick", urls[currentUrlIndex]);
    $(".act-button").innerHTML = "<img src='" + images[currentUrlIndex] + "' alt='icon' class='icon'>";
    $(".act-button").innerHTML += "<p>" + titles[currentUrlIndex] + "</p>";
}

function prev() {
    // Actualizar el índice actual antes de hacer cambios
    currentUrlIndex = (currentUrlIndex - 1 + urls.length) % urls.length;

    $(".new-next").remove();

    if ($(".act-button")) {
        $(".act-button").remove();
    }

    $(".next").classList.add("new-next");
    $(".next").classList.remove("next");

    $(".act").classList.remove("act-button");
    $(".act").classList.add("next");
    $(".act").classList.remove("act");

    $(".prev").classList.add("act");
    $(".prev").classList.remove("prev");

    $(".hide").classList.add("prev");
    $(".hide").classList.remove("hide");

    const addedEl = document.createElement('div');
    $(".list").insertBefore(addedEl, $(".list").firstChild);
    addedEl.classList.add("hide");

    if (!$(".act-button")) {
        $(".act").innerHTML += "<button class='act-button'></button>";
    }

    // Ejecutar la función correspondiente y actualizar la imagen y el título
    $(".act-button").setAttribute("onclick", urls[currentUrlIndex]);
    $(".act-button").innerHTML = "<img src='" + images[currentUrlIndex] + "' alt='icon' class='icon'>";
    $(".act-button").innerHTML += "<p>" + titles[currentUrlIndex] + "</p>";
}


// Function to handle sliding based on the clicked element
const slide = element => {
    /* Next slide */

    if (element.classList.contains('next')) {
        // Call the "next" function
        next();

        /* Previous slide */

    } else if (element.classList.contains('prev')) {
        // Call the "prev" function
        prev();
    }
}

// Get references to DOM elements
const slider = $(".list"); // Get an element with class "list"
const swipe = new Hammer($(".swipe")); // Initialize Hammer.js with an element with class "swipe"

// Add a click event listener to the "slider" element
slider.onclick = event => {
    // Ensure that clicks on the div elements are handled
    if (event.target.tagName === 'DIV') {
        // Call the "slide" function with the clicked div element as an argument
        slide(event.target);
    }
}

// Add swipe event listeners for left and right swipe gestures using Hammer.js
swipe.on("swipeleft", (ev) => {
    // Call the "next" function for a left swipe
    next();
});

swipe.on("swiperight", (ev) => {
    // Call the "prev" function for a right swipe
    prev();
});
