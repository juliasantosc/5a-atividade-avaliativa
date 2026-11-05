# Histórias de usuário — NewsFlow

Quatro histórias, recortadas por fatia vertical. Cada uma aponta para as regras de negócio (RN) que cobre e para o arquivo `.feature` que a comprova.

---

## US01 — Salvar rascunho automaticamente

**Como** redatora
**Quero** que meu texto seja salvo sozinho enquanto escrevo
**Para** não perder trabalho quando a conexão cair

**Critérios de aceitação**
- O rascunho é salvo depois de 30 segundos sem digitar; antes disso, nada é salvo.
- Cada salvamento cria uma versão numerada em sequência.
- Só as últimas 20 versões ficam disponíveis para restauração.
- Restaurar uma versão traz o texto dela de volta e não apaga as versões seguintes.

**Regras cobertas:** RN01
**Prioridade:** Alta — perda de conteúdo é a reclamação número um dos redatores.
**Cenários:** `features/us01-rascunho.feature`

---

## US02 — Aprovar ou reprovar edição

**Como** revisor
**Quero** aprovar ou devolver uma edição com um comentário
**Para** garantir que nada sai sem uma segunda leitura e que o redator saiba exatamente o que corrigir

**Critérios de aceitação**
- Um revisor diferente do autor pode aprovar a edição.
- O autor não aprova a própria edição, mesmo que também seja revisor.
- Reprovar exige um comentário; sem comentário, a edição continua em revisão.
- A reprovação devolve a edição ao rascunho com o comentário registrado.

**Regras cobertas:** RN02
**Prioridade:** Alta — é a trava que impede um texto errado de chegar a 40 mil assinantes.
**Cenários:** `features/us02-aprovacao.feature`

---

## US03 — Agendar envio para um segmento

**Como** gestora de comunicação
**Quero** agendar o envio de uma edição aprovada para um segmento específico
**Para** que cada público receba a edição no melhor horário sem eu precisar apertar o botão

**Critérios de aceitação**
- O envio só é agendado com no mínimo 15 minutos de antecedência, no fuso de São Paulo.
- Um envio pode ser reagendado no máximo 2 vezes.
- O cancelamento é permitido até 5 minutos antes do horário marcado.
- Um segmento com zero assinantes bloqueia o agendamento.

**Regras cobertas:** RN03, RN04 (segmento vazio)
**Prioridade:** Alta — sem agendamento, alguém precisa ficar de plantão para disparar cada edição.
**Cenários:** `features/us03-agendamento.feature`

---

## US04 — Limitar newsletters por semana

**Como** assinante
**Quero** receber no máximo 2 newsletters por semana, sem e-mails repetidos
**Para** não ter a caixa de entrada lotada e não querer sair da lista

**Critérios de aceitação**
- Até 2 newsletters por semana são entregues normalmente.
- A partir da terceira, a newsletter vai para a fila da semana seguinte.
- E-mails transacionais (recibo, confirmação de cadastro) são entregues sempre e não contam no limite.
- Quem está em dois segmentos do mesmo disparo recebe um único e-mail.

**Regras cobertas:** RN05, RN04 (e-mail único)
**Prioridade:** Média — protege a lista de descadastros, mas o envio funciona sem ela.
**Cenários:** `features/us04-frequencia.feature`
