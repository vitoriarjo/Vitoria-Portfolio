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
    input.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    } finally {
      input.remove();
    }
    return copied;
  }

  document.addEventListener('click', async function (event) {
    const button = event.target.closest('button[data-share-case]');
    if (!button) return;
    const slug = button.getAttribute('data-share-case');
    if (!/^[a-z0-9-]+$/.test(slug)) return;

    const url = new URL('cases/' + slug + '/', document.baseURI).href;
    const feedback = button.nextElementSibling;
    const copied = await copyText(url);
    const message = copied ? 'Link copiado!' : 'Não foi possível copiar. Abra o link: ' + url;

    if (feedback && feedback.classList.contains('case-share-feedback')) {
      feedback.textContent = message;
    }
    if (copied && window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture('case_link_copied', { case_slug: slug });
    }
  });
})();