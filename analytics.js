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

  var caseSlugs = ['autoagendamento','troca-tecnologia','voice-cloud','jornada-fibra','formalizacao','automacao-capacidade','release-governance','portfolio-product','governanca-backlog','novo-brisacliente'];
  var insightSlugs = ['mvp','priorizacao','rollout','pos-go-live'];
  var homeAnchors = ['home','sobre','impacto','cases','metodo','experiencia','recomendacoes','insights','contato'];
  function currentRoute() {
    if (/\/case-novo-brisacliente\.html$/i.test(window.location.pathname)) return 'case-novo-brisacliente';
    if (/\/cases\/governanca-backlog\/(?:index\.html)?$/i.test(window.location.pathname)) return 'case-governanca-backlog';
    var hash = (window.location.hash || '#home').replace(/^#/, '');
    var active = document.querySelector('.single-page-view.active');
    if (active && active.id !== 'page-home') {
      var activeRoute = active.id.replace(/^page-/, '');
      if (activeRoute.indexOf('case-') === 0 && caseSlugs.indexOf(activeRoute.slice(5)) >= 0) return activeRoute;
      if (activeRoute.indexOf('insight-') === 0 && insightSlugs.indexOf(activeRoute.slice(8)) >= 0) return activeRoute;
    }
    hash = hash.replace(/^page-/, '');
    if (caseSlugs.indexOf(hash.slice(5)) >= 0 && hash.indexOf('case-') === 0) return hash;
    if (insightSlugs.indexOf(hash.slice(8)) >= 0 && hash.indexOf('insight-') === 0) return hash;
    return homeAnchors.indexOf(hash) >= 0 ? hash : 'home';
  }

  function pageType(route) {
    if (route.indexOf('case-') === 0 || route.indexOf('page-case-') === 0) return 'case';
    if (route.indexOf('insight-') === 0 || route.indexOf('page-insight-') === 0) return 'insight';
    return 'home';
  }

  function sectionFor(el) {
    var section = el && el.closest ? el.closest('section') : null;
    if (el && el.closest && el.closest('.cs-case-nav')) return 'case_navigation';
    if (el && el.closest && el.closest('.case-card-v4')) return 'featured_cases';
    if (el && el.closest && el.closest('.compact-case-grid')) return 'other_cases';
    if (el && el.closest && el.closest('.hero, .case-hero')) return 'hero';
    if (el && el.closest && el.closest('.reco-card, .reco-all-link')) return 'recommendations';
    if (section && section.id && homeAnchors.indexOf(section.id) >= 0) return section.id;
    if (el && el.closest && el.closest('.case-page-shell, #case-main')) return 'case_content';
    if (el && el.closest && el.closest('nav')) return 'nav';
    if (el && el.closest && el.closest('footer')) return 'footer';
    return 'unknown';
  }

  function eventFromElement(el) {
    var action = el.getAttribute('data-track') || '';
    var href = el.getAttribute('href') || '';

    if (action.indexOf('ver-case-') === 0) return 'case_opened';
    if (action.indexOf('filtrar-cases-') === 0) return 'case_filter_selected';
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
      target_route: targetRoute,
      measurement_version: 's04'
    };

    if (action && action.indexOf('ver-case-') === 0) {
      props.case_slug = action.replace('ver-case-', '');
      props.case_type = el.getAttribute('data-case-type') || 'unknown';
    }
    if (action && action.indexOf('filtrar-cases-') === 0) {
      props.case_filter = el.getAttribute('data-case-filter') || 'unknown';
    }
    if (action && action.indexOf('ler-artigo-') === 0) {
      props.insight_slug = action.replace('ler-artigo-', '');
    }
    return props;
  }

  function capture(name, props) {
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(name, Object.assign({measurement_version:'s04'}, props || {}));
      }
    } catch (_) { /* analytics must not interrupt navigation */ }
  }

  var lastPageviewKey = '';
  var lastViewKey = '';
  var depthSeen = {};
  var depthRoute = '';
  var depthPending = false;
  function measureDepth() {
    depthPending = false;
    var route = currentRoute();
    if (pageType(route) !== 'case' || depthRoute !== route || document.visibilityState === 'hidden') return;
    var main = document.querySelector('.single-page-view.active') || document.querySelector('main');
    if (!main) return;
    var rect = main.getBoundingClientRect();
    if (rect.height <= 0) return;
    var progress = Math.min(100, Math.max(0, (window.innerHeight - rect.top) / rect.height * 100));
    [25,50,75,100].forEach(function (threshold) {
      if (progress >= threshold - (threshold === 100 ? 0.1 : 0) && !depthSeen[threshold]) {
        depthSeen[threshold] = true;
        capture('case_depth_reached',{case_slug:route.slice(5),depth_percent:threshold,portfolio_route:route});
      }
    });
  }
  function scheduleDepth() {
    if (depthPending) return;
    depthPending = true;
    window.requestAnimationFrame(measureDepth);
  }

  function captureVirtualPageview() {
    if (!window.posthog || typeof window.posthog.capture !== 'function') return;
    var route = currentRoute();
    var key = window.location.pathname + '#' + route;

    // Avoid double counting when popstate + hashchange fire together.
    if (key === lastPageviewKey) return;
    lastPageviewKey = key;

    capture('$pageview', {
      $current_url: window.location.origin + window.location.pathname + '#' + route,
      portfolio_route: route,
      portfolio_page_type: pageType(route)
    });
    var viewKey = pageType(route) === 'home' ? 'home' : route;
    if (viewKey !== lastViewKey) {
      lastViewKey = viewKey;
      capture('portfolio_viewed', {portfolio_route:route, portfolio_page_type:pageType(route)});
      if (pageType(route) === 'case') capture('case_viewed', {case_slug:route.slice(5),portfolio_route:route});
      depthSeen = {};
      depthRoute = viewKey;
      scheduleDepth();
    }
  }

  window.posthog.init(POSTHOG_PROJECT_KEY, {
    api_host: POSTHOG_API_HOST,
    autocapture: true,
    mask_all_element_attributes: true,
    mask_all_text: true,
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
      var props = eventProperties(el);
      capture(eventName, props);
      var action = el.getAttribute('data-track') || '';
      var channel = eventName === 'cv_clicked' && action === 'baixar-cv' ? 'cv' :
        eventName === 'linkedin_clicked' && action === 'linkedin' ? 'linkedin' :
        eventName === 'email_clicked' ? 'email' : eventName === 'whatsapp_clicked' ? 'whatsapp' : '';
      if (channel) capture('professional_intent_clicked', Object.assign({},props,{intent_channel:channel}));
    }

    // pushState does not fire hashchange, so capture the new virtual page after the router runs.
    if (el.hasAttribute('data-route') || el.hasAttribute('data-home-anchor')) {
      window.setTimeout(captureVirtualPageview, 0);
    }
  }, true);

  function queuePageview() { window.setTimeout(captureVirtualPageview, 0); }
  window.addEventListener('popstate', queuePageview);
  window.addEventListener('hashchange', queuePageview);
  window.addEventListener('scroll', scheduleDepth, {passive:true});
  window.addEventListener('resize', scheduleDepth);
  // SDK queues captures before its network loader finishes; preserve first route.
  queuePageview();
})();
