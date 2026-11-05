const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

// US01 — Salvar rascunho automaticamente (RN01)

Given('que existe a edição {string} em rascunho', function (titulo) {
  this.servico.criarEdicao(titulo, this.usuarioAtual)
  this.edicaoAtual = titulo
})

Given('que escrevi {string} na edição', function (texto) {
  this.servico.digitar(this.edicaoAtual, texto)
})

Given('que a edição tem {int} versões salvas', function (quantidade) {
  for (let i = 1; i <= quantidade; i++) {
    this.servico.digitar(this.edicaoAtual, `Texto da versão ${i}`)
    this.avancarSegundos(30)
  }
})

When('fico {int} segundos sem digitar', function (segundos) {
  this.avancarSegundos(segundos)
})

When('restauro a versão {int}', function (numero) {
  this.resultado = this.servico.restaurarVersao(this.edicaoAtual, numero)
})

Then('a edição deve ter {int} versão/versões disponível/disponíveis', function (quantidade) {
  assert.equal(this.servico.edicao(this.edicaoAtual).versoes.length, quantidade)
})

Then('a versão {int} deve conter {string}', function (numero, texto) {
  const versao = this.servico.edicao(this.edicaoAtual).versoes.find(v => v.numero === numero)
  assert.ok(versao, `versão ${numero} não encontrada`)
  assert.equal(versao.texto, texto)
})

Then('a versão {int} deve continuar disponível', function (numero) {
  const numeros = this.servico.edicao(this.edicaoAtual).versoes.map(v => v.numero)
  assert.ok(numeros.includes(numero), `versão ${numero} não está entre ${numeros.join(', ')}`)
})

Then('o texto da edição deve ser {string}', function (texto) {
  assert.equal(this.servico.edicao(this.edicaoAtual).texto, texto)
})
