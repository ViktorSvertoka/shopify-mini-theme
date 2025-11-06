document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.js-gallery');
  if (!gallery) return;

  let allImages = [];
  try {
    allImages = JSON.parse(gallery.dataset.allImages || '[]');
  } catch (e) {
    console.error('Failed to parse images:', e);
    return;
  }

  if (!allImages.length) {
    console.warn('No images found');
    return;
  }

  const mainImage = document.querySelector('.js-main');
  const thumbsImage = document.querySelector('.js-thumbs');
  const stockBlock = document.querySelector('.banner-product__stock');
  const colorButtons = document.querySelectorAll('.banner-product__color-btn');
  const sizeButtons = document.querySelectorAll('.banner-product__size-btn');
  const priceBlock = document.querySelector('.banner-product__price');

  function renderGallery(start, end) {
    const images = allImages.slice(start, end + 1);
    if (!images.length) return;

    mainImage.innerHTML = `
      <img
        src="${images[0]}" 
        alt="Product image" 
        loading="lazy" 
        class="js-main-image w-[468px] h-[468px] object-cover block md:w-[536px] md:h-[536px]" 
      />`;

    thumbsImage.innerHTML = images
      .map(
        (img, idx) => `
        <div class="banner-product__thumb" style="cursor: pointer;">
          <img 
            src="${img}" 
            alt="Product thumbnail"
            loading="lazy" 
            class="js-thumb-image ${idx === 0 ? 'is-active' : ''}" 
          />
        </div>
      `
      )
      .join('');

    const mainImg = mainImage.querySelector('.js-main-image');
    const thumbImgs = thumbsImage.querySelectorAll('.js-thumb-image');

    thumbImgs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        mainImg.src = thumb.src;
        thumbImgs.forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });
  }

  function updatePrice(price, compare) {
    if (!priceBlock) return;
    if (compare && compare !== 'null' && compare !== '₹0.00') {
      priceBlock.innerHTML = `
        <span class="price price--sale">${price}</span>
        <span class="price price--old">${compare}</span>
      `;
    } else {
      priceBlock.innerHTML = `<span class="price">${price}</span>`;
    }
  }

  if (colorButtons.length) {
    const firstBtn = colorButtons[0];
    renderGallery(
      parseInt(firstBtn.dataset.start),
      parseInt(firstBtn.dataset.end)
    );
    firstBtn.classList.add('is-active');
    updatePrice(firstBtn.dataset.price, firstBtn.dataset.compare);

    colorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const start = parseInt(btn.dataset.start);
        const end = parseInt(btn.dataset.end);
        const qty = parseInt(btn.dataset.qty, 10) || 0;
        const available = btn.dataset.available === 'true';

        renderGallery(start, end);

        if (stockBlock) {
          if (!available || qty === 0) {
            stockBlock.textContent =
              stockBlock.dataset.notAvailable || 'Not available';
          } else {
            const template =
              stockBlock.dataset.availableTemplate || 'Available: __COUNT__';
            stockBlock.textContent = template.replace('__COUNT__', qty);
          }
        }

        updatePrice(btn.dataset.price, btn.dataset.compare);

        colorButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  } else {
    renderGallery(0, allImages.length - 1);
  }

  if (sizeButtons.length) {
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const addToCartBtn = document.querySelector(
          '.banner-product__add-to-cart'
        );
        if (addToCartBtn && btn.dataset.variantId) {
          addToCartBtn.href = `/cart/add?id=${btn.dataset.variantId}&quantity=1`;
        }
      });
    });
  }
});
