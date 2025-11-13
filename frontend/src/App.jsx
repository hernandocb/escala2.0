import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CalendarioEscala from './CalendarioEscala'
import Militares from './pages/Militares'
import Feriados from './pages/Feriados'
import Excecoes from './pages/Excecoes'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<CalendarioEscala />} />
            <Route path="/militares" element={<Militares />} />
            <Route path="/feriados" element={<Feriados />} />
            <Route path="/excecoes" element={<Excecoes />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

