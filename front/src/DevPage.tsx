import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface BackendStatus {
  message: string;
  health: any;
  loading: boolean;
  error: string | null;
}

interface DevPageProps {
  backendStatus: BackendStatus;
}

function DevPage({ backendStatus }: DevPageProps) {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Departamentos Pinamar</h1>
      <h2>React + Vite + NestJS + PostgreSQL</h2>
      
      {/* Estado de conexión con el backend */}
      <div className="card">
        <h3>Estado del Backend:</h3>
        {backendStatus.loading && <p>🔄 Conectando con el backend...</p>}
        {backendStatus.error && (
          <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px', margin: '10px 0' }}>
            <p>❌ Error: {backendStatus.error}</p>
            <p>Para iniciar el backend ejecuta: <code>cd back && yarn start:dev</code></p>
          </div>
        )}
        {!backendStatus.loading && !backendStatus.error && (
          <div style={{ color: 'green', padding: '10px', border: '1px solid green', borderRadius: '5px', margin: '10px 0' }}>
            <p>✅ Backend conectado correctamente</p>
            <p><strong>Mensaje:</strong> {backendStatus.message}</p>
            <p><strong>Health Check:</strong> {backendStatus.health?.status} - {backendStatus.health?.message}</p>
            <p><strong>Timestamp:</strong> {backendStatus.health?.timestamp}</p>
          </div>
        )}
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Proyecto Full Stack: Frontend (React + Vite) ↔ Backend (NestJS + PostgreSQL)
      </p>
    </>
  )
}

export default DevPage