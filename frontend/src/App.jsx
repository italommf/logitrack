import { useEffect, useState } from 'react'
import { api } from './api'
import Dashboard from './components/Dashboard'
import Viagens from './components/Viagens'

export default function App() {
  const [aba, setAba] = useState('dashboard')
  const [veiculos, setVeiculos] = useState([])
  const [erro, setErro] = useState('')

  // Roda uma vez ao abrir a página: pega o cookie CSRF e a lista de veículos.
  useEffect(() => {
    api.iniciar()
      .then(() => api.listarVeiculos())
      .then(setVeiculos)
      .catch(() => setErro('Não foi possível conectar ao backend.'))
  }, [])

  return (
    <>
      <header className="topo">
        <h1>LogiTrack Pro</h1>
        <nav>
          <button className={aba === 'dashboard' ? 'ativa' : ''} onClick={() => setAba('dashboard')}>
            Dashboard
          </button>
          <button className={aba === 'viagens' ? 'ativa' : ''} onClick={() => setAba('viagens')}>
            Viagens
          </button>
        </nav>
      </header>

      <main>
        {erro && <p className="alerta">{erro}</p>}
        {aba === 'dashboard' ? <Dashboard veiculos={veiculos} /> : <Viagens veiculos={veiculos} />}
      </main>
    </>
  )
}
