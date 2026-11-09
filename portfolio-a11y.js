/* Sprint 03 — melhoria progressiva de acesso por teclado e menu mobile */
(function(){
  'use strict';
  const menu=document.getElementById('mobile-nav');
  const skip=document.getElementById('skip-content');
  const views=[...document.querySelectorAll('.single-page-view')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const activeView=()=>document.querySelector('.single-page-view.active');
  let scheduled=0;
  function closeMenu(){if(menu)menu.open=false;}
  function focusCurrentView(){
    const v=activeView();
    if(!v)return;
    const title=v.querySelector('h1')||v;
    if(!title.hasAttribute('tabindex')) title.setAttribute('tabindex','-1');
    title.focus({preventScroll:true});
  }
  function queueFocus(){
    cancelAnimationFrame(scheduled);
    scheduled=requestAnimationFrame(()=>{scheduled=requestAnimationFrame(focusCurrentView);});
  }
  // Only take focus after explicit keyboard / pointer navigation, not initial load.
  document.addEventListener('click',function(e){
    const link=e.target.closest('a');
    if(!link)return;
    if(menu&&menu.contains(link))closeMenu();
    const href=link.getAttribute('href')||'';
    if(link===skip){
      e.preventDefault();
      const home=document.getElementById('page-home');
      if(home&&home.classList.contains('active')){const h=home.querySelector('h1');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});h.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});}}
      else focusCurrentView();
      return;
    }
    const internalRoute=href.startsWith('#')&&(href.length>1);
    if(internalRoute&&link.closest('.nav,.mobile-nav,.case-page-shell,.insight-page,#page-home,.footer')){
      if(/^(#home|#cases|#sobre|#experiencia|#recomendacoes|#insights)$/.test(href)){
        // Section scrolling is handled by the existing router; avoid moving focus away from the destination.
        const id=href.slice(1);
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          const target=id==='home'?document.querySelector('#page-home h1'):document.getElementById(id);
          if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
        }));
      }else if(/^#(?:case-|page-case-|insight-|page-insight-)/.test(href)){queueFocus();}
    }
  });
  if(menu){
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.open){closeMenu();menu.querySelector('summary')?.focus();}});
    document.addEventListener('click',function(e){if(menu.open&&!menu.contains(e.target))closeMenu();});
    window.addEventListener('resize',function(){if(window.innerWidth>900)closeMenu();});
  }
  window.addEventListener('popstate',queueFocus);
  // Preserve the existing hash router; this layer only enhances focus after navigating.
})();