import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './AdminDashboard.css';

interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
}

interface User {
  id: number;
  email: string;
  nombre: string;
  role: string;
  createdAt: string;
}

interface ReservaRequest {
  id: number;
  cliente: string;
  numeroTel: string;
  fechaInicio: string;
  fechaFin: string;
  departamentoId: number;
  estado: string;
  fechaSolicitud: string;
  reservaId?: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reservasRequest, setReservasRequest] = useState<ReservaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const navigate = useNavigate();
  const currentUser = authService.getUser();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas
      const statsResponse = await authService.authenticatedRequest('/admin/dashboard');
      if (!statsResponse.ok) throw new Error('Error al cargar estadísticas');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Cargar usuarios
      const usersResponse = await authService.authenticatedRequest('/admin/users');
      if (!usersResponse.ok) throw new Error('Error al cargar usuarios');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Cargar reservas request
      const reservasData = await authService.getReservasRequest();
      setReservasRequest(reservasData);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    try {
      const response = await authService.authenticatedRequest(`/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar usuario');

      // Recargar datos
      await loadDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al eliminar usuario');
    }
  };

  const aprobarReserva = async (id: number) => {
    try {
      setActionLoading(id);
      await authService.aprobarReservaRequest(id);
      await loadDashboardData(); // Recargar datos
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al aprobar reserva');
    } finally {
      setActionLoading(null);
    }
  };

  const rechazarReserva = async (id: number) => {
    const motivoRechazo = prompt('Ingresa el motivo del rechazo:');
    if (!motivoRechazo) return;

    try {
      setActionLoading(id);
      await authService.rechazarReservaRequest(id, motivoRechazo);
      await loadDashboardData(); // Recargar datos
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al rechazar reserva');
    } finally {
      setActionLoading(null);
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'status-pending';
      case 'aprobada': return 'status-approved';
      case 'rechazada': return 'status-rejected';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner-large"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Administración</h1>
          <div className="user-info">
            <span>Bienvenido, {currentUser?.nombre}</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={loadDashboardData}>Reintentar</button>
          </div>
        )}

        {/* Estadísticas */}
        {stats && (
          <section className="stats-section">
            <h2>Estadísticas del Sistema</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total de Usuarios</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👑</div>
                <div className="stat-content">
                  <h3>{stats.adminUsers}</h3>
                  <p>Administradores</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-content">
                  <h3>{stats.regularUsers}</h3>
                  <p>Usuarios Regulares</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h3>{reservasRequest.filter(r => r.estado === 'pendiente').length}</h3>
                  <p>Solicitudes Pendientes</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Gestión de Reservas Request */}
        <section className="reservas-section">
          <div className="section-header">
            <h2>Gestión de Solicitudes de Reserva</h2>
            <div className="status-filters">
              <span className="filter-info">
                {reservasRequest.filter(r => r.estado === 'pendiente').length} pendientes
              </span>
            </div>
          </div>

          <div className="reservas-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Departamento</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Fecha Solicitud</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasRequest.map(reserva => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.cliente}</td>
                    <td>{reserva.numeroTel}</td>
                    <td>Depto {reserva.departamentoId}</td>
                    <td>{new Date(reserva.fechaInicio).toLocaleDateString()}</td>
                    <td>{new Date(reserva.fechaFin).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${getEstadoBadgeClass(reserva.estado)}`}>
                        {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(reserva.fechaSolicitud).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        {reserva.estado === 'pendiente' && (
                          <>
                            <button 
                              onClick={() => aprobarReserva(reserva.id)}
                              className="approve-btn"
                              disabled={actionLoading === reserva.id}
                              title="Aprobar solicitud"
                            >
                              {actionLoading === reserva.id ? '⏳' : '✅'}
                            </button>
                            <button 
                              onClick={() => rechazarReserva(reserva.id)}
                              className="reject-btn"
                              disabled={actionLoading === reserva.id}
                              title="Rechazar solicitud"
                            >
                              {actionLoading === reserva.id ? '⏳' : '❌'}
                            </button>
                          </>
                        )}
                        {reserva.estado !== 'pendiente' && (
                          <span className="no-actions">
                            {reserva.estado === 'aprobada' ? 'Procesada' : 'Rechazada'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservasRequest.length === 0 && (
              <div className="empty-state">
                <p>No hay solicitudes de reserva</p>
              </div>
            )}
          </div>
        </section>

        {/* Lista de usuarios */}
        <section className="users-section">
          <div className="section-header">
            <h2>Gestión de Usuarios</h2>
            <button className="create-user-btn">
              + Crear Usuario
            </button>
          </div>

          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        {user.id !== currentUser?.id && (
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="delete-btn"
                            title="Eliminar usuario"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;