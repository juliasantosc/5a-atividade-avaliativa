// Domínio do NewsFlow em memória — só o necessário para as 4 histórias.
// O relógio é simulado: nada de sleep, o tempo só anda quando alguém chama avancarRelogio().

const SEGUNDO = 1000
const MINUTO = 60 * SEGUNDO
const INTERVALO_AUTOSAVE = 30 * SEGUNDO // RN01
const MAX_VERSOES = 20 // RN01
const ANTECEDENCIA_MINIMA = 15 * MINUTO // RN03
const MAX_REAGENDAMENTOS = 2 // RN03
const PRAZO_CANCELAMENTO = 5 * MINUTO // RN03
const MAX_SEGMENTOS = 5 // RN04
const MAX_NEWSLETTERS_SEMANA = 2 // RN05

const ok = (mensagem, extra = {}) => ({ ok: true, mensagem, ...extra })
const erro = (mensagem) => ({ ok: false, mensagem })

class Servico {
  constructor (agora = Date.parse('2026-03-10T09:00:00-03:00')) {
    this.agora = agora
    this.usuarios = new Map()
    this.edicoes = new Map()
    this.segmentos = new Map()
    this.assinantes = new Map()
    this.disparos = []
  }

  // ---------- relógio ----------
  definirAgora (instante) {
    this.agora = instante
  }

  avancarRelogio (ms) {
    const fim = this.agora + ms
    for (const edicao of this.edicoes.values()) {
      const salvarEm = edicao.ultimaDigitacao + INTERVALO_AUTOSAVE
      if (edicao.alteracaoPendente && salvarEm <= fim) this._salvarVersao(edicao, salvarEm)
    }
    this.agora = fim
  }

  // ---------- usuários ----------
  autenticar (nome, papel) {
    const usuario = this.usuarios.get(nome) || { nome, papeis: new Set() }
    usuario.papeis.add(papel)
    this.usuarios.set(nome, usuario)
    return usuario
  }

  // ---------- RN01: rascunho e versões ----------
  criarEdicao (titulo, autor) {
    const edicao = {
      titulo,
      autor,
      texto: '',
      estado: 'rascunho',
      versoes: [],
      proximaVersao: 1,
      comentarios: [],
      alteracaoPendente: false,
      ultimaDigitacao: null
    }
    this.edicoes.set(titulo, edicao)
    return edicao
  }

  edicao (titulo) {
    const e = this.edicoes.get(titulo)
    if (!e) throw new Error(`Edição inexistente: ${titulo}`)
    return e
  }

  digitar (titulo, texto) {
    const e = this.edicao(titulo)
    e.texto = texto
    e.alteracaoPendente = true
    e.ultimaDigitacao = this.agora
  }

  _salvarVersao (edicao, instante) {
    edicao.versoes.push({ numero: edicao.proximaVersao++, texto: edicao.texto, salvaEm: instante })
    if (edicao.versoes.length > MAX_VERSOES) edicao.versoes.shift()
    edicao.alteracaoPendente = false
  }

  restaurarVersao (titulo, numero) {
    const e = this.edicao(titulo)
    const versao = e.versoes.find(v => v.numero === numero)
    if (!versao) return erro(`Só as últimas ${MAX_VERSOES} versões podem ser restauradas`)
    e.texto = versao.texto
    this._salvarVersao(e, this.agora) // restaurar vira uma versão nova; nada é apagado
    return ok(`Versão ${numero} restaurada`)
  }

  // ---------- RN02: aprovação ----------
  enviarParaRevisao (titulo) {
    this.edicao(titulo).estado = 'em revisão'
  }

  _validarRevisor (e, nome) {
    const usuario = this.usuarios.get(nome)
    if (!usuario || !usuario.papeis.has('revisor')) return erro('Somente revisores podem avaliar edições')
    if (e.autor === nome) return erro('O autor não pode aprovar a própria edição')
    if (e.estado !== 'em revisão') return erro('A edição não está em revisão')
    return null
  }

  aprovar (titulo, nomeRevisor) {
    const e = this.edicao(titulo)
    const problema = this._validarRevisor(e, nomeRevisor)
    if (problema) return problema
    e.estado = 'aprovada'
    e.aprovadaPor = nomeRevisor
    return ok('Edição aprovada')
  }

  reprovar (titulo, nomeRevisor, comentario) {
    const e = this.edicao(titulo)
    const problema = this._validarRevisor(e, nomeRevisor)
    if (problema) return problema
    if (!comentario || !comentario.trim()) return erro('Informe um comentário para reprovar a edição')
    e.estado = 'rascunho'
    e.comentarios.push({ autor: nomeRevisor, texto: comentario })
    return ok('Edição devolvida ao rascunho')
  }

  // ---------- segmentos e assinantes ----------
  criarSegmento (nome, quantidade = 0) {
    const segmento = this.segmentos.get(nome) || { nome, membros: new Set() }
    for (let i = 1; i <= quantidade; i++) segmento.membros.add(`${nome} #${i}`)
    this.segmentos.set(nome, segmento)
    return segmento
  }

  incluirNoSegmento (assinante, nomeSegmento) {
    this.criarSegmento(nomeSegmento).membros.add(assinante)
    this.assinante(assinante)
  }

  assinante (nome) {
    if (!this.assinantes.has(nome)) {
      this.assinantes.set(nome, { nome, recebidasNaSemana: 0, filaProximaSemana: [], emails: [] })
    }
    return this.assinantes.get(nome)
  }

  // ---------- RN03 / RN04: agendamento ----------
  agendar (titulo, nomesSegmentos, horario) {
    const e = this.edicao(titulo)
    if (e.estado !== 'aprovada') return erro('A edição precisa ser aprovada antes do agendamento')
    if (nomesSegmentos.length > MAX_SEGMENTOS) return erro(`Uma edição vai para no máximo ${MAX_SEGMENTOS} segmentos`)
    for (const nome of nomesSegmentos) {
      const seg = this.segmentos.get(nome)
      if (!seg || seg.membros.size === 0) return erro(`O segmento ${nome} não tem assinantes`)
    }
    if (horario - this.agora < ANTECEDENCIA_MINIMA) return erro('O envio precisa de ao menos 15 minutos')

    const disparo = { id: this.disparos.length + 1, titulo, segmentos: [...nomesSegmentos], horario, reagendamentos: 0, status: 'agendado' }
    this.disparos.push(disparo)
    return ok('Envio agendado', { disparo })
  }

  reagendar (disparo, novoHorario) {
    if (disparo.reagendamentos >= MAX_REAGENDAMENTOS) return erro(`Limite de ${MAX_REAGENDAMENTOS} reagendamentos atingido`)
    if (novoHorario - this.agora < ANTECEDENCIA_MINIMA) return erro('O envio precisa de ao menos 15 minutos')
    disparo.horario = novoHorario
    disparo.reagendamentos++
    return ok('Envio reagendado')
  }

  cancelar (disparo) {
    if (disparo.horario - this.agora < PRAZO_CANCELAMENTO) return erro('Não é possível cancelar a menos de 5 minutos do envio')
    disparo.status = 'cancelado'
    return ok('Envio cancelado')
  }

  disparosAgendados () {
    return this.disparos.filter(d => d.status === 'agendado')
  }

  // ---------- RN04 / RN05: entrega ----------
  disparar (titulo, nomesSegmentos) {
    const destinatarios = new Set() // Set elimina quem está em mais de um segmento (RN04)
    for (const nome of nomesSegmentos) {
      for (const membro of this.criarSegmento(nome).membros) destinatarios.add(membro)
    }
    for (const nome of destinatarios) {
      const a = this.assinante(nome)
      if (a.recebidasNaSemana < MAX_NEWSLETTERS_SEMANA) {
        a.emails.push({ tipo: 'newsletter', assunto: titulo, entregueEm: this.agora })
        a.recebidasNaSemana++
      } else {
        a.filaProximaSemana.push(titulo) // RN05: excedente vai para a semana seguinte
      }
    }
  }

  enviarTransacional (nomeAssinante, assunto) {
    // RN05: transacional não conta no limite semanal
    this.assinante(nomeAssinante).emails.push({ tipo: 'transacional', assunto, entregueEm: this.agora })
  }
}

module.exports = Servico
