document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('[data-all-images]');
  if (!gallery) return;

  const allImages = JSON.parse(gallery.dataset.allImages || '[]');
  const mainImage = document.querySelector('.banner-product__main');
  const thumbsImage = document.querySelector('.banner-product__thumbs');
  const stockBlock = document.querySelector('.banner-product__stock');
  const colorButtons = document.querySelectorAll('.banner-product__color-btn');
  const sizeButtons = document.querySelectorAll('.banner-product__size-btn');
  const priceBlock = document.querySelector('.banner-product__price');

  function renderGallery(start, end) {
    const images = allImages.slice(start, end + 1);
    if (!images.length) return;

    mainImage.innerHTML = `
      <div>
        <img src="${images[0]}" alt="Product" class="w-[468px] h-[468px] sm:w-[536px] sm:h-[536px] object-cover block js-main-image" />
      </div>`;

    thumbsImage.innerHTML = images
      .map(
        (img, idx) => `
        <div class="rounded-base overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 mb-6 last:mb-0">
          <img 
            src="${img}" 
            alt="Product thumbnail" 
            class="w-[88px] h-[88px] object-cover block js-thumb-image ${
              idx === 0 ? 'is-active' : ''
            }" 
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

        thumbImgs.forEach(t =>
          t.classList.remove(
            'is-active',
            'ring-2',
            'ring-dark',
            'dark:ring-darkInverse'
          )
        );
        thumb.classList.add(
          'is-active',
          'ring-2',
          'ring-dark',
          'dark:ring-darkInverse'
        );
      });
    });

    // Add ring to first active thumb
    if (thumbImgs[0]) {
      thumbImgs[0].classList.add(
        'ring-2',
        'ring-dark',
        'dark:ring-darkInverse'
      );
    }
  }

  function updatePrice(price, compare) {
    if (!priceBlock) return;
    if (compare && compare !== 'null') {
      priceBlock.innerHTML = `
        <span class="price price--sale text-dark dark:text-darkInverse font-semibold">${price}</span>
        <span class="price price--old line-through text-oldPrice dark:text-oldPriceDark ml-2">${compare}</span>
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
    firstBtn.classList.add(
      'is-active',
      '!border-dark',
      'dark:!border-darkInverse'
    );
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
            stockBlock.textContent = stockBlock.dataset.notAvailable;
          } else {
            stockBlock.textContent =
              stockBlock.dataset.availableTemplate.replace('__COUNT__', qty);
          }
        }

        updatePrice(btn.dataset.price, btn.dataset.compare);

        colorButtons.forEach(b => {
          b.classList.remove(
            'is-active',
            '!border-dark',
            'dark:!border-darkInverse'
          );
        });
        btn.classList.add(
          'is-active',
          '!border-dark',
          'dark:!border-darkInverse'
        );
      });
    });
  }

  if (sizeButtons.length) {
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeButtons.forEach(b => {
          b.classList.remove(
            'is-active',
            '!border-dark',
            'dark:!border-darkInverse'
          );
        });
        btn.classList.add(
          'is-active',
          '!border-dark',
          'dark:!border-darkInverse'
        );
      });
    });
  }
});
