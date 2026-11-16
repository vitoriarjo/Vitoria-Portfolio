/* Sprint 08 — Curadoria única de dez cases; filtro e títulos sincronizados. */
(function () {
  "use strict";
  const root = document.getElementById("cases");
  if (!root) return;

  const buttons = [...root.querySelectorAll("[data-case-filter]")];
  const cards = [...root.querySelectorAll(".cases-v3 [data-case-focus], .compact-case-grid [data-case-focus]")];
  const featured = root.querySelector(".cases-v3");
  const extra = root.querySelector(".additional-cases");
  const status = root.querySelector("#case-curation-status");
  const sectionHeading = root.querySelector("#cases-section-heading");
  const sectionDescription = root.querySelector("#cases-section-description");
  const otherHeading = root.querySelector("#other-cases-heading");
  const otherDescription = root.querySelector("#other-cases-description");

  if (!buttons.length || !cards.length) return;

  const labels = {
    todos: "Todos",
    estrategia: "Estratégia e decisões",
    growth: "Growth e impacto",
    ops: "Product Operations"
  };
  const original = {
    title: "Projetos em destaque",
    description: "Três experiências-chave em estratégia, entrega e SaaS. Explore todos os dez projetos usando os filtros abaixo.",
    otherTitle: "Outros projetos",
    otherDescription: "Mais sete cases e recortes sobre estratégia, execução e Product Operations."
  };

  function visibleCount(container) {
    return container ? [...container.querySelectorAll("[data-case-focus]")].filter(card => !card.hidden).length : 0;
  }

  function update(value) {
    const filter = Object.prototype.hasOwnProperty.call(labels, value) ? value : "todos";
    let count = 0;

    for (const card of cards) {
      const match = filter === "todos" || card.dataset.caseFocus.split(/\s+/).includes(filter);
      card.hidden = !match;
      if (match) count++;
    }

    for (const button of buttons) {
      const active = button.dataset.caseFilter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }

    const featuredCount = visibleCount(featured);
    const extraCount = visibleCount(extra);
    if (featured) {
      featured.hidden = featuredCount === 0;
      featured.setAttribute("aria-label", filter === "todos"
        ? "Três projetos em destaque"
        : featuredCount + " projetos em destaque relacionados a " + labels[filter]);
    }
    if (extra) extra.hidden = extraCount === 0;

    if (filter === "todos") {
      if (sectionHeading) sectionHeading.textContent = original.title;
      if (sectionDescription) sectionDescription.textContent = original.description;
      if (otherHeading) otherHeading.textContent = original.otherTitle;
      if (otherDescription) otherDescription.textContent = original.otherDescription;
      if (status) status.textContent = "Exibindo todos os " + count + " cases e recortes.";
    } else {
      if (sectionHeading) sectionHeading.textContent = "Cases: " + labels[filter];
      if (sectionDescription) sectionDescription.textContent =
        "Projetos relacionados à competência selecionada. Para ver o portfólio completo, escolha Todos.";
      if (otherHeading) otherHeading.textContent = featuredCount ? "Outros projetos relacionados" : "Projetos relacionados";
      if (otherDescription) otherDescription.textContent =
        "Mais " + extraCount + " " + (extraCount === 1 ? "projeto" : "projetos") + " nesta competência.";
      if (status) status.textContent = count
        ? "Exibindo " + count + " " + (count === 1 ? "case" : "cases") + " relacionados a " + labels[filter] + "."
        : "Nenhum case encontrado para " + labels[filter] + ". Selecione outro filtro.";
    }
  }

  buttons.forEach(button => button.addEventListener("click", () => update(button.dataset.caseFilter)));
  update("todos");
})();