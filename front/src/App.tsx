import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { apiService } from './services/api'
import Home from './Home'
import DevPage from './DevPage'
import Layout from './components/layout/Layout';
import Reservas from './reservas/Reservas';
import AdminPanel from './dashboard/AdminPanel'
import AdminLogin from './dashboard/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'

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
          error: 'Error conectando con el backend. Verifica la URL de la API (VITE_API_URL) y que el servidor esté en ejecución.'
        })
      }
    }

    testBackendConnection()
  }, [])

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rutas públicas con layout (navbar y footer) */}
          <Route element={<Layout />}> 
            <Route path="/" element={<Home />} />
            <Route path="/dev" element={<DevPage backendStatus={backendStatus} />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Página no encontrada</h2>
                <p>La página que buscas no existe.</p>
                <Link to="/">Volver al inicio</Link>
              </div>
            } />
          </Route>

          {/* Rutas de administración sin layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
