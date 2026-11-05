# language: pt
@US03
Funcionalidade: Agendar envio para um segmento
  Como gestora de comunicação
  Quero agendar o envio de uma edição aprovada para um segmento específico
  Para que cada público receba a edição no melhor horário sem eu precisar apertar o botão

  Contexto:
    Dado que estou autenticada como gestora "Carla"
    E que existe a edição "Informativo #42" aprovada
    E que o relógio de São Paulo marca "10/03/2026 09:00"
    E que o segmento "Clientes Premium" tem 1200 assinantes

  @feliz
  Cenário: Agendamento com antecedência suficiente
    Quando agendo o envio para daqui a 30 minutos
    Então devo ver a mensagem "Envio agendado"
    E o disparo deve estar agendado para "10/03/2026 09:30"

  @limite
  Esquema do Cenário: Antecedência mínima de 15 minutos
    Quando agendo o envio para daqui a <minutos> minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                               |
      | 60      | Envio agendado                         |
      | 16      | Envio agendado                         |
      | 15      | Envio agendado                         |
      | 14      | O envio precisa de ao menos 15 minutos |
      | 0       | O envio precisa de ao menos 15 minutos |

  @limite
  Esquema do Cenário: Limite de 2 reagendamentos
    Dado que o envio está agendado para daqui a 60 minutos
    E que o envio já foi reagendado <vezes> vez(es)
    Quando reagendo o envio para daqui a 120 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | vezes | mensagem                            |
      | 0     | Envio reagendado                    |
      | 1     | Envio reagendado                    |
      | 2     | Limite de 2 reagendamentos atingido |

  @limite
  Esquema do Cenário: Cancelamento até 5 minutos antes do envio
    Dado que o envio está agendado para daqui a <minutos> minutos
    Quando cancelo o envio
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                                              |
      | 6       | Envio cancelado                                       |
      | 5       | Envio cancelado                                       |
      | 4       | Não é possível cancelar a menos de 5 minutos do envio |

  @excecao
  Cenário: Segmento sem assinantes bloqueia o agendamento
    Dado que o segmento "Beta Testers" tem 0 assinantes
    Quando agendo o envio para daqui a 30 minutos
    Então devo ver a mensagem "O segmento Beta Testers não tem assinantes"
    E nenhum disparo deve estar agendado
