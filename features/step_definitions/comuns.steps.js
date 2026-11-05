const { Given, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

// Passos usados por mais de uma história

Given('que estou autenticado/autenticada como {word} {string}', function (papel, nome) {
  this.autenticar(papel, nome)
})

Given('que existe a edição {string} aprovada', function (titulo) {
  this.servico.autenticar('Redação', 'redator')
  this.servico.autenticar('Revisão', 'revisor')
  this.servico.criarEdicao(titulo, 'Redação')
  this.servico.enviarParaRevisao(titulo)
  this.servico.aprovar(titulo, 'Revisão')
  this.edicaoAtual = titulo
})

Then('devo ver a mensagem {string}', function (esperada) {
  assert.ok(this.resultado, 'nenhuma ação foi executada no cenário')
  assert.equal(this.resultado.mensagem, esperada)
})
