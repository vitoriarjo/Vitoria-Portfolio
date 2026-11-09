# Portfolio as a Product — protocolo de medição e experimentação

Status: **instrumentação preparada; resultados reais não acessados nesta sprint**.
Objetivo: descobrir se o portfólio ajuda a pessoa visitante a localizar evidências de atuação, aprofundar um case e avançar para um canal de conexão profissional.

## Fonte de dados e escopo

- **PostHog**: eventos explícitos de clique e pageviews virtuais da home e cases, sujeitos a consentimento/configurações locais, bloqueadores e navegação.
- **Microsoft Clarity**: dados comportamentais agregados, como scroll e zonas de interação. Não substitui evento explícito de entendimento ou satisfação.
- **Exclusão de visitas internas**: parâmetro `?internal=1` marca o navegador para não disparar a instrumentação; `?internal=0` remove a marca. Validar o filtro antes de comparar períodos.
- **Outis**: inclusão de `analytics.js` na página externa em `cases/governanca-backlog/`; a classificação de rota usa `case-governanca-backlog`.
- Nenhum destes dados foi consultado no PostHog nesta sprint. Resultados observados, tendências e uplifts **não estão afirmados**.

## Taxonomia que importa para a decisão

| Evento | Onde nasce | O que permite concluir | O que não permite concluir |
| --- | --- | --- | --- |
| `$pageview` | Entrada em página / mudança de rota | Visitas por rota, com atenção à deduplicação | Leitura ou compreensão do conteúdo |
| `case_filter_selected` | Filtro Todos / Estratégia / Growth / Operations | Preferências de navegação declaradas por clique | Interesse real em cases específicos sem considerar aberturas |
| `case_opened` | Cards de cases com `data-track` | Interesse inicial no case selecionado | Leitura completa ou relevância percebida |
| `insight_opened` | Cards de artigos | Acesso ao conteúdo editorial | Retenção do aprendizado |
| `cv_clicked` | Botão de CV | Intenção de acessar o currículo | Download concluído ou candidatura |
| `linkedin_clicked` | Link do LinkedIn | Clique de saída para o perfil | Nova conexão ou contratação |
| `email_clicked` / `whatsapp_clicked` | Links de contato | Intenção de abrir canal | Mensagem efetivamente enviada |
| `navigation_clicked` | Âncoras e rotas marcadas | Caminhos de navegação | Conclusão da ação pretendida |

Alguns links podem disparar autocapture além do evento explícito; não somar fontes distintas indiscriminadamente. Conferir comportamento do evento e identificadores estáveis antes de calcular qualquer taxa.

## Hipóteses e decisões

### H1 — Curadoria ajuda descoberta
- **Hipótese**: filtro por competências reduz esforço para localizar cases relevantes.
- **Sinais**: `case_filter_selected` por categoria, `case_opened` e sequência de abertura por sessão.
- **Critério de decisão**: conferir instrumentação, amostra, distribuição por fonte de tráfego e dispositivo antes de reorganizar filtros e cards.
- **Ação possível**: melhorar rótulos ou ordem, **apenas** se houver padrão consistente de baixa descoberta.

### H2 — Resumo executivo facilita a leitura
- **Hipótese**: sumários ajudam a entender problema, decisão e resultado.
- **Sinais**: abertura do case, navegação para outro case e scroll agregado (Clarity).
- **Limite atual**: não existe evento que prove compreensão; uma hipótese de entendimento exige pesquisa qualitativa ou teste de usabilidade.
- **Ação possível**: entrevistas rápidas com pessoas recrutadoras/PMs ou teste comparativo de clareza.

### H3 — Evidências ajudam conexão
- **Hipótese**: clareza das evidências aumenta a propensão a explorar CV/perfil ou contato.
- **Sinais**: cliques em CV, LinkedIn, e-mail e WhatsApp, segmentados por rota de entrada.
- **Limite**: clique não é contato concluído. Sem rastrear processo seletivo, não declarar geração de oportunidades.
- **Ação possível**: reposicionar CTAs conforme evidências, preservando links e acessibilidade.

## Como analisar (sem inventar resultados)

1. Verificar evento e parâmetros no PostHog em navegação real e sessão marcada como externa.
2. Excluir visitas internas, tráfego de teste e bots conforme capacidade dos dados.
3. Definir janela comparável, unidade de análise (visita/sessão ou visitante) e denominador **antes** de olhar o resultado.
4. Analisar por origem de tráfego, dispositivo e tipo de case; evitar inferência com amostras pequenas.
5. Para conversão `case_opened → cv_clicked`, usar funil por sessão com ordem dos eventos e janela declarada, **não** dividir totais brutos de eventos.
6. Registrar decisão, hipótese, mudança realizada e janela de acompanhamento em uma próxima revisão.
7. Se não houver amostra suficiente, registrar **inconclusivo** e não declarar melhoria.

## Registro de experimentos

| ID | Hipótese | Alteração | Janela / amostra | Resultado | Decisão |
| --- | --- | --- | --- | --- | --- |
| H1 | Curadoria | Sem alteração experimental nesta sprint | Não consultada | **Pendente** | Aguardar dados |
| H2 | Resumos | Sem experimento controlado | Não consultada | **Pendente** | Avaliar teste qualitativo |
| H3 | Conexão | Sem experimento controlado | Não consultada | **Pendente** | Aguardar dados |

> Esta sprint prepara a observabilidade e o processo decisório. Não representa validação estatística, experimento A/B executado, medição de conversão ou resultado comercial.
