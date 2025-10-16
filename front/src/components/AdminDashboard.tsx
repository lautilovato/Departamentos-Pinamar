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

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
            </div>
          </section>
        )}

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