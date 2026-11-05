const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

// US04 — Limitar newsletters por semana (RN05, RN04)

Given('que a assinante {string} está no segmento {string}', function (assinante, segmento) {
  this.servico.incluirNoSegmento(assinante, segmento)
})

Given('que a assinante {string} já recebeu {int} newsletters/newsletter\\(s) nesta semana', function (assinante, quantidade) {
  for (let i = 1; i <= quantidade; i++) {
    this.servico.assinante(assinante).emails.push({ tipo: 'newsletter', assunto: `Edição anterior ${i}` })
  }
  this.servico.assinante(assinante).recebidasNaSemana = quantidade
})

When('a edição é disparada para o segmento {string}', function (segmento) {
  this.servico.disparar(this.edicaoAtual, [segmento])
})

When('a edição é disparada para os segmentos {string} e {string}', function (seg1, seg2) {
  this.servico.disparar(this.edicaoAtual, [seg1, seg2])
})

When('a assinante {string} recebe o e-mail transacional {string}', function (assinante, assunto) {
  this.servico.enviarTransacional(assinante, assunto)
})

Then('a assinante {string} deve ter recebido {int} newsletters/newsletter\\(s) nesta semana', function (assinante, quantidade) {
  assert.equal(this.servico.assinante(assinante).recebidasNaSemana, quantidade)
})

Then('a assinante {string} deve ter {int} newsletters/newsletter\\(s) na fila da semana seguinte', function (assinante, quantidade) {
  assert.equal(this.servico.assinante(assinante).filaProximaSemana.length, quantidade)
})

Then('o e-mail transacional {string} deve ser entregue à assinante {string}', function (assunto, assinante) {
  const entregue = this.servico.assinante(assinante).emails
    .some(e => e.tipo === 'transacional' && e.assunto === assunto)
  assert.ok(entregue, `"${assunto}" não foi entregue`)
})

Then('a assinante {string} deve receber {int} e-mail(s) da edição {string}', function (assinante, quantidade, titulo) {
  const daEdicao = this.servico.assinante(assinante).emails.filter(e => e.assunto === titulo)
  assert.equal(daEdicao.length, quantidade)
})
