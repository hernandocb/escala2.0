import { useState, useEffect } from 'react'
import './Excecoes.css'

const API_URL = 'http://localhost:8000'

function Excecoes() {
  const [excecoes, setExcecoes] = useState([])
  const [militares, setMilitares] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [formData, setFormData] = useState({
    militar_id: '',
    motivo: 'FERIAS',
    data_inicio: '',
    data_fim: ''
  })

  useEffect(() => {
    buscarExcecoes()
    buscarMilitares()
  }, [])

  const buscarExcecoes = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/excecoes`)
      if (!response.ok) throw new Error('Erro ao buscar exceções')
      const data = await response.json()
      setExcecoes(data)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao buscar exceções')
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
      console.error('Erro:', error)
    }
  }

  const abrirModalNovo = () => {
    setFormData({
      militar_id: '',
      motivo: 'FERIAS',
      data_inicio: '',
      data_fim: ''
    })
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
  }

  const salvarExcecao = async () => {
    if (!formData.militar_id || !formData.data_inicio || !formData.data_fim) {
      alert('Preencha todos os campos!')
      return
    }

    try {
      const response = await fetch(`${API_URL}/excecoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          militar_id: parseInt(formData.militar_id)
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Erro ao salvar')
      }

      await buscarExcecoes()
      fecharModal()
      alert('Exceção criada!')
    } catch (error) {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao salvar exceção')
    }
  }

  const deletarExcecao = async (id) => {
    if (!confirm('Deseja realmente deletar esta exceção?')) return

    try {
      const response = await fetch(`${API_URL}/excecoes/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao deletar')

      await buscarExcecoes()
      alert('Exceção deletada!')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao deletar exceção')
    }
  }

  const getMilitarNome = (militarId) => {
    const militar = militares.find(m => m.id === militarId)
    return militar ? `${militar.nome_guerra} (${militar.pg})` : 'N/A'
  }

  return (
    <div className="excecoes-page">
      <div className="page-header">
        <h2>Gerenciar Exceções</h2>
        <button onClick={abrirModalNovo} className="btn-primary">
          + Nova Exceção
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="excecoes-list">
          {excecoes.length === 0 ? (
            <div className="empty-state">Nenhuma exceção cadastrada</div>
          ) : (
            excecoes.map((excecao) => (
              <div key={excecao.id} className="excecao-card">
                <div className="excecao-info">
                  <div className="excecao-militar">
                    <strong>{getMilitarNome(excecao.militar_id)}</strong>
                  </div>
                  <div className="excecao-detalhes">
                    <span className="excecao-motivo">{excecao.motivo}</span>
                    <span className="excecao-periodo">
                      {new Date(excecao.data_inicio).toLocaleDateString('pt-BR')} até{' '}
                      {new Date(excecao.data_fim).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deletarExcecao(excecao.id)}
                  className="btn-delete"
                >
                  Deletar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nova Exceção</h3>
              <button className="modal-fechar" onClick={fecharModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Militar</label>
                <select
                  value={formData.militar_id}
                  onChange={(e) => setFormData({...formData, militar_id: e.target.value})}
                >
                  <option value="">Selecione um militar</option>
                  {militares.map((militar) => (
                    <option key={militar.id} value={militar.id}>
                      {militar.nome_guerra} ({militar.pg})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Motivo</label>
                <select
                  value={formData.motivo}
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                >
                  <option value="FERIAS">Férias</option>
                  <option value="MISSAO">Missão</option>
                  <option value="DISPENSA">Dispensa</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data Início</label>
                <input
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Data Fim</label>
                <input
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={fecharModal}>Cancelar</button>
              <button onClick={salvarExcecao} className="btn-salvar">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Excecoes

