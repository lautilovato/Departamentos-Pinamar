import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Crear instancia de axios con configuración base
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para requests (opcional - para agregar tokens, logs, etc)
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar tokens de autenticación si los necesitas
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses (opcional - para manejo de errores globales)
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Funciones de API específicas
export const apiService = {
  // Función para verificar la salud del backend
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking backend health:', error);
      throw error;
    }
  },

  // Función para obtener el mensaje de bienvenida
  getWelcomeMessage: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error getting welcome message:', error);
      throw error;
    }
  },

  // Funciones para reservas
  reservas: {
    // Obtener todas las reservas
    getAll: async () => {
      try {
        const response = await api.get('/reservas');
        return response.data;
      } catch (error) {
        console.error('Error obteniendo reservas:', error);
        throw error;
      }
    },

    // Obtener reservas por estado
    getByEstado: async (estado: string) => {
      try {
        const response = await api.get(`/reservas?estado=${estado}`);
        return response.data;
      } catch (error) {
        console.error('Error obteniendo reservas por estado:', error);
        throw error;
      }
    },

    // Confirmar reserva
    confirmar: async (id: number) => {
      try {
        const response = await api.patch(`/reservas/${id}/confirmar`);
        return response.data;
      } catch (error) {
        console.error('Error confirmando reserva:', error);
        throw error;
      }
    },

    // Rechazar reserva
    rechazar: async (id: number) => {
      try {
        const response = await api.patch(`/reservas/${id}/rechazar`);
        return response.data;
      } catch (error) {
        console.error('Error rechazando reserva:', error);
        throw error;
      }
    },

    // Crear nueva reserva
    create: async (reservaData: any) => {
      try {
        const response = await api.post('/reservas', reservaData);
        return response.data;
      } catch (error) {
        console.error('Error creando reserva:', error);
        throw error;
      }
    }
  }
};