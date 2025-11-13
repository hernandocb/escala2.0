import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Escala 2.0</h1>
      </div>
      <div className="navbar-menu">
        <Link to="/" className={isActive('/')}>
          Calendário
        </Link>
        <Link to="/militares" className={isActive('/militares')}>
          Militares
        </Link>
        <Link to="/feriados" className={isActive('/feriados')}>
          Feriados
        </Link>
        <Link to="/excecoes" className={isActive('/excecoes')}>
          Exceções
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

