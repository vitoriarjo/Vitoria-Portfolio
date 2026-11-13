# Ajuste da vitrine de cases — sem repetição

## Problema identificado
A home exibia 3 links extras em “Comece por aqui”, mais 3 cards principais e 7 cards compactos. Isso produzia **13 aparições para 10 cases**, duplicando Autoagendamento, Troca de Tecnologia e Voice Cloud. Os filtros atuavam somente sobre os dez cards originais.

## Alteração
- Removido o bloco extra de três links editoriais.
- Mantidos **3 cards principais, uma única vez cada:** Autoagendamento, Troca de Tecnologia e Voice Cloud.
- Mantidos **7 cards compactos:** Novo BrisaCliente, Diagnóstico de Conversão, Efetivação e Onboarding, Automação de Capacidade, Release Governance, Portfolio as a Product e Outis.
- Preservada a navegação de todos os dez cases e os eventos `data-track="ver-case-..."` existentes, evitando comprometer a série histórica do PostHog.
- Troca de Tecnologia passa a ser o case visual **02** e Novo BrisaCliente o **04**, com rótulos coerentes na home e nas páginas de cada case; slugs e links antigos permanecem inalterados.
- Os quatro filtros mantêm seus eventos e aplicam-se aos dez cards; blocos ficam ocultos quando não têm resultados correspondentes.
- Nova capa visual para Troca de Tecnologia baseada em Fibra ↔ FWA, mantendo a identidade vinho/rosa, sem imagens externas.
- Ajustes concentrados em `index.html`, `portfolio-evolucao.js`, `portfolio-cases-v2.css`, `case-novo-brisacliente.html` e `scripts/smoke-portfolio.mjs`.

## Conferência estática
- 10 cards únicos no total; 3 principais + 7 complementares.
- Todos os links internos por hash apontam para destinos existentes.
- IDs da home sem duplicação.
- Navegação e arquivos de compartilhamento da Sprint 06 preservados.
- Foto, currículo, história profissional, conteúdo dos cases, analytics e identidade visual mantidos.

## Ainda precisa ser testado em navegador
- Layout desktop e mobile; cards e capa Fibra ↔ FWA.
- Filtros (Todos, Estratégia, Growth e Product Operations), inclusive categorias sem card principal.
- Voltar/Avançar, tabulação do teclado, leitura por tecnologia assistiva e links das duas páginas independentes.
- Execução de `node scripts/smoke-portfolio.mjs` e testes visuais antes da publicação.

**Nota:** o PR é para revisão, não foi publicado automaticamente.
