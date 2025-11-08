document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('bannerProductSection');
  const toggle = document.getElementById('themeToggle');

  if (!section || !toggle) return;

  // читаємо збережену тему тільки для цієї секції
  const savedTheme = localStorage.getItem('banner-product-theme');
  if (savedTheme === 'dark') section.classList.add('dark');
  if (savedTheme === 'light') section.classList.remove('dark');

  // перемикання теми тільки для цієї секції
  toggle.addEventListener('click', () => {
    section.classList.toggle('dark');
    const isDark = section.classList.contains('dark');
    localStorage.setItem('banner-product-theme', isDark ? 'dark' : 'light');
  });
});
