/* Sprint 06 — permalinks compartilháveis dos cases internos. */
(function () {
  'use strict';

  async function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Fallback para navegadores que bloqueiam a Clipboard API.
      }
    }
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(input);
    const previousFocus = document.activeElement;
    input.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    } finally {
      input.remove();
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus({preventScroll:true});
    }
    return copied;
  }

  document.addEventListener('click', async function (event) {
    const button = event.target.closest('button[data-share-case]');
    if (!button) return;
    const slug = button.getAttribute('data-share-case');
    if (!/^[a-z0-9-]+$/.test(slug)) return;

    const page = new URL(document.baseURI);
    const root = /\/cases\/governanca-backlog\/(?:index\.html)?$/.test(page.pathname) ? new URL('../../', page) : new URL('./', page);
    const url = new URL(slug === 'novo-brisacliente' ? 'case-novo-brisacliente.html' : 'cases/' + slug + '/', root).href;
    const feedback = button.nextElementSibling;
    if (button.dataset.copyBusy === 'true') return;
    button.dataset.copyBusy = 'true';
    let copied = false;
    try { copied = await copyText(url); } catch (_) { /* show fallback */ }
    finally { delete button.dataset.copyBusy; }
    const message = copied ? 'Link copiado!' : 'Não foi possível copiar. Abra o link: ' + url;

    if (feedback && feedback.classList.contains('case-share-feedback')) {
      feedback.textContent = message;
    }
    const label = button.querySelector('.case-share-label');
    if (label && copied) {
      label.textContent = 'Link copiado!';
      clearTimeout(button._copyTimer);
      button._copyTimer = setTimeout(() => { label.textContent = 'Copiar link'; }, 2200);
    }
    if (copied && window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture('case_link_copied', { case_slug: slug });
    }
  });
})();