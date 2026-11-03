/* Curadoria progressiva de cases: não altera o roteador principal. */
(function(){
  "use strict";
  const root=document.getElementById("cases");
  if(!root)return;
  const buttons=[...root.querySelectorAll("[data-case-filter]")];
  const cases=[...root.querySelectorAll("[data-case-focus]")];
  const status=root.querySelector("#case-curation-status");
  const extra=root.querySelector(".additional-cases");
  const mainCards=root.querySelector(".cases-v3");
  if(!buttons.length||!cases.length)return;
  const labels={todos:"todos os cases",estrategia:"Estratégia e decisões",growth:"Growth e impacto",ops:"Product Operations"};
  function update(value){
    let count=0;
    for(const card of cases){
      const match=value==="todos"||card.dataset.caseFocus.split(/\s+/).includes(value);
      card.hidden=!match;
      if(match)count++;
    }
    for(const button of buttons){
      const active=button.dataset.caseFilter===value;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",String(active));
    }
    if(extra){
      extra.hidden=![...extra.querySelectorAll("[data-case-focus]")].some(x=>!x.hidden);
    }
    if(status)status.textContent=value==="todos"
      ? "Exibindo todos os "+count+" cases e recortes."
      : "Exibindo "+count+" cases relacionados a "+labels[value]+".";
  }
  buttons.forEach(button=>button.addEventListener("click",()=>update(button.dataset.caseFilter)));
  update("todos");
})();