# language: pt
@US01
Funcionalidade: Salvar rascunho automaticamente
  Como redatora
  Quero que meu texto seja salvo sozinho enquanto escrevo
  Para não perder trabalho quando a conexão cair

  Contexto:
    Dado que estou autenticada como redatora "Ana"
    E que existe a edição "Informativo #42" em rascunho

  @feliz
  Cenário: Texto é salvo depois de 30 segundos sem digitar
    Dado que escrevi "Novidades de março" na edição
    Quando fico 30 segundos sem digitar
    Então a edição deve ter 1 versão disponível
    E a versão 1 deve conter "Novidades de março"

  @limite
  Esquema do Cenário: Intervalo de 30 segundos para o salvamento
    Dado que escrevi "Novidades de março" na edição
    Quando fico <segundos> segundos sem digitar
    Então a edição deve ter <versoes> versão disponível

    Exemplos:
      | segundos | versoes |
      | 29       | 0       |
      | 30       | 1       |
      | 31       | 1       |

  @feliz
  Cenário: Restaurar uma versão não apaga as seguintes
    Dado que a edição tem 5 versões salvas
    Quando restauro a versão 2
    Então o texto da edição deve ser "Texto da versão 2"
    E a edição deve ter 6 versões disponíveis
    E a versão 5 deve continuar disponível

  @excecao
  Cenário: Versão mais antiga que as últimas 20 não pode ser restaurada
    Dado que a edição tem 21 versões salvas
    Quando restauro a versão 1
    Então devo ver a mensagem "Só as últimas 20 versões podem ser restauradas"
    E a edição deve ter 20 versões disponíveis
