document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') root.classList.add('dark');
  if (savedTheme === 'light') root.classList.remove('dark');

  toggle.addEventListener('click', () => {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
