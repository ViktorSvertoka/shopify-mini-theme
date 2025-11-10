if (typeof Swiper !== 'undefined') {
  const collectionCarouselConfig = {
    direction: 'horizontal',
    speed: 600,
    slidesPerView: 'auto',
    spaceBetween: 24,
    centeredSlides: false,
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

  const initCollectionCarousel = () => {
    const container = document.querySelector('.collection-carousel__swiper');
    if (!container) return;

    new Swiper(container, {
      modules: [Swiper.Navigation],
      ...collectionCarouselConfig,
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollectionCarousel);
  } else {
    initCollectionCarousel();
  }
} else {
  console.warn(
    'Swiper library not loaded — please include Swiper JS globally.'
  );
}
