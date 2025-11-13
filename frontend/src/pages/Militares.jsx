import { useState, useEffect } from 'react'
import './Militares.css'

const API_URL = 'http://localhost:8000'

function Militares() {
  const [militares, setMilitares] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [militarEditando, setMilitarEditando] = useState(null)
  const [formData, setFormData] = useState({
    pg: 'ASP',
    nome_completo: '',
    nome_guerra: '',
    data_ultima_promocao: '',
    data_inicio_escala: '',
    status: 'ATIVO'
  })

  useEffect(() => {
    buscarMilitares()
  }, [])

  const buscarMilitares = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/militares`)
      if (!response.ok) throw new Error('Erro ao buscar militares')
      const data = await response.json()
      setMilitares(data)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao buscar militares')
    } finally {
      setLoading(false)
    }
  }

  const abrirModalNovo = () => {
    setMilitarEditando(null)
    setFormData({
      pg: 'ASP',
      nome_completo: '',
      nome_guerra: '',
      data_ultima_promocao: '',
      data_inicio_escala: '',
      status: 'ATIVO'
    })
    setModalAberto(true)
  }

  const abrirModalEditar = (militar) => {
    setMilitarEditando(militar)
    setFormData({
      pg: militar.pg,
      nome_completo: militar.nome_completo,
      nome_guerra: militar.nome_guerra,
      data_ultima_promocao: militar.data_ultima_promocao,
      data_inicio_escala: militar.data_inicio_escala,
      status: militar.status
    })
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setMilitarEditando(null)
  }

  const salvarMilitar = async () => {
    if (!formData.nome_completo || !formData.nome_guerra || !formData.data_ultima_promocao || !formData.data_inicio_escala) {
      alert('Preencha todos os campos!')
      return
    }

    try {
      const url = militarEditando 
        ? `${API_URL}/militares/${militarEditando.id}`
        : `${API_URL}/militares`
      const method = militarEditando ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Erro ao salvar')
      }

      await buscarMilitares()
      fecharModal()
      alert(militarEditando ? 'Militar atualizado!' : 'Militar criado!')
    } catch (error) {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao salvar militar')
    }
  }

  return (
    <div className="militares-page">
      <div className="page-header">
        <h2>Gerenciar Militares</h2>
        <button onClick={abrirModalNovo} className="btn-primary">
          + Novo Militar
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="militares-table">
          <table>
            <thead>
              <tr>
                <th>PG</th>
                <th>Nome Guerra</th>
                <th>Nome Completo</th>
                <th>Data Promoção</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {militares.map((militar) => (
                <tr key={militar.id}>
                  <td>{militar.pg}</td>
                  <td><strong>{militar.nome_guerra}</strong></td>
                  <td>{militar.nome_completo}</td>
                  <td>{new Date(militar.data_ultima_promocao).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`status-badge ${militar.status.toLowerCase()}`}>
                      {militar.status}
                    </span>
                  </td>
                  <td>
                    <div className="acoes-cell">
                      <button 
                        onClick={() => abrirModalEditar(militar)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{militarEditando ? 'Editar' : 'Novo'} Militar</h3>
              <button className="modal-fechar" onClick={fecharModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Posto/Graduação</label>
                <select 
                  value={formData.pg} 
                  onChange={(e) => setFormData({...formData, pg: e.target.value})}
                >
                  <option value="ASP">ASP</option>
                  <option value="TEN2">TEN2</option>
                  <option value="TEN1">TEN1</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Nome Guerra</label>
                <input
                  type="text"
                  value={formData.nome_guerra}
                  onChange={(e) => setFormData({...formData, nome_guerra: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Data Última Promoção</label>
                <input
                  type="date"
                  value={formData.data_ultima_promocao}
                  onChange={(e) => setFormData({...formData, data_ultima_promocao: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Data Início Escala</label>
                <input
                  type="date"
                  value={formData.data_inicio_escala}
                  onChange={(e) => setFormData({...formData, data_inicio_escala: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="FERIAS">FERIAS</option>
                  <option value="BAIXADO">BAIXADO</option>
                  <option value="MISSAO">MISSAO</option>
                  <option value="DISPENSA">DISPENSA</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={fecharModal}>Cancelar</button>
              <button onClick={salvarMilitar} className="btn-salvar">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Militares

