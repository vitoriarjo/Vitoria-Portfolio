/* Portfolio interactions extracted from index.html. */

(function(){
    try{
        var params=new URLSearchParams(window.location.search);
        if(params.get("internal")==="1") localStorage.setItem("portfolio_internal","1");
        if(params.get("internal")==="0") localStorage.removeItem("portfolio_internal");
        if(localStorage.getItem("portfolio_internal")==="1") return;
    }catch(e){}
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ymvuvgg1zd");
})();

(function(){
  const views = [...document.querySelectorAll('.single-page-view')];
  const home = document.getElementById('page-home');

  function setActiveView(view){
    views.forEach(v => {
      const active = v === view;
      v.classList.toggle('active', active);
      v.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
  }

  function routeToPageId(route){
    if (!route || route === 'home') return 'page-home';
    if (route.startsWith('page-case-')) return route;
    if (route.startsWith('case-')) return 'page-' + route;
    if (route.startsWith('page-insight-')) return route;
    if (route.startsWith('insight-')) return 'page-' + route;
    return null;
  }

  function showHome(anchor, updateTitle=true){
    setActiveView(home);
    if (updateTitle) document.title = 'Vitória Araújo — Product Manager · Jornada, Growth e Product Ops';
    requestAnimationFrame(() => {
      if (anchor) {
        const el = document.getElementById(anchor);
        if (el && home.contains(el)) el.scrollIntoView({behavior:'smooth', block:'start'});
        else window.scrollTo({top:0, behavior:'auto'});
      } else {
        window.scrollTo({top:0, behavior:'auto'});
      }
    });
  }

  function showRoute(route){
    const pageId = routeToPageId(route);
    const view = pageId ? document.getElementById(pageId) : null;
    if (!view || !view.classList.contains('single-page-view')) {
      showHome();
      return false;
    }
    setActiveView(view);
    const h1 = view.querySelector('h1');
    document.title = h1 ? h1.textContent.trim() + ' — Vitória Araújo' : 'Vitória Araújo — Product Manager · Jornada, Growth e Product Ops';
    window.scrollTo({top:0, behavior:'auto'});
    return true;
  }

  function showCaseAnchor(anchor){
    const target = document.getElementById(anchor);
    if (!target) return false;

    const caseView = target.closest('.single-page-view.case-page-shell');
    if (!caseView) return false;

    setActiveView(caseView);
    const h1 = caseView.querySelector('h1');
    document.title = h1 ? h1.textContent.trim() + ' — Vitória Araújo' : 'Vitória Araújo — Product Manager · Jornada, Growth e Product Ops';

    requestAnimationFrame(() => {
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
    return true;
  }

  function navigateHash(hash){
    const value = (hash || '').replace(/^#/, '');
    if (!value) return showHome();

    // Rotas principais dos cases.
    if (value.startsWith('case-')) {
      showRoute(value);
      return;
    }

    // Rotas dos artigos de Insights.
    if (value.startsWith('insight-') || value.startsWith('page-insight-')) {
      showRoute(value);
      return;
    }

    // Um hash page-case-* pode ser a página do case ou uma seção interna dela.
    if (value.startsWith('page-case-')) {
      const exactView = document.getElementById(value);
      if (exactView && exactView.classList.contains('single-page-view')) {
        showRoute(value);
        return;
      }
      if (showCaseAnchor(value)) return;
    }

    const anchor = document.getElementById(value);
    if (anchor && home.contains(anchor)) {
      showHome(value);
      return;
    }

    // Mantém o case aberto ao navegar por qualquer âncora interna.
    if (showCaseAnchor(value)) return;

    showHome();
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-route], a[data-home-anchor]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    if (link.dataset.route) {
      if (link.target === '_blank') return;
      event.preventDefault();
      const route = link.dataset.route;
      history.pushState({}, '', '#' + route);
      showRoute(route);
      return;
    }

    if (link.dataset.homeAnchor) {
      event.preventDefault();
      const anchor = link.dataset.homeAnchor;
      history.pushState({}, '', '#' + anchor);
      showHome(anchor);
    }
  });

  window.addEventListener('popstate', () => navigateHash(location.hash));
  window.addEventListener('hashchange', () => navigateHash(location.hash));

  // Initial load supports direct links, refreshes and shared URLs.
  navigateHash(location.hash);
})();

// Abas da tela compacta de rotas e operadoras.
document.querySelectorAll('.voice-v18-tab').forEach(function(tab){tab.addEventListener('click',function(){var key=tab.getAttribute('data-voice-panel');document.querySelectorAll('.voice-v18-tab').forEach(function(t){t.classList.toggle('active',t===tab)});document.querySelectorAll('.voice-v18-panel').forEach(function(p){p.classList.toggle('active',p.getAttribute('data-voice-content')===key)});var action=document.getElementById('voice-v18-primary-action');if(action){action.textContent=key==='carrier'?'+ Nova operadora':key==='inbound'?'+ Nova rota de entrada':key==='outbound'?'+ Nova rota de saída':'+ Nova rota'}})});

(function(){
  document.querySelectorAll('[data-route-demo]').forEach(function(demo){
    var panels=demo.querySelectorAll('[data-route-panel]');
    var title=demo.querySelector('[data-route-title]');
    var desc=demo.querySelector('[data-route-description]');
    var trigger=demo.querySelector('[data-route-action]');
    var menu=demo.querySelector('[data-create-menu]');
    var wrap=trigger ? trigger.closest('.voice-create-wrap') : null;
    var copy={
      overview:['Rotas cadastradas','Consulte e gerencie rotas de entrada e saída criadas em momentos distintos.'],
      inbound:['Criar rota de entrada','Defina como as chamadas recebidas serão encaminhadas.'],
      outbound:['Criar rota de saída','Configure originação, identificação e contingência de forma independente.'],
      carrier:['Cadastrar operadora','Configure uma conexão SIP reutilizável pelas rotas.']
    };
    function show(view){
      panels.forEach(function(p){p.classList.toggle('active',p.getAttribute('data-route-panel')===view)});
      title.textContent=copy[view][0];
      desc.textContent=copy[view][1];
      if(wrap){wrap.classList.remove('open')}
      if(trigger){trigger.setAttribute('aria-expanded','false')}
    }
    if(trigger){trigger.addEventListener('click',function(e){e.stopPropagation();var open=wrap.classList.toggle('open');trigger.setAttribute('aria-expanded',open?'true':'false')})}
    demo.querySelectorAll('[data-create-view]').forEach(function(option){option.addEventListener('click',function(){show(option.getAttribute('data-create-view'))})});
    demo.querySelectorAll('[data-route-back]').forEach(function(back){back.addEventListener('click',function(){show('overview')})});
    document.addEventListener('click',function(e){if(wrap && !wrap.contains(e.target)){wrap.classList.remove('open');trigger.setAttribute('aria-expanded','false')}});
  });
})();

(function(){
  const root=document.querySelector('[data-voice-demo]'); if(!root) return;
  const nav=[...root.querySelectorAll('[data-voice-module]')];
  const views=[...root.querySelectorAll('[data-voice-view]')];
  nav.forEach(btn=>btn.addEventListener('click',()=>{nav.forEach(x=>x.classList.toggle('active',x===btn));views.forEach(v=>v.classList.toggle('active',v.dataset.voiceView===btn.dataset.voiceModule));}));
  const wrap=root.querySelector('.create-menu-wrap'); const trigger=root.querySelector('[data-create-trigger]');
  if(trigger) trigger.addEventListener('click',e=>{e.stopPropagation();wrap.classList.toggle('open')});
  document.addEventListener('click',e=>{if(wrap&&!wrap.contains(e.target)) wrap.classList.remove('open')});
  const drawer=document.querySelector('[data-voice-drawer]'), title=document.querySelector('[data-drawer-title]'), kicker=document.querySelector('[data-drawer-kicker]'), body=document.querySelector('[data-drawer-body]');
  const forms={
    'new-user':['Cadastro de usuário','Novo usuário',['Nome completo','E-mail corporativo','Perfil de acesso','Grupo','Ramal','Status']],
    'edit-user':['Edição de usuário','Editar usuário',['Nome completo','E-mail corporativo','Perfil de acesso','Grupo','Ramal','Status']],
    'new-group':['Administração','Novo grupo',['Nome do grupo','Descrição','Perfil padrão','Usuários vinculados','Permissões','Status']],
    'new-report':['Inteligência artificial','Gerar relatório',['Período','Filas analisadas','Tipo de análise','Formato de saída']],
    'dashboard-filter':['Visão geral','Filtrar período',['Data inicial','Data final','Filas','Comparar com período anterior']],
    'save-admin':['Configurações','Confirmar alterações',['Resumo das alterações','Responsável pela aprovação']],
    'new-profile':['Permissões','Novo perfil de acesso',['Nome do perfil','Descrição','Perfil base','Escopo de dados','Unidades permitidas','Status']],
    'save-permissions':['Permissões','Salvar alterações',['Resumo das permissões alteradas','Justificativa','Responsável pela aprovação']],
    'group-permissions':['Grupo de usuários','Permissões do grupo',['Grupo','Perfil associado','Módulos permitidos','Filas e equipes visíveis','Permissões adicionais','Usuários vinculados']],
    'inbound':['Telefonia','Nova rota de entrada',['Nome da rota','Número recebido','Operadora','Destino principal','Horário de atendimento','Contingência']],
    'outbound':['Telefonia','Nova rota de saída',['Nome da rota','Prefixo de discagem','Operadora principal','Caller ID','Operadora de contingência','Prioridade']],
    'carrier':['Telefonia','Nova operadora',['Nome da operadora','Servidor SIP','Porta','Usuário','Senha','Canais simultâneos']]
  };
  function openDrawer(key, source){
    const f=forms[key];if(!f)return;
    kicker.textContent=f[0]; title.textContent=f[1];
    if(key==='group-permissions' || key==='new-group'){
      const groupName=(source&&source.dataset&&source.dataset.groupName) || (key==='new-group'?'Novo grupo':'Atendimento');
      kicker.textContent='Administração';
      title.textContent=key==='new-group'?'Criar grupo de usuários':'Permissões do grupo · '+groupName;
      const presets={
        'Atendimento':['monitor_view','monitor_agents','users_view','reports_view','calls_listen','calls_transfer'],
        'Comercial':['monitor_view','users_view','routes_view','reports_view','calls_transfer'],
        'Qualidade':['monitor_view','reports_view','ai_view','calls_listen'],
        'Novo grupo':['monitor_view']
      };
      const active=new Set(presets[groupName]||presets['Novo grupo']);
      const modules=[
        ['Monitoramento',[['monitor_view','Visualizar indicadores'],['monitor_agents','Visualizar equipes e agentes'],['monitor_intervene','Intervir em chamadas']]],
        ['Usuários e grupos',[['users_view','Visualizar usuários'],['users_create','Criar usuários'],['users_edit','Editar usuários'],['groups_manage','Gerenciar grupos']]],
        ['Telefonia',[['routes_view','Visualizar rotas'],['routes_create','Criar rotas'],['carriers_manage','Gerenciar operadoras']]],
        ['Relatórios e IA',[['reports_view','Visualizar relatórios'],['reports_export','Exportar relatórios'],['ai_view','Acessar análises de IA'],['ai_generate','Gerar novas análises']]],
        ['Chamadas',[['calls_listen','Ouvir gravações'],['calls_transfer','Transferir chamadas'],['calls_download','Baixar gravações']]],
        ['Configurações',[['settings_view','Visualizar configurações'],['settings_edit','Alterar configurações'],['permissions_manage','Administrar permissões']]]
      ];
      body.innerHTML=`<div class="group-permission-editor">
        <div class="group-summary-box"><label>Nome do grupo</label><input value="${groupName==='Novo grupo'?'':groupName}" placeholder="Digite o nome do grupo"></div>
        <div class="group-summary-box"><label>Descrição</label><textarea placeholder="Descreva a finalidade deste grupo">${groupName==='Atendimento'?'Operação de atendimento ao cliente.':groupName==='Comercial'?'Equipe de vendas e retenção.':groupName==='Qualidade'?'Monitoria, auditoria e relatórios.':''}</textarea></div>
        ${modules.map((m,i)=>`<section class="group-permission-section"><button type="button" data-group-toggle><span>${m[0]}</span><span>⌃</span></button><div class="group-permission-list">${m[1].map(p=>`<label><span>${p[1]}</span><input type="checkbox" data-group-permission="${p[0]}" ${active.has(p[0])?'checked':''}></label>`).join('')}</div></section>`).join('')}
        <div class="group-permission-footer"><span>Permissões autorizadas</span><strong data-group-count>${active.size}</strong></div>
      </div>`;
      drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false');
      const count=body.querySelector('[data-group-count]');
      const update=()=>count.textContent=body.querySelectorAll('[data-group-permission]:checked').length;
      body.querySelectorAll('[data-group-permission]').forEach(c=>c.addEventListener('change',update));
      body.querySelectorAll('[data-group-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const list=btn.nextElementSibling;const hidden=list.style.display==='none';list.style.display=hidden?'grid':'none';btn.lastElementChild.textContent=hidden?'⌃':'⌄';}));
      update(); return;
    }
    body.innerHTML='<div class="drawer-form">'+f[2].map((x,i)=>'<label class="'+(i===f[2].length-1&&f[2].length%2?'wide':'')+'"><span>'+x+'</span><div>'+(['Descrição','Permissões','Resumo'].some(t=>x.includes(t))?'Digite as informações':'Selecione ou preencha')+'</div></label>').join('')+'<div class="drawer-note">Os dados exibidos são demonstrativos e anonimizados.</div></div>';
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false');
  }
  root.querySelectorAll('[data-open-panel]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openDrawer(b.dataset.openPanel,b);if(wrap)wrap.classList.remove('open');}));
  root.querySelectorAll('[data-route-create]').forEach(b=>b.addEventListener('click',()=>openDrawer(b.dataset.routeCreate)));
  root.querySelectorAll('[data-close-drawer]').forEach(b=>b.addEventListener('click',()=>{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true')}));

  const editor=root.querySelector('[data-permission-editor]');
  if(editor){
    const profileData={
      admin:{title:'Administrador',description:'Acesso completo às configurações e à operação.',users:'12 usuários',scope:'Todos os grupos e filas',units:'Todas as unidades',ratio:1},
      supervisor:{title:'Supervisor',description:'Gerencia equipes, acompanha indicadores e revisa interações.',users:'18 usuários',scope:'Equipes vinculadas',units:'Unidade principal',ratio:.72},
      agent:{title:'Agente',description:'Acesso restrito à própria operação e às filas atribuídas.',users:'64 usuários',scope:'Próprio usuário e filas',units:'Unidade de vínculo',ratio:.28},
      quality:{title:'Qualidade',description:'Audita conversas, critérios de qualidade e planos de melhoria.',users:'8 usuários',scope:'Filas selecionadas',units:'Todas as unidades',ratio:.58},
      analyst:{title:'Analista de dados',description:'Consulta indicadores, relatórios, exportações e análises de IA.',users:'4 usuários',scope:'Todos os grupos e filas',units:'Todas as unidades',ratio:.46}
    };
    const checks=[...editor.querySelectorAll('.check')];
    const titleEl=editor.querySelector('[data-profile-title]'),descEl=editor.querySelector('[data-profile-description]'),usersEl=editor.querySelector('[data-profile-users]'),countEl=editor.querySelector('[data-active-count]'),scopeEl=editor.querySelector('[data-scope-control]'),unitEl=editor.querySelector('[data-unit-control]'),bar=editor.querySelector('[data-change-bar]'),changeCount=editor.querySelector('[data-change-count]');
    let changes=0;
    const updateCount=()=>{const active=checks.filter(c=>c.classList.contains('on')).length;countEl.textContent=active+' de '+checks.length;};
    const markChanged=()=>{changes++;changeCount.textContent=changes;bar.hidden=false;updateCount();};
    const setCheck=(c,on)=>{c.classList.toggle('on',on);c.classList.toggle('off',!on);c.textContent=on?'✓':'—';c.setAttribute('aria-pressed',on?'true':'false');};
    checks.forEach(c=>c.addEventListener('click',()=>{setCheck(c,!c.classList.contains('on'));markChanged();}));
    editor.querySelectorAll('.pm-select-all').forEach(btn=>btn.addEventListener('click',()=>{const group=btn.closest('[data-permission-group]');const groupChecks=[...group.querySelectorAll('.check')];const allOn=groupChecks.every(c=>c.classList.contains('on'));groupChecks.forEach(c=>setCheck(c,!allOn));markChanged();btn.textContent=allOn?'Marcar grupo':'Desmarcar grupo';}));
    editor.querySelectorAll('[data-profile]').forEach(btn=>btn.addEventListener('click',()=>{editor.querySelectorAll('[data-profile]').forEach(x=>x.classList.toggle('active',x===btn));const d=profileData[btn.dataset.profile];titleEl.textContent=d.title;descEl.textContent=d.description;usersEl.textContent=d.users;scopeEl.innerHTML=d.scope+' <b>⌄</b>';unitEl.innerHTML=d.units+' <b>⌄</b>';checks.forEach((c,i)=>setCheck(c,(i/checks.length)<d.ratio || ((i*7+btn.dataset.profile.length)%11===0)));changes=0;bar.hidden=true;updateCount();}));
    const save=()=>{changes=0;bar.hidden=true;const old=editor.querySelector('[data-save-permissions]').textContent;editor.querySelector('[data-save-permissions]').textContent='Permissões salvas ✓';setTimeout(()=>editor.querySelector('[data-save-permissions]').textContent=old,1400);};
    editor.querySelector('[data-save-permissions]').addEventListener('click',save);editor.querySelector('[data-save-inline]').addEventListener('click',save);
    const auto=editor.querySelector('[data-auto-toggle]');auto.addEventListener('click',()=>auto.querySelector('i').classList.toggle('on'));
    updateCount();
  }
})();

(function(){
 const root=document.querySelector('[data-permission-editor-v24]'); if(!root) return;
 const checks=[...root.querySelectorAll('input[type="checkbox"]')], count=root.querySelector('[data-permission-count]');
 const update=()=>count.textContent=checks.filter(x=>x.checked).length;
 checks.forEach(c=>c.addEventListener('change',update)); update();
 root.querySelectorAll('.permission-module-head').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.permission-module').classList.toggle('open')));
 root.querySelectorAll('[data-role]').forEach(btn=>btn.addEventListener('click',()=>{root.querySelectorAll('[data-role]').forEach(b=>b.classList.toggle('active',b===btn));root.querySelector('[data-role-title]').textContent=btn.dataset.role; const ratio={Administrador:1,Supervisor:.7,Agente:.3,Qualidade:.55,Analista:.45}[btn.dataset.role]||.5;checks.forEach((c,i)=>c.checked=(i/checks.length)<ratio||((i+btn.dataset.role.length)%7===0));update();}));
 const sw=root.querySelector('[data-switch]'); sw&&sw.addEventListener('click',()=>sw.classList.toggle('on'));
 const save=root.querySelector('[data-permission-save]'); save&&save.addEventListener('click',()=>{const old=save.textContent;save.textContent='Salvo ✓';setTimeout(()=>save.textContent=old,1200)});
})();

/* V27 — fallback único para ações de grupos, sem sobrescrever o drawer detalhado */
(function(){
  const root=document.querySelector('[data-voice-demo]');
  if(!root) return;
  // O controlador principal acima já cuida de Novo grupo e Gerenciar permissões.
  // Este fallback apenas garante que cliques em elementos internos do botão alcancem o botão correto.
  root.querySelectorAll('[data-open-panel]').forEach(function(btn){
    btn.style.pointerEvents='auto';
    btn.disabled=false;
  });
})();

(function(){
  const root = document.querySelector('#page-case-troca-tecnologia .address-demo');
  if (!root) return;

  const cepInput = root.querySelector('#address-cep');
  const street = root.querySelector('#address-street');
  const neighborhood = root.querySelector('#address-neighborhood');
  const city = root.querySelector('#address-city');
  const state = root.querySelector('#address-state');
  const number = root.querySelector('#address-number');
  const complement = root.querySelector('#address-complement');
  const button = root.querySelector('#search-cep');
  const feedback = root.querySelector('#cep-feedback');
  const map = root.querySelector('#address-map');
  const mapStatus = root.querySelector('#map-success');

  function formatCep(value){
    const digits = value.replace(/\D/g,'').slice(0,8);
    return digits.length > 5 ? digits.slice(0,5) + '-' + digits.slice(5) : digits;
  }

  function buildAddress(){
    return [
      street.value.trim(),
      number.value.trim(),
      neighborhood.value.trim(),
      city.value.trim(),
      state.value.trim(),
      cepInput.value.trim(),
      'Brasil'
    ].filter(Boolean).join(', ');
  }

  function updateMap(){
    const address = buildAddress();
    if (!address) return;
    map.src = 'https://www.google.com/maps?q=' + encodeURIComponent(address) + '&z=16&output=embed';
    map.title = 'Mapa de ' + address;
    mapStatus.textContent = '✓ Localização atualizada: ' + address;
    mapStatus.className = 'map-success';
  }

  async function searchCep(){
    const cep = cepInput.value.replace(/\D/g,'');
    feedback.className = '';
    if (cep.length !== 8){
      feedback.textContent = 'Digite um CEP válido com 8 números.';
      feedback.className = 'error';
      return;
    }

    button.disabled = true;
    button.textContent = 'Buscando...';
    feedback.textContent = 'Consultando endereço...';
    mapStatus.textContent = 'Atualizando localização no mapa...';
    mapStatus.className = 'map-success loading';

    try{
      const response = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
      if (!response.ok) throw new Error('Falha na consulta');
      const data = await response.json();
      if (data.erro) throw new Error('CEP não encontrado');

      street.value = data.logradouro || street.value;
      neighborhood.value = data.bairro || neighborhood.value;
      city.value = data.localidade || city.value;
      state.value = data.uf || state.value;
      complement.value = data.complemento || complement.value;

      feedback.textContent = 'Endereço preenchido automaticamente.';
      feedback.className = 'success';
      updateMap();
    }catch(error){
      feedback.textContent = 'Não foi possível localizar esse CEP.';
      feedback.className = 'error';
      mapStatus.textContent = 'Não foi possível atualizar o mapa pelo CEP.';
      mapStatus.className = 'map-success error';
    }finally{
      button.disabled = false;
      button.textContent = 'Buscar CEP';
    }
  }

  cepInput.addEventListener('input', function(){
    this.value = formatCep(this.value);
  });
  cepInput.addEventListener('keydown', function(event){
    if (event.key === 'Enter'){
      event.preventDefault();
      searchCep();
    }
  });
  button.addEventListener('click', searchCep);

  [street, neighborhood, city, state, number, complement].forEach(function(field){
    field.addEventListener('change', updateMap);
  });
})();

(function(){
  const root = document.querySelector('#page-case-troca-tecnologia .address-demo');
  if (!root) return;
  const addressCard = root.querySelector('.address-card');
  const editAddressButton = root.querySelector('#edit-address');
  const checkButton = root.querySelector('#check-availability');
  const feedback = root.querySelector('#availability-feedback');
  const technologyOptions = Array.from(root.querySelectorAll('.technology-option'));

  function addressValue(){
    return ['address-street','address-number','address-neighborhood','address-city','address-state','address-cep']
      .map(id => root.querySelector('#'+id)?.value.trim() || '').filter(Boolean).join(', ');
  }

  function focusAddress(){
    addressCard.scrollIntoView({behavior:'smooth',block:'center'});
    addressCard.classList.add('address-highlight');
    setTimeout(()=>addressCard.classList.remove('address-highlight'),1000);
    setTimeout(()=>root.querySelector('#address-cep')?.focus(),450);
  }

  function setAvailability(keys){
    technologyOptions.forEach(card=>{
      const available=keys.includes(card.dataset.tech);
      card.classList.toggle('available',available);
      card.classList.toggle('unavailable',!available);
      card.classList.remove('checking');
      card.querySelector('.technology-status').textContent=available?'Disponível':'Indisponível';
    });
  }

  async function checkAvailability(){
    const cep=root.querySelector('#address-cep')?.value.replace(/\D/g,'')||'';
    const street=root.querySelector('#address-street')?.value.trim()||'';
    const city=root.querySelector('#address-city')?.value.trim()||'';
    feedback.className='availability-feedback';

    if(cep.length!==8||!street||!city){
      feedback.textContent='Preencha o CEP e o endereço antes de verificar.';
      feedback.classList.add('error');
      focusAddress();
      return;
    }

    checkButton.disabled=true;
    checkButton.textContent='Verificando...';
    feedback.textContent='Consultando cobertura para '+addressValue()+'...';
    technologyOptions.forEach(card=>card.classList.add('checking'));
    await new Promise(resolve=>setTimeout(resolve,850));

    const lastDigit=Number(cep.slice(-1));
    const result=lastDigit%3===0?['fibra','fwa5g']:lastDigit%2===0?['fibra','fwa5g','fwaoutdoor']:['fwa5g','fwaoutdoor'];
    setAvailability(result);
    feedback.textContent='Disponibilidade atualizada para '+addressValue()+'.';
    feedback.classList.add('success');
    checkButton.disabled=false;
    checkButton.textContent='Verificar novamente';
  }

  editAddressButton?.addEventListener('click',focusAddress);
  checkButton?.addEventListener('click',checkAvailability);
})();

(function(){
  const root = document.querySelector('#page-case-troca-tecnologia .precontract-demo');
  if (!root) return;
  const segButtons = Array.from(root.querySelectorAll('.seg-btn'));
  const quoteTech = root.querySelector('#quote-tech');
  const quotePlan = root.querySelector('#quote-plan');
  const quotePrice = root.querySelector('#quote-price');
  const quoteFeedback = root.querySelector('#quote-feedback');
  const applyButton = root.querySelector('#apply-tech-switch');
  const cartOldPrice = root.querySelector('#cart-old-price');
  const cartNewTech = root.querySelector('#cart-new-tech');
  const cartNewPrice = root.querySelector('#cart-new-price');
  const cartTotalPrice = root.querySelector('#cart-total-price');
  const cartBadge = root.querySelector('#cart-badge');
  const techOptions = Array.from(root.querySelectorAll('#precontract-technology-results .technology-option'));

  let saleType = 'combo';
  let selected = techOptions.find(function(opt){ return opt.classList.contains('selected'); }) || techOptions[0];

  const COMBO_PRICE = '129,90';
  const SINGLE_BASE_PRICE = '109,90';

  function resetQuote(){
    quoteTech.textContent = 'Fibra Óptica';
    quotePlan.textContent = saleType === 'combo'
      ? 'Combo Banda Larga + Móvel Controle 20GB'
      : 'Plano Banda Larga Avulso';
    quotePrice.textContent = 'R$ ' + (saleType === 'combo' ? COMBO_PRICE : SINGLE_BASE_PRICE);
    quoteFeedback.textContent = '';
  }

  function updateCart(){
    if (!selected) return;
    const oldPrice = saleType === 'combo' ? COMBO_PRICE : SINGLE_BASE_PRICE;
    const newPrice = saleType === 'combo' ? COMBO_PRICE : selected.dataset.price;
    cartOldPrice.textContent = 'R$ ' + oldPrice;
    cartNewTech.textContent = selected.querySelector('strong').textContent;
    cartNewPrice.textContent = 'R$ ' + newPrice;
    cartTotalPrice.textContent = 'R$ ' + newPrice;
    cartBadge.textContent = saleType === 'combo'
      ? '⇄ Oferta espelho — valor do combo mantido'
      : 'Valor recalculado pela tecnologia selecionada';
  }

  segButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      if (btn.dataset.saleType === saleType) return;
      segButtons.forEach(function(b){
        b.classList.remove('active');
        b.setAttribute('aria-selected','false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      saleType = btn.dataset.saleType;
      updateCart();
      resetQuote();
    });
  });

  techOptions.forEach(function(opt){
    opt.addEventListener('click', function(){
      techOptions.forEach(function(o){
        o.classList.remove('selected');
        o.querySelector('.technology-status').textContent = 'Disponível';
      });
      opt.classList.add('selected');
      opt.querySelector('.technology-status').textContent = 'Selecionada';
      selected = opt;
      updateCart();
    });
  });

  applyButton?.addEventListener('click', function(){
    if (!selected) return;
    const label = selected.querySelector('strong').textContent;
    const price = selected.dataset.price;
    quoteTech.textContent = label;
    if (saleType === 'combo') {
      quotePrice.textContent = 'R$ ' + COMBO_PRICE;
      quoteFeedback.textContent = 'Oferta espelho aplicada: valor do combo mantido em R$ ' + COMBO_PRICE + '.';
    } else {
      quotePrice.textContent = 'R$ ' + price;
      quoteFeedback.textContent = 'Novo valor aplicado: R$ ' + price + ' conforme a tecnologia selecionada.';
    }
  });

  updateCart();
})();

document.querySelector('.nav .brand')?.setAttribute('aria-label','Vitória Araújo — início');

(function(){function init(){var g=document.querySelector('#page-case-autoagendamento .auto-flow-grid');if(!g||g.dataset.ready)return;g.dataset.ready=1;g.classList.add('is-interactive');var c=[].slice.call(g.querySelectorAll('.auto-flow-card')),n=0,l=['Início','Agenda','Contato','Confirmação','Acompanhar','Gerenciar'];if(!c.length)return;var s=document.createElement('div');s.className='auto-prototype-shell';s.innerHTML='<div class="auto-prototype-top"><span class="auto-prototype-count" aria-live="polite"></span><div class="auto-prototype-progress"><span></span></div></div><div class="auto-stepper" aria-label="Etapas do protótipo"></div>';g.parentNode.insertBefore(s,g);s.appendChild(g);var st=s.querySelector('.auto-stepper');l.forEach(function(x,i){var b=document.createElement('button');b.type='button';b.textContent=(i+1)+'. '+x;b.onclick=function(){show(i)};st.appendChild(b)});var a=document.createElement('div');a.className='auto-prototype-actions';a.innerHTML='<button type="button" class="auto-prototype-prev">← Anterior</button><button type="button" class="auto-prototype-next">Próxima →</button>';s.appendChild(a);var h=document.createElement('p');h.className='auto-flow-hint';h.textContent='Protótipo interativo — use os botões da tela ou a navegação abaixo.';s.appendChild(h);
function show(i){n=Math.max(0,Math.min(c.length-1,i));c.forEach(function(x,j){x.classList.toggle('is-active',j===n);x.setAttribute('aria-hidden',j===n?'false':'true')});[].slice.call(st.children).forEach(function(x,j){x.classList.toggle('is-active',j===n);x.setAttribute('aria-current',j===n?'step':'false')});s.querySelector('.auto-prototype-count').textContent='Tela '+(n+1)+' de '+c.length;s.querySelector('.auto-prototype-progress span').style.width=((n+1)/c.length*100)+'%';a.firstChild.disabled=n===0;a.lastChild.textContent=n===c.length-1?'Recomeçar ↺':'Próxima →'}a.firstChild.onclick=function(){show(n-1)};a.lastChild.onclick=function(){show(n===c.length-1?0:n+1)};
c.forEach(function(card,i){var back=card.querySelector('.ap-bar b');if(back)back.onclick=function(){show(i-1)};card.querySelectorAll('.ap-btn').forEach(function(b){b.setAttribute('role','button');b.tabIndex=0;function go(){var t=b.textContent.toLowerCase();if(t.indexOf('voltar ao início')>-1)show(0);else if(t.indexOf('voltar ao acompanhamento')>-1)show(4);else if(i<c.length-1)show(i+1)}b.onclick=go;b.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}})});
if(c[1]){c[1].querySelectorAll('.ap-date').forEach(function(x){x.onclick=function(){c[1].querySelectorAll('.ap-date').forEach(function(y){y.classList.remove('active','is-selected')});x.classList.add('active','is-selected')}});c[1].querySelectorAll('.ap-period').forEach(function(x){x.onclick=function(){c[1].querySelectorAll('.ap-period').forEach(function(y){y.classList.remove('active','is-selected')});x.classList.add('active','is-selected')}})}var sw=c[2]&&c[2].querySelector('.ap-switch');if(sw)sw.onclick=function(){sw.querySelector('.ap-toggle').classList.toggle('is-off')};if(c[5])c[5].querySelectorAll('.ap-menu-item').forEach(function(x,i){x.onclick=function(){if(i===0)show(1);else if(i===2)show(0)}});show(0)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();

/* Acessibilidade de teclado para os modais (css-drawer): Enter/Espaço ativam os gatilhos em <label>, ESC fecha, foco fica preso dentro do modal aberto. */
(function(){
  var toggles = Array.prototype.slice.call(document.querySelectorAll('.css-drawer-toggle'));
  if (!toggles.length) return;

  function drawerFor(cb){ return document.getElementById('css-' + cb.id); }
  function focusablesIn(el){
    return Array.prototype.slice.call(el.querySelectorAll('a[href],button,input,select,textarea,label[tabindex]')).filter(function(n){ return n.offsetParent !== null; });
  }
  function openToggle(){ return toggles.filter(function(cb){ return cb.checked; })[0]; }

  document.addEventListener('keydown', function(e){
    var target = e.target;
    if ((e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') && target && target.tagName === 'LABEL' && target.hasAttribute('tabindex') && target.hasAttribute('for')) {
      e.preventDefault();
      target.click();
    }
  });

  toggles.forEach(function(cb){
    cb.addEventListener('change', function(){
      if (!cb.checked) return;
      var drawer = drawerFor(cb);
      if (!drawer) return;
      var list = focusablesIn(drawer);
      if (list.length) list[0].focus();
    });
  });

  document.addEventListener('keydown', function(e){
    var openCb = openToggle();
    if (!openCb) return;
    if (e.key === 'Escape') {
      openCb.checked = false;
      return;
    }
    if (e.key === 'Tab') {
      var drawer = drawerFor(openCb);
      if (!drawer) return;
      var list = focusablesIn(drawer);
      if (!list.length) return;
      var first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });
})();

/* Rastreamento de eventos de conversão (Ver case, Baixar CV, LinkedIn).
   Agnóstico de ferramenta: dispara em qualquer provedor já carregado na página
   (GA4 via window.gtag, Plausible via window.plausible) e não faz nada se
   nenhum estiver presente, para não quebrar enquanto nenhuma ferramenta
   estiver conectada. */
(function(){
  function track(name, params){
    try{
      if(typeof window.gtag==='function') window.gtag('event', name, params||{});
      if(typeof window.plausible==='function') window.plausible(name, params?{props:params}:undefined);
    }catch(e){}
  }
  document.addEventListener('click', function(e){
    const el = e.target.closest('[data-track]');
    if(!el) return;
    track(el.getAttribute('data-track'), {href: el.getAttribute('href')||''});
  }, true);
})();

/* Navegação sticky dos cases: destaca a seção atual durante o scroll */
(function(){
  if(typeof IntersectionObserver==='undefined') return;
  var navs = document.querySelectorAll('.case-local-nav-inner');
  navs.forEach(function(nav){
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#page-case-"]'));
    if(!links.length) return;
    var map = new Map();
    links.forEach(function(a){
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if(sec) map.set(sec, a);
    });
    if(!map.size) return;
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var link = map.get(entry.target);
        if(!link || !entry.isIntersecting) return;
        links.forEach(function(l){ l.classList.remove('active'); });
        link.classList.add('active');
      });
    }, {rootMargin:'-15% 0px -65% 0px', threshold:0});
    map.forEach(function(link, sec){ observer.observe(sec); });
  });
})();
(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = Array.prototype.slice.call(document.querySelectorAll('.section-head'));
  if(!els.length) return;
  els.forEach(function(el){ el.classList.add('reveal-init'); });
  function inView(el){
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  els.forEach(function(el){ if(inView(el)) el.classList.add('is-visible'); });
  var pending = els.filter(function(el){ return !el.classList.contains('is-visible'); });
  if(!pending.length) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:0.1});
  pending.forEach(function(el){ io.observe(el); });
})();