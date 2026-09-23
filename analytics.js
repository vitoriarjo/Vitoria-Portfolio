/* Portfolio analytics — PostHog
   Add the PostHog Project API Key below to activate collection.
   This file intentionally avoids sending names, emails, phone numbers or link hrefs.
*/
(function () {
  'use strict';

  var POSTHOG_PROJECT_KEY = 'phc_CXJiN2bCyuXnh3YJXG49CSUf4pfEcoKJ9ZHw27AenaCi';
  var POSTHOG_API_HOST = 'https://us.i.posthog.com';

  function isInternalBrowser() {
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('internal') === '1') localStorage.setItem('portfolio_internal', '1');
      if (params.get('internal') === '0') localStorage.removeItem('portfolio_internal');
      return localStorage.getItem('portfolio_internal') === '1';
    } catch (e) {
      return false;
    }
  }

  if (isInternalBrowser()) {
    console.info('[portfolio analytics] Internal browser: analytics disabled.');
    return;
  }

  if (!POSTHOG_PROJECT_KEY || POSTHOG_PROJECT_KEY.indexOf('phc_') !== 0) {
    console.info('[portfolio analytics] PostHog is ready for setup. Add the Project API Key in analytics.js.');
    return;
  }

  // Official PostHog browser snippet loader.
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  function currentRoute() {
    return (window.location.hash || '#home').replace(/^#/, '') || 'home';
  }

  function pageType(route) {
    if (route.indexOf('case-') === 0 || route.indexOf('page-case-') === 0) return 'case';
    if (route.indexOf('insight-') === 0 || route.indexOf('page-insight-') === 0) return 'insight';
    return 'home';
  }

  function sectionFor(el) {
    var section = el && el.closest ? el.closest('section') : null;
    if (section && section.id) return section.id;
    if (el && el.closest && el.closest('nav')) return 'nav';
    if (el && el.closest && el.closest('footer')) return 'footer';
    return 'unknown';
  }

  function eventFromElement(el) {
    var action = el.getAttribute('data-track') || '';
    var href = el.getAttribute('href') || '';

    if (action.indexOf('ver-case-') === 0) return 'case_opened';
    if (action.indexOf('ler-artigo-') === 0) return 'insight_opened';
    if (action === 'baixar-cv' || /\.pdf(?:$|[?#])/i.test(href)) return 'cv_clicked';
    if (action === 'linkedin' || /linkedin\.com/i.test(href)) return 'linkedin_clicked';
    if (/^mailto:/i.test(href)) return 'email_clicked';
    if (/wa\.me\//i.test(href)) return 'whatsapp_clicked';
    if (el.hasAttribute('data-route') || el.hasAttribute('data-home-anchor')) return 'navigation_clicked';
    return action ? 'portfolio_click' : '';
  }

  function eventProperties(el) {
    var action = el.getAttribute('data-track') || null;
    var targetRoute = el.getAttribute('data-route') || el.getAttribute('data-home-anchor') || null;
    var route = currentRoute();
    var props = {
      portfolio_action: action,
      portfolio_section: sectionFor(el),
      portfolio_route: route,
      portfolio_page_type: pageType(route),
      target_route: targetRoute
    };

    if (action && action.indexOf('ver-case-') === 0) {
      props.case_slug = action.replace('ver-case-', '');
      props.case_type = el.getAttribute('data-case-type') || 'unknown';
    }
    if (action && action.indexOf('ler-artigo-') === 0) {
      props.insight_slug = action.replace('ler-artigo-', '');
    }
    return props;
  }

  var lastPageviewKey = '';
  var lastPageviewAt = 0;

  function captureVirtualPageview() {
    if (!window.posthog || typeof window.posthog.capture !== 'function') return;
    var route = currentRoute();
    var key = window.location.pathname + '#' + route;
    var now = Date.now();

    // Avoid double counting when popstate + hashchange fire together.
    if (key === lastPageviewKey && now - lastPageviewAt < 1000) return;
    lastPageviewKey = key;
    lastPageviewAt = now;

    window.posthog.capture('$pageview', {
      $current_url: window.location.href,
      portfolio_route: route,
      portfolio_page_type: pageType(route)
    });
  }

  window.posthog.init(POSTHOG_PROJECT_KEY, {
    api_host: POSTHOG_API_HOST,
    autocapture: true,
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: 'identified_only',
    disable_session_recording: true,
    loaded: function () {
      captureVirtualPageview();
    }
  });

  document.addEventListener('click', function (event) {
    var el = event.target.closest('[data-track], a[data-route], a[data-home-anchor], a[href*="linkedin.com"], a[href^="mailto:"], a[href*="wa.me/"], a[href$=".pdf"]');
    if (!el) return;

    var eventName = eventFromElement(el);
    if (eventName && window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(eventName, eventProperties(el));
    }

    // pushState does not fire hashchange, so capture the new virtual page after the router runs.
    if (el.hasAttribute('data-route') || el.hasAttribute('data-home-anchor')) {
      window.setTimeout(captureVirtualPageview, 0);
    }
  }, true);

  window.addEventListener('popstate', captureVirtualPageview);
  window.addEventListener('hashchange', captureVirtualPageview);
})();
