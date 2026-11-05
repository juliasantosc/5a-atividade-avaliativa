const { setWorldConstructor } = require('@cucumber/cucumber')
const Servico = require('./dominio')

// Papéis no texto (masculino/feminino) → papel no domínio
const PAPEIS = {
  redator: 'redator', redatora: 'redator',
  revisor: 'revisor', revisora: 'revisor',
  gestor: 'gestor', gestora: 'gestor'
}

class MundoDoNewsFlow {
  constructor () {
    this.servico = new Servico() // novo a cada cenário: nenhum cenário depende de outro
    this.usuarioAtual = null
    this.edicaoAtual = null
    this.segmentosEscolhidos = []
    this.disparo = null
    this.resultado = null
  }

  autenticar (papelTexto, nome) {
    const papel = PAPEIS[papelTexto]
    if (!papel) throw new Error(`Papel desconhecido: ${papelTexto}`)
    this.servico.autenticar(nome, papel)
    this.usuarioAtual = nome
  }

  avancarSegundos (segundos) {
    this.servico.avancarRelogio(segundos * 1000)
  }

  daquiA (minutos) {
    return this.servico.agora + minutos * 60 * 1000
  }

  // "10/03/2026 09:30" no fuso America/Sao_Paulo (UTC-3, sem horário de verão desde 2019)
  instante (texto) {
    const [, d, m, a, h, min] = texto.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/)
    return Date.parse(`${a}-${m}-${d}T${h}:${min}:00-03:00`)
  }
}

setWorldConstructor(MundoDoNewsFlow)
