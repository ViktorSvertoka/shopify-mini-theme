const initCollectionCarousel = async () => {
  const section = document.querySelector('[data-recommendations]');
  if (!section) return;

  const limit = section.dataset.limit || 8;
  const intent = section.dataset.intent || 'related';
  const fallbackCollection = section.dataset.collection || 'all';
  const productId = section.dataset.productId || window.meta?.product?.id;

  let products = [];

  if (productId) {
    products = await loadRecommended(productId, limit, intent);
  }

  if (!products.length) {
    products = await loadCollection(fallbackCollection, limit);
  }

  if (!products.length) {
    section.style.display = 'none';
    return;
  }

  renderProducts(section, products);

  initSwiper(section);
};

async function loadRecommended(id, limit, intent) {
  try {
    const url = `/recommendations/products.json?product_id=${id}&limit=${limit}&intent=${intent}`;
    const res = await fetch(url, { credentials: 'same-origin' });
    const data = await res.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (e) {
    console.warn('[Carousel] recommendation error:', e);
    return [];
  }
}

async function loadCollection(handle, limit) {
  try {
    const url = `/collections/${encodeURIComponent(handle)}/products.json?limit=${limit}`;
    const res = await fetch(url, { credentials: 'same-origin' });
    const data = await res.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (e) {
    console.error('[Carousel] collection load error:', e);
    return [];
  }
}

function renderProducts(section, products) {
  const wrapper = section.querySelector('.collection-carousel__list');
  const swiper = section.querySelector('.collection-carousel__swiper');

  wrapper.innerHTML = '';

  products.forEach(p => {
    const href = p.url || `/products/${p.handle}`;

    const img = p.featured_image || p.images?.[0] || null;
    const src = img?.src || '';
    const title = escapeHtml(p.title || '');

    const priceRaw = p.price ?? p.price_min ?? p.variants?.[0]?.price ?? null;

    const price =
      typeof Shopify !== 'undefined' && Shopify.formatMoney
        ? Shopify.formatMoney(priceRaw, Shopify.money_format)
        : (priceRaw / 100).toFixed(2);

    const li = document.createElement('li');
    li.className = 'collection-carousel__item swiper-slide';

    li.innerHTML = `
      <div class="collection-carousel__card">
        <a href="${href}" class="collection-carousel__link" aria-label="${title}">
          ${src ? generateImageTag(src, title) : ''}
        </a>
        <p class="collection-carousel__name">${title}</p>
        <span class="collection-carousel__price">${price}</span>
      </div>
    `;

    wrapper.appendChild(li);
  });

  swiper.hidden = false;
}

function generateImageTag(src, alt) {
  const makeSize = (url, size) =>
    url.replace(/\.jpg|\.jpeg|\.png|\.webp/i, match => `_${size}x${match}`);

  const src600 = makeSize(src, 600);
  const src1200 = makeSize(src, 1200);

  return `
    <img
      class="collection-carousel__image"
      src="${src600}"
      srcset="${src600} 1x, ${src1200} 2x"
      alt="${alt}"
      width="600"
      height="600"
      loading="lazy"
      decoding="async"
    >
  `;
}

function initSwiper(section) {
  if (typeof Swiper === 'undefined') {
    console.warn('[Carousel] Swiper not loaded');
    return;
  }

  const container = section.querySelector('.collection-carousel__swiper');

  new Swiper(container, {
    direction: 'horizontal',
    speed: 500,
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 24,
    navigation: {
      nextEl: '.collection-carousel__button--next',
      prevEl: '.collection-carousel__button--prev',
    },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: { slidesPerView: 1.1, spaceBetween: 12 },
      768: { slidesPerView: 2.5, spaceBetween: 16 },
      1280: { slidesPerView: 4, spaceBetween: 24 },
    },
    observer: true,
    observeParents: true,
    keyboard: true,
  });
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        m
      ]
  );
}

['DOMContentLoaded', 'shopify:section:load'].forEach(ev =>
  document.addEventListener(ev, initCollectionCarousel)
);
