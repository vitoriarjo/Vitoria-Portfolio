# Plano de medição — Sprint 04

Status: instrumentação candidata a publicação; nenhuma taxa ou resultado observado declarado.

## Auditoria
- PostHog já carregava eventos manuais, pageviews virtuais e autocapture; gravação PostHog desativada. Clarity carregava na home e Novo BrisaCliente, mas não no Outis.
- Abertura por clique não confirma carregamento; visitas diretas e links compartilhados precisam de evento de visualização.
- LinkedIn inclui links editoriais e recomendações; apenas CTA profissional explícito entra no novo evento de intenção.
- Pageviews por âncora não equivalem a visitas únicas. A versão s04 normaliza rotas e evita repetição consecutiva.
- URLs manuais não incluem query string; atributos e textos do autocapture passam a ser mascarados. Isso não garante ausência de dados pessoais nas propriedades automáticas do SDK/Clarity. Revisar consentimento, retenção, mascaramento e configurações dos painéis antes de publicar.
- Modo interno existente (?internal=1, ?internal=0) preservado; depende de armazenamento local. Não é controle de segurança.

## Dicionário
| Evento | Disparo | Propriedades principais |
|---|---|---|
| portfolio_viewed | entrada ou mudança de view (não âncora da home) | portfolio_route, portfolio_page_type |
| case_viewed | entrada efetiva em rota de case, inclusive direta | case_slug, portfolio_route |
| case_depth_reached | limite geométrico visível de 25/50/75/100%, uma vez por entrada no case | case_slug, depth_percent |
| professional_intent_clicked | CTA explícito CV/LinkedIn ou link email/WhatsApp | intent_channel, portfolio_route, portfolio_section |
| case_opened | clique histórico de navegação para case | case_slug, case_type |
| case_filter_selected | clique em filtro | case_filter |
| insight_opened | clique em insight | insight_slug |
| cv_clicked, linkedin_clicked, email_clicked, whatsapp_clicked | eventos históricos mantidos | portfolio_action, portfolio_section |
| case_link_copied | cópia bem-sucedida | case_slug (histórico, sem versão s04) |
| $pageview | rota virtual ou âncora normalizada | portfolio_route, portfolio_page_type |

Eventos novos e eventos legados emitidos pelo analytics.js recebem measurement_version=s04. Não somar eventos históricos com eventos novos como se fossem conversões distintas. Profundidade mede exposição geométrica, não leitura ou compreensão.

## Funil proposto no PostHog
Unidade: sessão, com passos em ordem na mesma sessão, período de observação inicial de 28 dias após validação do deploy. Se a ferramenta não oferecer agregação por sessão no funil, construir consulta por session ID ou documentar a diferença. Filtrar measurement_version=s04.
1. portfolio_viewed (home ou qualquer landing).
2. case_viewed.
3. case_depth_reached com depth_percent >= 50.
4. professional_intent_clicked.
Funis auxiliares: portfolio_viewed → professional_intent_clicked (inclui atalhos de CV); case_viewed → professional_intent_clicked (inclui entradas diretas; não exige scroll). Não exigir que todos os visitantes percorram a home. Passos simultâneos devem ser revisados no painel. Não inferir cargo do visitante.

## Indicadores
- Norteadora: sessões com visualização de case seguida de intenção profissional / sessões com portfolio_viewed.
- Descoberta: sessões com case_viewed / sessões com portfolio_viewed.
- Profundidade: sessões com case_depth_reached >= 50 / sessões com case_viewed; opcionalmente por case.
- Intenção direta: sessões com professional_intent_clicked / sessões com portfolio_viewed.
- Interesse por case: sessões distintas com case_viewed, segmentadas por case_slug; não somar segmentos como total único.
- Diagnóstico: canais de intenção, filtros, origem e dispositivo quando disponíveis; contagens absolutas junto às taxas.
- Proteções: erros, links quebrados, qualidade de eventos, volume por dispositivo, duplicação; comparação com Clarity apenas qualitativa, sem presumir equivalência de sessões.
- Contato real, download efetivo e contratação não são medidos por clique. Não há metas numéricas ou baseline verificada.

## Hipóteses priorizadas
| Hipótese | Sinal primário | Proteção |
|---|---|---|
| Curadoria facilita encontrar case | descoberta, por categoria | acesso aos demais cases |
| Resumo executivo facilita aprofundamento | profundidade e intenção após case | não assumir que mais scroll é sempre melhor |
| CTA profissional contextual reduz fricção | intenção após case e canal | links editoriais não contados como CTA |
| Destaque do Outis aumenta interesse relevante | visualizações por case e intenção subsequente | diversidade de exploração e origem do tráfego |

Primeiro validar eventos; coletar baseline; comparar períodos equivalentes com volume e origem; testar uma alteração por vez. Se houver volume suficiente, planejar experimento com amostra e critérios prévios. Nenhum experimento executado.

## QA antes de publicação
- Abrir home, case interno, Outis, Novo BrisaCliente, navegação anterior/próximo, hash interno, voltar/avançar, visita direta e modo interno.
- Confirmar eventos e propriedades no ambiente de teste, sem gerar tráfego sintético na produção.
- Conferir rolagem, resize e 25/50/75/100; sessões com atalhos; recomendações e links editoriais excluídos do novo CTA.
- Validar Clarity em cada página e revisar privacidade/consentimento; confirmar configuração do projeto antes de criar insights reais.
- Registrar baseline, versão, período, filtros e limitações no painel. Não usar o painel de projeto não identificado.
