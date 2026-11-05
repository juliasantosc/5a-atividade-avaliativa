const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

// US02 — Aprovar ou reprovar edição (RN02)

Given('que a redatora {string} escreveu a edição {string}', function (autora, titulo) {
  this.servico.autenticar(autora, 'redator')
  this.servico.criarEdicao(titulo, autora)
  this.servico.digitar(titulo, 'Conteúdo da edição')
  this.edicaoAtual = titulo
})

Given('que a edição foi enviada para revisão', function () {
  this.servico.enviarParaRevisao(this.edicaoAtual)
})

When('aprovo a edição', function () {
  this.resultado = this.servico.aprovar(this.edicaoAtual, this.usuarioAtual)
})

When('reprovo a edição com o comentário {string}', function (comentario) {
  this.resultado = this.servico.reprovar(this.edicaoAtual, this.usuarioAtual, comentario)
})

Then('a edição deve estar {string}', function (estado) {
  assert.equal(this.servico.edicao(this.edicaoAtual).estado, estado)
})

Then('a edição deve ter o comentário {string}', function (texto) {
  const comentarios = this.servico.edicao(this.edicaoAtual).comentarios.map(c => c.texto)
  assert.ok(comentarios.includes(texto), `comentários: ${comentarios.join(' | ') || '(nenhum)'}`)
})
