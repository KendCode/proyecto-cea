/*!
 * main.js — Lógica personalizada de la página
 * Añade aquí cualquier comportamiento específico del proyecto.
 */

'use strict';

// Ejemplo: pausar el carousel al hacer hover
document.addEventListener('DOMContentLoaded', () => {

  // Pausar el carousel al hacer hover
  const carouselEl = document.querySelector('#myCarousel');
  if (carouselEl) {
    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
    carouselEl.addEventListener('mouseenter', () => carousel.pause());
    carouselEl.addEventListener('mouseleave', () => carousel.cycle());
  }

});