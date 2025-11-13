import { useState, useEffect } from 'react'
import './CalendarioEscala.css'

const API_URL = 'http://localhost:8000'

function CalendarioEscala() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [escalas, setEscalas] = useState([])
  const [militares, setMilitares] = useState([])
  const [loading, setLoading] = useState(false)
  const [gerandoEscala, setGerandoEscala] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [escalaSelecionada, setEscalaSelecionada] = useState(null)
  const [militarSubstitutoId, setMilitarSubstitutoId] = useState('')
  const [justificativa, setJustificativa] = useState('')

  // Buscar escala quando mês ou ano mudarem
  useEffect(() => {
    buscarEscala(mesAtual, anoAtual)
  }, [mesAtual, anoAtual])

  // Buscar militares uma vez ao montar
  useEffect(() => {
    buscarMilitares()
  }, [])

  const buscarEscala = async (mes, ano) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/escala?mes=${mes}&ano=${ano}`)
      if (!response.ok) throw new Error('Erro ao buscar escala')
      const data = await response.json()
      setEscalas(data)
    } catch (error) {
      console.error('Erro ao buscar escala:', error)
      setEscalas([])
    } finally {
      setLoading(false)
    }
  }

  const buscarMilitares = async () => {
    try {
      const response = await fetch(`${API_URL}/militares`)
      if (!response.ok) throw new Error('Erro ao buscar militares')
      const data = await response.json()
      setMilitares(data)
    } catch (error) {
      console.error('Erro ao buscar militares:', error)
    }
  }

  const abrirModal = (escala) => {
    setEscalaSelecionada(escala)
    setMilitarSubstitutoId(escala.militar_executado_id?.toString() || '')
    setJustificativa(escala.justificativa_troca || '')
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setEscalaSelecionada(null)
    setMilitarSubstitutoId('')
    setJustificativa('')
  }

  const gerarEscala = async () => {
    if (!confirm(`Deseja gerar a escala para ${meses[mesAtual - 1]} de ${anoAtual}?`)) {
      return
    }

    setGerandoEscala(true)
    try {
      const response = await fetch(`${API_URL}/escala/gerar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mes: mesAtual,
          ano: anoAtual,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Erro ao gerar escala')
      }

      const data = await response.json()
      await buscarEscala(mesAtual, anoAtual)
      alert(`Escala gerada com sucesso! ${data.length} dias criados.`)
    } catch (error) {
      console.error('Erro ao gerar escala:', error)
      alert(error.message || 'Erro ao gerar escala')
    } finally {
      setGerandoEscala(false)
    }
  }

  const deletarEscalaMes = async () => {
    if (!confirm(`Deseja realmente deletar TODA a escala de ${meses[mesAtual - 1]} de ${anoAtual}?`)) {
      return
    }

    if (!confirm('Esta ação não pode ser desfeita! Continuar?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/escala/mes/${mesAtual}/${anoAtual}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Erro ao deletar escala')
      }

      const data = await response.json()
      await buscarEscala(mesAtual, anoAtual)
      alert(data.message || 'Escala deletada com sucesso!')
    } catch (error) {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao deletar escala')
    }
  }

  const salvarTroca = async () => {
    if (!escalaSelecionada || !militarSubstitutoId || !justificativa.trim()) {
      alert('Preencha todos os campos!')
      return
    }

    try {
      const response = await fetch(`${API_URL}/escala/troca`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          escala_dia_id: escalaSelecionada.id,
          militar_substituto_id: parseInt(militarSubstitutoId),
          justificativa: justificativa,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Erro ao salvar troca')
      }

      // Atualizar escala após troca
      await buscarEscala(mesAtual, anoAtual)
      fecharModal()
      alert('Troca salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar troca:', error)
      alert(error.message || 'Erro ao salvar troca')
    }
  }

  const obterEscalaDoDia = (dia) => {
    return escalas.find((e) => {
      const dataEscala = new Date(e.data)
      return dataEscala.getDate() === dia
    })
  }

  const renderizarCalendario = () => {
    const primeiroDia = new Date(anoAtual, mesAtual - 1, 1)
    const ultimoDia = new Date(anoAtual, mesAtual, 0)
    const diasNoMes = ultimoDia.getDate()
    const diaSemanaInicio = primeiroDia.getDay() // 0 = domingo, 1 = segunda, etc.

    // Ajustar para segunda-feira = 0
    const diaSemanaAjustado = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1

    const dias = []
    const nomesDias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

    // Cabeçalho dos dias da semana
    const cabecalho = nomesDias.map((dia) => (
      <div key={dia} className="calendario-cabecalho">
        {dia}
      </div>
    ))

    // Espaços vazios antes do primeiro dia
    for (let i = 0; i < diaSemanaAjustado; i++) {
      dias.push(<div key={`empty-${i}`} className="calendario-dia vazio"></div>)
    }

    // Dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const escala = obterEscalaDoDia(dia)
      const dataAtual = new Date(anoAtual, mesAtual - 1, dia)
      const ehFimDeSemana = dataAtual.getDay() === 0 || dataAtual.getDay() === 6
      const ehVermelha = escala?.tipo_escala === 'VERMELHA' || ehFimDeSemana
      const temTroca = escala && escala.militar_agendado_id !== escala.militar_executado_id

      dias.push(
        <div
          key={dia}
          className={`calendario-dia ${ehVermelha ? 'vermelha' : ''} ${escala ? 'com-escala' : ''}`}
          onClick={() => escala && abrirModal(escala)}
        >
          <div className="dia-numero">{dia}</div>
          {escala ? (
            <div className="dia-militar">
              {escala.militar_executado?.nome_guerra || 'N/A'}
              {temTroca && <span className="icone-troca" title="Troca realizada">🔁</span>}
            </div>
          ) : (
            <div className="dia-sem-escala">Sem escala</div>
          )}
        </div>
      )
    }

    return (
      <div className="calendario-grid">
        {cabecalho}
        {dias}
      </div>
    )
  }

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const mudarMes = (delta) => {
    let novoMes = mesAtual + delta
    let novoAno = anoAtual

    if (novoMes < 1) {
      novoMes = 12
      novoAno--
    } else if (novoMes > 12) {
      novoMes = 1
      novoAno++
    }

    setMesAtual(novoMes)
    setAnoAtual(novoAno)
  }

  const temEscala = escalas.length > 0

  return (
    <div className="calendario-escala">
      <div className="calendario-controles">
        <button onClick={() => mudarMes(-1)} className="btn-nav">‹ Anterior</button>
        <div className="calendario-titulo">
          <h2>
            {meses[mesAtual - 1]} {anoAtual}
          </h2>
          {temEscala && (
            <span className="badge-escala">Escala gerada ({escalas.length} dias)</span>
          )}
        </div>
        <button onClick={() => mudarMes(1)} className="btn-nav">Próximo ›</button>
      </div>

      <div className="calendario-acoes">
        {!temEscala ? (
          <button 
            onClick={gerarEscala} 
            className="btn-gerar-escala"
            disabled={gerandoEscala}
          >
            {gerandoEscala ? 'Gerando...' : '⚡ Gerar Escala do Mês'}
          </button>
        ) : (
          <div className="acoes-buttons">
            <button 
              onClick={gerarEscala} 
              className="btn-regenerar"
              disabled={gerandoEscala}
            >
              {gerandoEscala ? 'Regenerando...' : '🔄 Regenerar Escala'}
            </button>
            <button 
              onClick={deletarEscalaMes} 
              className="btn-deletar-mes"
            >
              🗑️ Deletar Escala do Mês
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Carregando escala...</div>
      ) : (
        <>
          {temEscala && escalas.length > 0 && (
            <div className="escala-info">
              <p>
                <strong>Escala gerada:</strong> {escalas.length} dias | 
                <strong> PRETA:</strong> {escalas.filter(e => e.tipo_escala === 'PRETA').length} dias | 
                <strong> VERMELHA:</strong> {escalas.filter(e => e.tipo_escala === 'VERMELHA').length} dias
              </p>
            </div>
          )}
          {renderizarCalendario()}
        </>
      )}

      {/* Modal de Troca */}
      {modalAberto && escalaSelecionada && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Trocar Escala</h3>
              <button className="modal-fechar" onClick={fecharModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-info">
                <p>
                  <strong>Data:</strong>{' '}
                  {new Date(escalaSelecionada.data).toLocaleDateString('pt-BR')}
                </p>
                <p>
                  <strong>Tipo:</strong> {escalaSelecionada.tipo_escala}
                </p>
                <p>
                  <strong>Agendado:</strong>{' '}
                  {escalaSelecionada.militar_agendado?.nome_guerra || 'N/A'}
                </p>
                <p>
                  <strong>Executando:</strong>{' '}
                  {escalaSelecionada.militar_executado?.nome_guerra || 'N/A'}
                </p>
              </div>

              <div className="modal-form">
                <label>
                  Militar Substituto:
                  <select
                    value={militarSubstitutoId}
                    onChange={(e) => setMilitarSubstitutoId(e.target.value)}
                  >
                    <option value="">Selecione um militar</option>
                    {militares.map((militar) => (
                      <option key={militar.id} value={militar.id}>
                        {militar.nome_guerra} ({militar.pg})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Justificativa:
                  <textarea
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                    placeholder="Ex: Troca com Fulano, Reforço, Força Maior..."
                    rows={3}
                  />
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={fecharModal}>Cancelar</button>
              <button onClick={salvarTroca} className="btn-salvar">
                Salvar Troca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarioEscala

