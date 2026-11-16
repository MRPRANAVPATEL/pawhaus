document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveals: content remains visible if IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 4) * 85, 255)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Mobile navigation.
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', isOpen);
  });

  document.querySelectorAll('.desktop-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });

  // Search overlay.
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchTrigger = document.querySelector('.search-trigger');
  const searchClose = document.getElementById('searchClose');

  function openSearch() {
    searchPanel.classList.add('open');
    searchPanel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    window.setTimeout(() => searchInput.focus(), 150);
  }
  function closeSearch() {
    searchPanel.classList.remove('open');
    searchPanel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    searchTrigger.focus();
  }
  searchTrigger.addEventListener('click', openSearch);
  searchClose.addEventListener('click', closeSearch);
  searchPanel.addEventListener('click', (event) => {
    if (event.target === searchPanel) closeSearch();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && searchPanel.classList.contains('open')) closeSearch();
  });

  // Product filters.
  const filterButtons = document.querySelectorAll('.filter-button');
  const productCards = document.querySelectorAll('.product-card');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      productCards.forEach((card) => {
        const shouldShow = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });

  // Frontend-only cart interaction.
  let cartCount = 0;
  const bagCount = document.getElementById('bagCount');
  document.querySelectorAll('.quick-add').forEach((button) => {
    button.addEventListener('click', () => {
      cartCount += 1;
      bagCount.textContent = String(cartCount);
      const original = button.textContent;
      button.textContent = '✓';
      button.classList.add('added');
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove('added');
      }, 900);
    });
  });

  // Demo newsletter form: validate locally and show confirmation, no request is sent.
  const newsletterForm = document.getElementById('newsletterForm');
  const formMessage = document.getElementById('formMessage');
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email');
    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }
    formMessage.textContent = `You're on the list, ${email.value}. This is a frontend demo, so nothing was stored.`;
    formMessage.classList.add('success');
    newsletterForm.reset();
  });

  // Subtle cursor accent on desktop only.
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
    window.addEventListener('pointermove', (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }
});
