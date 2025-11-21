const initCollectionCarousel = async () => {
  const section = document.querySelector('[data-recommendations]');
  if (!section) return;

  const limit = section.dataset.limit || 8;
  const intent = section.dataset.intent || 'related';
  const collectionHandle = section.dataset.collection || 'all';

  const productId = section.dataset.productId || window.meta?.product?.id;

  if (productId) {
    try {
      const url = `/recommendations/products.json?product_id=${productId}&limit=${limit}&intent=${intent}`;
      const res = await fetch(url, { credentials: 'same-origin' });
      const data = await res.json();

      if (Array.isArray(data.products) && data.products.length) {
        renderProducts(section, data.products);
        initSwiper(section);
        return;
      }
    } catch (e) {
      console.warn(
        '[Carousel] recommendations failed, fallback to collection',
        e
      );
    }
  }

  try {
    const url = `/collections/${encodeURIComponent(collectionHandle)}/products.json?limit=${limit}`;
    const res = await fetch(url, { credentials: 'same-origin' });
    const data = await res.json();

    const products = Array.isArray(data.products) ? data.products : [];
    if (products.length) {
      renderProducts(section, products);
      initSwiper(section);
    } else {
      section.style.display = 'none';
    }
  } catch (e) {
    console.error('[Carousel] fallback load error', e);
    section.style.display = 'none';
  }
};

function renderProducts(section, products) {
  const list = section.querySelector('.collection-carousel__list');
  const swiper = section.querySelector('.collection-carousel__swiper');
  list.innerHTML = '';

  products.forEach(p => {
    const href = p.url || (p.handle ? `/products/${p.handle}` : '#');

    const imgSrc =
      (p.featured_image && (p.featured_image.src || p.featured_image)) ||
      (Array.isArray(p.images) &&
        p.images[0] &&
        (p.images[0].src || p.images[0])) ||
      '';

    const rawPrice =
      p.price != null
        ? p.price
        : p.price_min != null
          ? p.price_min
          : p.variants && p.variants[0] && p.variants[0].price;

    const priceHtml =
      typeof Shopify !== 'undefined' && Shopify.formatMoney
        ? Shopify.formatMoney(rawPrice, Shopify.money_format)
        : (Number(rawPrice) / 100).toFixed(2);

    const li = document.createElement('li');
    li.className = 'collection-carousel__item swiper-slide';
    li.innerHTML = `
      <div class='collection-carousel__card'>
        <a href='${href}' class='collection-carousel__link' aria-label='${escapeHtml(p.title || '')}'>
          ${
            imgSrc
              ? `<img
         class="collection-carousel__image"
         src="${imgSrc}"
         srcset="${imgSrc.replace(/\.jpg|\.png|\.webp/i, match => `_${600}${match}`)} 1x,
                 ${imgSrc.replace(/\.jpg|\.png|\.webp/i, match => `_${1200}${match}`)} 2x"
         alt="${escapeHtml(p.title || '')}"
         loading="lazy"
         decoding="async"
         width="600"
         height="600"
       >`
              : ''
          }

        </a>
        <p class='collection-carousel__name'>${escapeHtml(p.title || '')}</p>
        <span class='collection-carousel__price'>${priceHtml || ''}</span>
      </div>
    `;
    list.appendChild(li);
  });

  swiper.hidden = false;
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        m
      ]
  );
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

['DOMContentLoaded', 'shopify:section:load'].forEach(ev =>
  document.addEventListener(ev, initCollectionCarousel)
);
