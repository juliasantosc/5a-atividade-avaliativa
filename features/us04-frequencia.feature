# language: pt
@US04
Funcionalidade: Limitar newsletters por semana
  Como assinante
  Quero receber no máximo 2 newsletters por semana, sem e-mails repetidos
  Para não ter a caixa de entrada lotada e não querer sair da lista

  Contexto:
    Dado que existe a edição "Informativo #42" aprovada
    E que a assinante "Duda" está no segmento "Clientes Premium"

  @limite
  Esquema do Cenário: No máximo 2 newsletters por semana
    Dado que a assinante "Duda" já recebeu <recebidas> newsletter(s) nesta semana
    Quando a edição é disparada para o segmento "Clientes Premium"
    Então a assinante "Duda" deve ter recebido <total> newsletter(s) nesta semana
    E a assinante "Duda" deve ter <fila> newsletter(s) na fila da semana seguinte

    Exemplos:
      | recebidas | total | fila |
      | 0         | 1     | 0    |
      | 1         | 2     | 0    |
      | 2         | 2     | 1    |

  @excecao
  Cenário: E-mail transacional não conta para o limite semanal
    Dado que a assinante "Duda" já recebeu 2 newsletters nesta semana
    Quando a assinante "Duda" recebe o e-mail transacional "Recibo de pagamento"
    Então o e-mail transacional "Recibo de pagamento" deve ser entregue à assinante "Duda"
    E a assinante "Duda" deve ter recebido 2 newsletters nesta semana

  @feliz
  Cenário: Quem está em dois segmentos recebe um único e-mail
    Dado que a assinante "Duda" está no segmento "Belo Horizonte"
    Quando a edição é disparada para os segmentos "Clientes Premium" e "Belo Horizonte"
    Então a assinante "Duda" deve receber 1 e-mail da edição "Informativo #42"
