# Sprint 08 — Navegação, filtros, storytelling e currículo

## Objetivo
Aprimorar a experiência de navegação do portfólio para recrutadores de **Product Manager Pleno** e **Product Owner Sênior**, sem redesenhar a identidade, remover projetos ou alterar dados dos cases.

## Ordem oficial dos dez cases

1. Autoagendamento
2. Troca de Tecnologia
3. Voice Cloud
4. Novo BrisaCliente
5. Diagnóstico de Conversão
6. Efetivação e Onboarding
7. Automação de Capacidade
8. Release Governance
9. Portfolio as a Product
10. Outis

### Navegação anterior / próximo
- Corrigidas as setas de navegação nos **oito cases internos** e nas duas páginas independentes (Novo BrisaCliente e Outis).
- O primeiro case não apresenta seta "anterior"; o último não apresenta seta "próximo".
- Os destinos entre home e páginas independentes usam caminhos relativos apropriados.
- Os links recebem `data-track="ver-case-..."` para observabilidade do clique no case acessado.
- A sequência é verificada pelo teste `scripts/smoke-portfolio.mjs`, evitando reintroduzir a ordem antiga.

## Filtros
- Os quatro filtros permanecem: Todos, Estratégia e decisões, Growth e impacto e Product Operations.
- O título e a descrição da seção acompanham a categoria selecionada, em vez de sempre anunciar os três destaques.
- A seção de projetos complementares também tem título e quantidade contextualizados.
- Blocos inteiros são ocultados apenas quando não contêm nenhum card compatível.
- A mensagem com `role="status"` e `aria-live="polite"` informa a contagem para acessibilidade.
- Atualizado o cache-busting de `portfolio-evolucao.js` para `v=20261116-sprint08`.

## Storytelling da hero
- Título: **Da estratégia ao produto em produção: decisões que simplificam jornadas e geram valor.**
- Resumo: trajetória como PO Sênior em Telecom/SaaS e atuação atual como PM em Governança, Automação e IA; conexão de discovery, priorização, tecnologia e delivery.
- Objetivo visível: **oportunidades como Product Manager Pleno ou Product Owner Sênior**.
- Não foram inseridas métricas novas nem resultados de iniciativas de Governança/IA sem evidências.

## Currículo
- Dois links da home validados para `CV_Vitoria_Araujo_PM_Pleno_PO_Senior_2026.pdf`.
- Ambos têm atributo `download` consistente com o nome e rótulo acessível explicando as vagas-alvo.
- O arquivo existe no GitHub, e o alias legado `cv-vitoria-araujo.pdf` aponta ao mesmo conteúdo.
- **O PDF não foi alterado** nesta sprint: a versão disponível no site permanece a versão com diagramação recomposta de uma revisão anterior. Substituição pela diagramação original exige upload binário específico.

## Verificações
- Conferência estática do HTML: dez cards sem repetição, navegação dos dez cases na ordem correta, destinos relativos e âncoras válidos, dois links do currículo e IDs únicos.
- Execução simulada do JavaScript dos filtros com DOM de teste: Todos = 10; Estratégia = 5; Growth = 5; Product Operations = 5; cabeçalhos e contagens retornam ao estado padrão ao escolher Todos.
- Sintaxe do script dos filtros analisada no ambiente JavaScript.
- `scripts/smoke-portfolio.mjs` atualizado para testar toda a sequência, filtros, hero e links do currículo.

### Pendente para revisão visual
- Rodar `node scripts/smoke-portfolio.mjs` em um checkout do repositório.
- Confirmar no navegador desktop/mobile o foco por teclado, Voltar/Avançar e carregamento das duas páginas independentes.
- Conferir filtragem e aria-live em leitor de tela.
- Abrir o PDF publicado e verificar visualmente a diagramação.

**Este PR permanece em rascunho. Não publicar sem aprovação.**
