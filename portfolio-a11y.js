/* Navegação acessível: complemento progressivo ao roteador de portfolio.js. */
(function () {
  'use strict';

  const menu = document.getElementById('mobile-nav');
  const skipLink = document.getElementById('skip-content');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const HOME_ANCHORS = new Set(['sobre', 'cases', 'experiencia', 'recomendacoes', 'insights']);
  let focusFrame = 0;

  function closeMenu() {
    if (menu) menu.open = false;
  }

  function activeView() {
    return document.querySelector('.single-page-view.active');
  }

  function focusElement(el) {
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  function focusDestination() {
    const view = activeView();
    if (!view) return;

    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    // Section links should focus the heading of the destination, not the top of the home.
    if (view.id === 'page-home' && HOME_ANCHORS.has(hash)) {
      const section = document.getElementById(hash);
      if (section && view.contains(section)) {
        focusElement(section.querySelector('h1, h2, h3') || section);
        return;
      }
    }

    // Routes for cases and articles: announce the new page's heading.
    focusElement(view.querySelector('h1') || view);
  }

  function queueFocus() {
    window.cancelAnimationFrame(focusFrame);
    focusFrame = window.requestAnimationFrame(function () {
      focusFrame = window.requestAnimationFrame(focusDestination);
    });
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!link) return;
    if (menu && menu.contains(link)) closeMenu();

    if (link === skipLink) {
      event.preventDefault();
      const view = activeView();
      if (!view) return;
      const heading = view.querySelector('h1') || view;
      focusElement(heading);
      heading.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
      return;
    }

    if (event.defaultPrevented && !link.hasAttribute('data-route') && !link.hasAttribute('data-home-anchor')) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    // pushState in the main router does not emit hashchange; explicitly sync focus.
    if (link.hasAttribute('data-route') || link.hasAttribute('data-home-anchor')) {
      queueFocus();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (menu && menu.open && event.key === 'Escape') {
      closeMenu();
      menu.querySelector('summary')?.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (menu && menu.open && !menu.contains(event.target)) closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });

  // Browser back/forward and ordinary hash links use the same focus handling.
  window.addEventListener('popstate', queueFocus);
  window.addEventListener('hashchange', queueFocus);
})();
