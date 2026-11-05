const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

// US03 — Agendar envio para um segmento (RN03, RN04)

Given('que o relógio de São Paulo marca {string}', function (dataHora) {
  this.servico.definirAgora(this.instante(dataHora))
})

Given('que o segmento {string} tem {int} assinantes', function (nome, quantidade) {
  this.servico.criarSegmento(nome, quantidade)
  this.segmentosEscolhidos.push(nome)
})

Given('que o envio está agendado para daqui a {int} minutos', function (minutos) {
  const { disparo } = this.servico.agendar(this.edicaoAtual, this.segmentosEscolhidos, this.daquiA(60))
  disparo.horario = this.daquiA(minutos) // posiciona o disparo direto no ponto que o cenário quer testar
  this.disparo = disparo
})

Given('que o envio já foi reagendado {int} vez\\(es)', function (vezes) {
  for (let i = 0; i < vezes; i++) this.servico.reagendar(this.disparo, this.daquiA(60 + i + 1))
  assert.equal(this.disparo.reagendamentos, vezes)
})

When('agendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.agendar(this.edicaoAtual, this.segmentosEscolhidos, this.daquiA(minutos))
  this.disparo = this.resultado.disparo || null
})

When('reagendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.reagendar(this.disparo, this.daquiA(minutos))
})

When('cancelo o envio', function () {
  this.resultado = this.servico.cancelar(this.disparo)
})

Then('o disparo deve estar agendado para {string}', function (dataHora) {
  assert.ok(this.disparo, 'nenhum disparo foi criado')
  assert.equal(this.disparo.status, 'agendado')
  assert.equal(new Date(this.disparo.horario).getTime(), this.instante(dataHora))
})

Then('nenhum disparo deve estar agendado', function () {
  assert.equal(this.servico.disparosAgendados().length, 0)
})
