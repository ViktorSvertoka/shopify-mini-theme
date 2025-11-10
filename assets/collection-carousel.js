const initCollectionCarousel = async () => {
  const section = document.querySelector('[data-recommendations]');
  if (!section) return;

  const productMeta = document.querySelector('[data-product-id]');
  const productId = productMeta
    ? productMeta.dataset.productId
    : window.meta?.product?.id;

  if (!productId) {
    console.warn('[Carousel] No product ID found.');
    return;
  }

  const limit = section.dataset.limit || 8;
  const intent = section.dataset.intent || 'related';
  const url = `/recommendations/products.json?product_id=${productId}&limit=${limit}&intent=${intent}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.products?.length) {
      section.style.display = 'none';
      return;
    }

    renderProducts(section, data.products);
    initSwiper(section);
  } catch (error) {
    console.error('[Carousel] Failed to load recommendations:', error);
  }
};

function renderProducts(section, products) {
  const list = section.querySelector('.collection-carousel__list');
  const swiper = section.querySelector('.collection-carousel__swiper');
  list.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.className = 'collection-carousel__item swiper-slide';
    li.innerHTML = `
      <div class='collection-carousel__card'>
        <a href='${product.url}' class='collection-carousel__link'>
          <img
            class='collection-carousel__image'
            src='${product.featured_image}'
            alt='${product.title}'
            loading='lazy'
          >
        </a>
        <p class='collection-carousel__name'>${product.title}</p>
        <span class='collection-carousel__price'>
          ${Shopify.formatMoney(product.price, Shopify.money_format)}
        </span>
      </div>
    `;
    list.appendChild(li);
  });

  swiper.hidden = false;
}

function initSwiper(section) {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper not loaded.');
    return;
  }

  const container = section.querySelector('.collection-carousel__swiper');
  new Swiper(container, {
    direction: 'horizontal',
    speed: 600,
    slidesPerView: 'auto',
    spaceBetween: 24,
    centeredSlides: false,
    loop: true,
    navigation: {
      nextEl: '.collection-carousel__button--next',
      prevEl: '.collection-carousel__button--prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
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
  });
}

['DOMContentLoaded', 'shopify:section:load'].forEach(event =>
  document.addEventListener(event, initCollectionCarousel)
);
