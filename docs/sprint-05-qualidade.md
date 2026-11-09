# Sprint 05 — consistência, navegação e manutenção

## Objetivo
Fortalecer a qualidade do portfólio sem redesenhar a identidade, inventar métricas ou afetar os dez cases.

## Ajustes realizados

### Posicionamento e linha do tempo
- O rodapé deixa de apresentar **Product Manager** como cargo formal atual; passa a indicar **Senior Product Owner · Estratégia de Produto · Telecom & SaaS**.
- Os títulos montados dinamicamente pelo roteador usam o mesmo posicionamento do HTML inicial, evitando mudanças de título inconsistentes entre home e cases.
- A transição de Customer Journey para Governança de TI e Automações continua identificada como **prevista para 11/11/2026**, sem afirmar início antecipado.
- As experiências anteriores e seus indicadores são preservados.

### Evidências
- O case de Efetivação recebeu `data-evidence="mixed"`: possui tanto entrega implementada (17 → 3 telas) quanto indicador operacional observado (pendências de assinatura). Uma variação acompanhada não comprova causalidade.
- Troca de Tecnologia permanece `estimated` por destacar projeções do business case; não há conversão observada atribuída ao produto nesse card.
- As demais classificações e os indicadores foram mantidos.

### Navegação e acessibilidade
- `portfolio-a11y.js` coordena foco em rotas de case, seções da home e histórico do navegador, usando o título do destino.
- Continua disponível o atalho de teclado para o conteúdo, e o menu mobile fecha com Escape ou ao clicar fora.
- O roteador respeita `prefers-reduced-motion` nas transições de âncoras.

### Organização dos estilos
- Quatro arquivos incrementais (`portfolio-sprint01.css`, `portfolio-evidencias.css`, `portfolio-sprint03.css` e `portfolio-sprint04.css`) foram reunidos em `portfolio-sprints.css`, **na mesma ordem de cascata**.
- Os arquivos originais foram preservados no GitHub para rastreabilidade; a home passa a carregar somente o bundle, reduzindo as requisições a folhas de estilo locais.
- Não foram refatorados os grandes blocos legados nesta sprint para evitar regressões visuais não testadas.

## Critérios de aceite
1. Dez links de cases preservados e sem âncoras internas inválidas.
2. Arquivos CSS referenciados existentes.
3. Scripts carregados sem erros de sintaxe.
4. Hero, rodapé e títulos dinâmicos com posicionamento profissional consistente.
5. Dados e evidências classificados de forma honesta e estável.
6. Fotografia, identidade visual, Outis e Novo BrisaCliente preservados.

## Como verificar
```bash
node scripts/smoke-portfolio.mjs
```

**Validação realizada:** inspeção estática de arquivos e referências na branch. O teste acima foi adicionado para execução local/CI, não há alegação de execução em navegador nesta entrega.

**Ainda a validar manualmente:** 360, 390, 768 e 1440 px, tabulação e navegação com teclado, menu mobile aberto/fechado, histórico Voltar/Avançar, casos com hash direto, imagens e layout, tempo de carregamento antes/depois.
