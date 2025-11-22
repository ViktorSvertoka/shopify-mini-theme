document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('bannerProductSection');
  const toggle = document.getElementById('themeToggle');
  if (!section || !toggle) return;

  const saved = localStorage.getItem('banner-product-theme');
  if (saved === 'dark') section.classList.add('dark');

  toggle.addEventListener('click', () => {
    const isDark = section.classList.toggle('dark');
    localStorage.setItem('banner-product-theme', isDark ? 'dark' : 'light');

    toggle.querySelector('span:first-child').classList.toggle('hidden', isDark);
    toggle.querySelector('span:last-child').classList.toggle('hidden', !isDark);
  });
});
