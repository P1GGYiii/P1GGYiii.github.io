(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = themeToggle?.querySelector('.theme-toggle__label');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = siteNav ? Array.from(siteNav.querySelectorAll('a[href^="#"]')) : [];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  function closeMenu() {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
  }

  if (themeToggle) {
    const initialTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(initialTheme);
    themeToggle.addEventListener('click', toggleTheme);
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function () {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('open', !expanded);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      const targetId = link.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', targetId);
    });
  });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = '#' + entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  const yearNode = document.getElementById('currentYear');
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
})();
