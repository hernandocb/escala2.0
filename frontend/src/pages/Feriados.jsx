import { useState, useEffect } from 'react'
import './Feriados.css'

const API_URL = 'http://localhost:8000'

function Feriados() {
  const [feriados, setFeriados] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [formData, setFormData] = useState({
    data: '',
    descricao: ''
  })

  useEffect(() => {
    buscarFeriados()
  }, [])

  const buscarFeriados = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/feriados`)
      if (!response.ok) throw new Error('Erro ao buscar feriados')
      const data = await response.json()
      setFeriados(data)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao buscar feriados')
    } finally {
      setLoading(false)
    }
  }

  const abrirModalNovo = () => {
    setFormData({ data: '', descricao: '' })
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
  }

  const salvarFeriado = async () => {
    if (!formData.data || !formData.descricao.trim()) {
      alert('Preencha todos os campos!')
      return
    }

    try {
      const response = await fetch(`${API_URL}/feriados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Erro ao salvar')
      }

      await buscarFeriados()
      fecharModal()
      alert('Feriado criado!')
    } catch (error) {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao salvar feriado')
    }
  }

  const deletarFeriado = async (id) => {
    if (!confirm('Deseja realmente deletar este feriado?')) return

    try {
      const response = await fetch(`${API_URL}/feriados/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao deletar')

      await buscarFeriados()
      alert('Feriado deletado!')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao deletar feriado')
    }
  }

  return (
    <div className="feriados-page">
      <div className="page-header">
        <h2>Gerenciar Feriados</h2>
        <button onClick={abrirModalNovo} className="btn-primary">
          + Novo Feriado
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="feriados-list">
          {feriados.length === 0 ? (
            <div className="empty-state">Nenhum feriado cadastrado</div>
          ) : (
            feriados.map((feriado) => (
              <div key={feriado.id} className="feriado-card">
                <div className="feriado-info">
                  <div className="feriado-data">
                    {new Date(feriado.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="feriado-descricao">{feriado.descricao}</div>
                </div>
                <button
                  onClick={() => deletarFeriado(feriado.id)}
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
              <h3>Novo Feriado</h3>
              <button className="modal-fechar" onClick={fecharModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Ex: Natal, Ano Novo, etc."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={fecharModal}>Cancelar</button>
              <button onClick={salvarFeriado} className="btn-salvar">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Feriados

