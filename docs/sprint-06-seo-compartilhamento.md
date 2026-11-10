# Sprint 06 — SEO, prévias sociais e links compartilháveis

## Objetivo

Melhorar a apresentação dos dez cases quando seus links são enviados em LinkedIn, WhatsApp, redes sociais e mensagens, sem alterar a navegação principal, os resultados, a foto ou a identidade visual do portfólio.

## Decisões de arquitetura

A home reúne oito cases internos, carregados por fragmentos de URL (por exemplo, `/#case-autoagendamento`). Um fragmento (`#...`) não é enviado ao servidor HTTP e não permite metadados HTML únicos por case em uma mesma página. Por isso, cada case interno usa uma URL própria **apenas para compartilhamento** (por exemplo, `/cases/autoagendamento/`), que entrega tags Open Graph e Twitter e redireciona quem visita para a seção completa na home.

- As oito páginas de compartilhamento têm `robots=noindex,follow` e `canonical` da home: não são conteúdo duplicado a ser indexado.
- Elas trazem título, descrição, `og:url`, imagem existente `og-image.jpg`, dimensões de imagem, idioma e metadados para Twitter.
- O redirecionamento é executado por JavaScript; sem JavaScript, o visitante vê um resumo curto e link para o case completo.
- O sitemap lista **somente** páginas canônicas indexáveis (home, Novo BrisaCliente e Outis). Não anuncia os redirecionadores como páginas de conteúdo independentes.
- Os oito cases internos têm botão **Copiar link do case**, com retorno acessível ao leitor de tela. O evento `case_link_copied` é enviado somente após cópia bem-sucedida, sem capturar o URL ou informação pessoal.
- Novo BrisaCliente e Outis já são páginas independentes com conteúdo e receberam `canonical`, `og:title`, `og:description`, `og:image`, `og:url`, e tags de Twitter; seus links diretos são indexáveis.

## Links diretos

| Case | URL compartilhável |
|---|---|
| 01 Autoagendamento | `/cases/autoagendamento/` |
| 02 Novo BrisaCliente | `/case-novo-brisacliente.html` |
| 03 Voice Cloud | `/cases/voice-cloud/` |
| 04 Troca de Tecnologia | `/cases/troca-tecnologia/` |
| 05 Diagnóstico de Conversão | `/cases/jornada-fibra/` |
| 06 Efetivação e Onboarding | `/cases/formalizacao/` |
| 07 Automação de Capacidade | `/cases/automacao-capacidade/` |
| 08 Release Governance | `/cases/release-governance/` |
| 09 Portfolio as a Product | `/cases/portfolio-product/` |
| 10 Outis | `/cases/governanca-backlog/` |

Todos os caminhos acima são relativos à raiz do GitHub Pages: `https://vitoriarjo.github.io/Vitoria-Portfolio/`.

## Limites e validação

- **Não foi criada uma página indexável integral para os oito cases internos.** Isso exigiria uma migração maior da arquitetura SPA, com testes próprios. Esta sprint melhora **compartilhamento e endereçamento direto**, sem prometer indexação individual desses oito cases.
- O resultado visual das prévias depende do cache e das políticas das plataformas de compartilhamento. Não há garantia de atualização instantânea.
- A imagem `og-image.jpg` é um recurso já existente no repositório; esta sprint não substitui a arte.
- O smoke test foi ampliado para verificar as URLs, tags, links, ausência de redirecionadores no sitemap, scripts e a preservação dos dez cases.
- Executar localmente: `node scripts/smoke-portfolio.mjs`.
- Testes pendentes em navegador: cópia para área de transferência no desktop e mobile, abertura do link sem JavaScript, prévia no WhatsApp/LinkedIn e auditoria SEO externa.

## Próximo passo opcional

Após validar as prévias, avaliar se vale transformar os oito cases internos em páginas indexáveis reais. Esse trabalho precisa preservar os cases existentes e exigir validação de rotas, estilos, analytics, performance e acessibilidade.
