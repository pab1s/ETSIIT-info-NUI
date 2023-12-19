/**
 * @file carouselLocalizacion.js - Script para el carrusel de la página de localización de la aplicación web de la ETSIT ULL.
 * @author leusrox - https://codepen.io/leusrox (Modified by Pablo Olivares Martinez)
 * @version 1.0
 */

// Array of URLs
const urls = ["/despachos", "", ""];
const images = ["../assets/profesorado-icon.png", "../assets/clases-icon.png", "../assets/espacios-comunes-icon.png"];
const titles = ["DESPACHOS", "CLASES", "ESPACIOS COMUNES"];
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

/**
 * Función para manejar la acción "siguiente" en la interfaz de usuario.
 *
 * @function
 */
function next() {
    // Check if an element with class "hide" exists
    if ($(".hide")) {
        // If it exists, remove it from the DOM
        $(".hide").remove();
    }

    /* Step */

    // Remove the "act-button" from the DOM
    if ($(".act-button")) {
        $(".act-button").remove();
    }

    // Check if an element with class "prev" exists
    if ($(".prev")) {
        // If it exists, update its class to "hide" and remove the "prev" class
        $(".prev").classList.add("hide");
        $(".prev").classList.remove("prev");
    }

    // Update the class of the element with class "act" to "prev"
    $(".act").classList.add("prev");
    $(".act").classList.remove("act");

    // Update the class of the element with class "next" to "act"
    $(".next").classList.add("act");
    $(".next").classList.remove("next");

    /* New Next */

    // Remove the "new-next" class from the element with class "new-next"
    $(".new-next").classList.add("next");
    $(".new-next").classList.remove("new-next");

    // Create a new div element
    const addedEl = document.createElement('div');

    // Append the new div element to an element with class "list"
    $(".list").appendChild(addedEl);

    // Add classes "next" and "new-next" to the new div element
    addedEl.classList.add("next", "new-next");

    // If there is no 'act-button' button in the DOM, create it in the element with class "act"
    if (!$(".act-button")) {
        $(".act").innerHTML += "<button class='act-button'></button>";
    }

    // Assign the next URL to the "act-button" button
    $(".act-button").setAttribute("onclick", "location.href='" + getNextUrl() + "'");

    // If there is no image in act-button, create it in the button
    if (!$(".act-button").innerHTML.includes("img")) {
        $(".act-button").innerHTML = "<img src='" + getImage() + "' alt='icon' class='icon'>" + $(".act-button").innerHTML;
        $(".act-button").innerHTML += "<p>" + titles[currentUrlIndex] + "</p>";
    }
}

/**
 * Función para manejar la acción "anterior" en la interfaz de usuario.
 *
 * @function
 */
function prev() {
    // Remove the element with class "new-next" from the DOM
    $(".new-next").remove();

    /* Step */

    // Remove the "act-button" from the DOM
    if ($(".act-button")) {
        $(".act-button").remove();
    }

    // Update the class of the element with class "next" to "new-next"
    $(".next").classList.add("new-next");

    // Update the class of the element with class "act" to "next"
    $(".act").classList.remove("act-button");
    $(".act").classList.add("next");
    $(".act").classList.remove("act");

    // Update the class of the element with class "prev" to "act"
    $(".prev").classList.add("act");
    $(".prev").classList.remove("prev");

    /* New Prev */

    // Update the class of the element with class "hide" to "prev"
    $(".hide").classList.add("prev");
    $(".hide").classList.remove("hide");

    // Create a new div element
    const addedEl = document.createElement('div');

    // Insert the new div element at the beginning of an element with class "list"
    $(".list").insertBefore(addedEl, $(".list").firstChild);

    // Add class "hide" to the new div element
    addedEl.classList.add("hide");

    // If there is no 'act-button' button in the DOM, create it in the element with class "act"
    if (!$(".act-button")) {
        $(".act").innerHTML += "<button class='act-button'></button>";
    }

    // Assign the next URL to the "act-button" button
    $(".act-button").setAttribute("onclick", "location.href='" + getPrevUrl() + "'");

    // If there is no image in act-button, create it in the button
    if (!$(".act-button").innerHTML.includes("img")) {
        $(".act-button").innerHTML = "<img src='" + getImage() + "' alt='icon' class='icon'>" + $(".act-button").innerHTML;
        $(".act-button").innerHTML += "<p>" + titles[currentUrlIndex] + "</p>";
    }
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
