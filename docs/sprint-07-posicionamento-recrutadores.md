# Sprint 07 — posicionamento profissional e jornada para recrutadores

## Objetivo
Facilitar que recrutadores de **Product Owner, Product Manager e Product Operations** compreendam rapidamente o posicionamento profissional, encontrem três evidências complementares de atuação e, se desejarem, explorem os dez cases completos.

## Atualização da trajetória
- Cargo apresentado: **Senior Product Owner**, sem afirmar exercício formal do cargo de Product Manager.
- Atuação em Governança de TI e Automações: **iniciada em 11/11/2026**, sucedendo a jornada de Customer Journey & Growth.
- A experiência anterior permanece preservada; a seção atual descreve **escopo e responsabilidades**, não resultados atribuídos a automações ainda não comprovados.
- Hero, metadescrição e descrição Open Graph foram atualizadas para refletir a atuação atual, sem exageros de impacto.
- A classificação da transição como "futura" foi retirada do conteúdo.

## Três cases em destaque
Os destaques são links editoriais adicionais; **não removem ou duplicam os dez cards originais**.

1. **Autoagendamento:** jornada do cliente, rollout progressivo e indicadores observados.
2. **Troca de Tecnologia:** decisões estratégicas, alternativas Fibra/FWA, distinção entre projeção e resultado.
3. **Voice Cloud:** SaaS B2B, definição de MVP e decisões de escopo.

A nova seção aparece antes da curadoria por competências e permite continuar para:
- Link direto do case, preservando o roteador por hash existente.
- Todos os cases e filtros, com âncora `#case-curation-controls`.
- Download do currículo, preservando o arquivo e os eventos existentes.

## Acessibilidade e visual
- O módulo usa os mesmos tokens vinho e rosa, a fonte atual e o estilo editorial da home.
- O layout muda de três colunas para uma no mobile.
- Links de destaque têm foco visível e respeitam preferência por movimento reduzido.
- O texto informa explicitamente que os dez cases continuam disponíveis.

## Preservação e limites
- Todos os dez cards e os oito cases internos/duas páginas independentes permanecem.
- A marca, a borboleta, a foto, o Outis, os conteúdos dos cases e os dados existentes não foram alterados.
- **Sprint 06 (PR #119) continua independente e ainda não publicada.** A Sprint 07 é baseada exclusivamente em `main` e não inclui seus recursos de SEO/compartilhamento.
- A avaliação em navegador e as medições de acessibilidade/performance ainda precisam ser feitas.
- O teste `node scripts/smoke-portfolio.mjs` foi atualizado para a nova data e o novo módulo de destaque.

## Roteiro de verificação antes de publicar
1. Abrir a home em desktop e mobile e verificar hero e imagem.
2. Navegar pelos três destaques, Voltar e Avançar do navegador.
3. Usar "Ver todos os cases e filtros" e testar as quatro categorias.
4. Abrir os dez cards, o Novo BrisaCliente e o Outis.
5. Verificar se o currículo mantém o download e o LinkedIn continua acessível pela navegação.
6. Testar foco de teclado, zoom do navegador e preferência por movimento reduzido.
7. Executar o smoke test e comparar a aparência antes/depois no browser.
