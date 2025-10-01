import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { apiService } from './services/api'
import Home from './Home'
import DevPage from './DevPage'

interface BackendStatus {
  message: string;
  health: any;
  loading: boolean;
  error: string | null;
}

function App() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    message: '',
    health: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        setBackendStatus(prev => ({ ...prev, loading: true, error: null }))
        
        const welcomeMessage = await apiService.getWelcomeMessage()
        const healthStatus = await apiService.checkHealth()
        
        setBackendStatus({
          message: welcomeMessage,
          health: healthStatus,
          loading: false,
          error: null
        })
      } catch (error) {
        setBackendStatus({
          message: '',
          health: null,
          loading: false,
          error: 'Error conectando con el backend. Asegúrate de que el servidor esté ejecutándose en http://localhost:3000'
        })
      }
    }

    testBackendConnection()
  }, [])

  return (
    <Router>
      <div className="app">
        {/* Navegación de desarrollo */}
        <nav style={{ 
          padding: '10px 20px', 
          background: '#f8f9fa', 
          borderBottom: '1px solid #dee2e6',
          marginBottom: '0'
        }}>
          <Link 
            to="/" 
            style={{ 
              marginRight: '15px', 
              textDecoration: 'none', 
              padding: '8px 16px',
              borderRadius: '5px',
              background: '#007bff',
              color: 'white',
              fontSize: '14px'
            }}
          >
            🏠 Home
          </Link>
          <Link 
            to="/dev" 
            style={{ 
              textDecoration: 'none', 
              padding: '8px 16px',
              borderRadius: '5px',
              background: '#6c757d',
              color: 'white',
              fontSize: '14px'
            }}
          >
            🔧 Dev Status
          </Link>
        </nav>

        {/* Definición de todas las rutas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dev" element={<DevPage backendStatus={backendStatus} />} />
          
          {/* Rutas futuras */}
          {/* <Route path="/departamentos" element={<Departamentos />} /> */}
          {/* <Route path="/servicios" element={<Servicios />} /> */}
          {/* <Route path="/contacto" element={<Contacto />} /> */}
          {/* <Route path="/departamento/:id" element={<DepartamentoDetalle />} /> */}
          
          {/* Ruta 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>Página no encontrada</h2>
              <p>La página que buscas no existe.</p>
              <Link to="/">Volver al inicio</Link>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
