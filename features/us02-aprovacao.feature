# language: pt
@US02
Funcionalidade: Aprovar ou reprovar edição
  Como revisor
  Quero aprovar ou devolver uma edição com um comentário
  Para garantir que nada sai sem uma segunda leitura

  Contexto:
    Dado que a redatora "Ana" escreveu a edição "Informativo #42"
    E que a edição foi enviada para revisão

  @feliz
  Cenário: Revisor diferente do autor aprova a edição
    Dado que estou autenticado como revisor "Bruno"
    Quando aprovo a edição
    Então devo ver a mensagem "Edição aprovada"
    E a edição deve estar "aprovada"

  @excecao
  Cenário: Autora não aprova a própria edição
    Dado que estou autenticada como revisora "Ana"
    Quando aprovo a edição
    Então devo ver a mensagem "O autor não pode aprovar a própria edição"
    E a edição deve estar "em revisão"

  @alternativo
  Cenário: Reprovação com comentário devolve a edição ao rascunho
    Dado que estou autenticado como revisor "Bruno"
    Quando reprovo a edição com o comentário "Corrigir a data do evento no segundo parágrafo"
    Então a edição deve estar "rascunho"
    E a edição deve ter o comentário "Corrigir a data do evento no segundo parágrafo"

  @excecao
  Cenário: Reprovação sem comentário não é aceita
    Dado que estou autenticado como revisor "Bruno"
    Quando reprovo a edição com o comentário ""
    Então devo ver a mensagem "Informe um comentário para reprovar a edição"
    E a edição deve estar "em revisão"
