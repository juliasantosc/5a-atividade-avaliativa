# NewsFlow BDD com Gherkin e Cucumber.js

Quatro histórias de usuário do NewsFlow (plataforma de newsletters da Vértice), escritas em Gherkin e automatizadas com Cucumber.js sobre um domínio em memória.

**Dupla:** Julia Santos do Carmo e Vitor Luis Lobo Barbosa

## Como rodar

```bash
npm install
npm test           
npm run test:dry   
```

Requer Node.js 18 ou superior.

## Conteúdo

| Arquivo | Conteúdo |
|---|---|
| `docs/historias.md` | US01–US04 com critérios de aceitação, RNs cobertas e prioridade |
| `features/us01-rascunho.feature` | US01 — Salvar rascunho automaticamente (RN01) |
| `features/us02-aprovacao.feature` | US02 — Aprovar ou reprovar edição (RN02) |
| `features/us03-agendamento.feature` | US03 — Agendar envio para um segmento (RN03, RN04) |
| `features/us04-frequencia.feature` | US04 — Limitar newsletters por semana (RN05, RN04) |
| `features/step_definitions/` | Um arquivo de steps por história + `comuns.steps.js` com os passos compartilhados |
| `features/support/world.js` | World recriado a cada cenário (nenhum estado global) |
| `features/support/dominio.js` | Regras de negócio em memória, com relógio simulado (sem `sleep`) |
| `relatorios/cucumber-report.html` | Relatório HTML da última execução |

## Rastreabilidade

| História | Regras | Cenários | Esquemas do Cenário (fronteiras) |
|---|---|---|---|
| US01 | RN01 | feliz, exceção, restauração | 29 / 30 / 31 segundos |
| US02 | RN02 | feliz, autoaprovação, reprovação com e sem comentário | — |
| US03 | RN03, RN04 | feliz, segmento vazio | antecedência 60/16/15/14/0 min · reagendamentos 0/1/2 · cancelamento 6/5/4 min |
| US04 | RN05, RN04 | e-mail único, transacional | 0 / 1 / 2 newsletters já recebidas |


## Fora de escopo

- **RN06 — Descadastro:** depende de link de confirmação por e-mail e janela de 48 horas para o duplo opt-in; é um fluxo próprio que caberia sozinho em uma história, e escolhemos priorizar o que impede envio errado (aprovação) e excesso de envio (frequência).
- **RN07 — Falha de entrega:** é uma regra de infraestrutura (tentativas, intervalos, bounces) percebida pela operação, não por quem escreve ou recebe; fica para uma rodada focada no ator Operação.
- **RN08 — Notificação push:** é um segundo canal com regras próprias (janela de silêncio, limite diário); priorizamos o e-mail, que é o canal principal dos 40 mil assinantes.
- **RN04 — limite de 5 segmentos:** a regra está implementada no domínio, mas sem cenário; das três partes da RN04, cobrimos as duas com mais impacto para o assinante (segmento vazio e e-mail único).

## Saída do `npm test`

```
.................................................................................................................................................................................
28 scenarios (28 passed)
177 steps (177 passed)
0m 0.092s (0m 0.015s executing your code)
```

Os 28 cenários incluem cada linha dos Exemplos (o Cucumber conta cada linha de um Esquema como um cenário). A suíte também passa com `npx cucumber-js --parallel 2`, o que confirma que os cenários são independentes.
