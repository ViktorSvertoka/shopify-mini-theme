document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('[data-featured-products]');

  sections.forEach(section => {
    const sectionId = section.dataset.sectionId;
    const sortSelect = section.querySelector(`#sort-by-${sectionId}`);
    const grid = section.querySelector(`#featured-products-grid-${sectionId}`);

    if (!sortSelect || !grid) return;

    function sortProducts(sortValue) {
      const productCards = Array.from(grid.querySelectorAll('.product-card'));

      productCards.sort((a, b) => {
        switch (sortValue) {
          case 'price-low':
            return Number(a.dataset.price) - Number(b.dataset.price);

          case 'price-high':
            return Number(b.dataset.price) - Number(a.dataset.price);

          case 'title-ascending':
            return a.dataset.title.localeCompare(b.dataset.title);

          default:
            return 0;
        }
      });

      productCards.forEach(card => grid.appendChild(card));
    }

    sortSelect.addEventListener('change', e => {
      sortProducts(e.target.value);
    });

    document.body.addEventListener('click', async e => {
      if (
        e.target.classList.contains('product-card__button') &&
        !e.target.classList.contains('product-card__button--sold-out')
      ) {
        const button = e.target;
        const variantId = button.dataset.variantId;

        const originalText = button.textContent;
        button.textContent = 'Adding...';
        button.disabled = true;

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: variantId,
              quantity: 1,
            }),
          });

          if (!response.ok) throw new Error('Add to cart error');
          const data = await response.json();

          document.dispatchEvent(
            new CustomEvent('cart:updated', { detail: data })
          );

          button.textContent = '✓ Added!';
          button.classList.add('product-card__button--success');

          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('product-card__button--success');
          }, 2000);
        } catch (error) {
          console.error(error);
          button.textContent = '✗ Error';
          button.classList.add('product-card__button--error');

          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('product-card__button--error');
          }, 2000);
        }
      }
    });
  });
});
