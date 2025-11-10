// collection-carousel.js

// Ініціалізація каруселі після завантаження сторінки або секції
const initCollectionCarousel = () => {
  if (typeof Swiper === 'undefined') {
    console.warn(
      'Swiper library not loaded — please include Swiper JS globally.'
    );
    return;
  }

  const container = document.querySelector('.collection-carousel__swiper');
  if (!container) return;

  // Конфігурація Swiper
  const collectionCarouselConfig = {
    direction: 'horizontal',
    speed: 600,
    slidesPerView: 'auto',
    spaceBetween: 24,
    centeredSlides: false,

    // Кнопки навігації
    navigation: {
      nextEl: '.collection-carousel__button--next',
      prevEl: '.collection-carousel__button--prev',
    },

    breakpoints: {
      320: { slidesPerView: 1.1, spaceBetween: 16 },
      768: { slidesPerView: 2.5, spaceBetween: 16 },
      1280: { slidesPerView: 4, spaceBetween: 24 },
    },

    keyboard: { enabled: true, onlyInViewport: true },
    observer: true,
    observeParents: true,
    watchSlidesProgress: true,
  };

  // Ініціалізація слайдера
  new Swiper(container, collectionCarouselConfig);
};

// Підключення для стандартної сторінки і Theme Editor
['DOMContentLoaded', 'shopify:section:load'].forEach(event =>
  document.addEventListener(event, initCollectionCarousel)
);
