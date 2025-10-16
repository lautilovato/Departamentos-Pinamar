interface User {
  id: number;
  email: string;
  nombre: string;
  role: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

class AuthService {
  private baseUrl = 'http://localhost:3000';

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }

    return response.json();
  }

  async getProfile(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el perfil');
    }

    return response.json();
  }

  saveAuth(user: User, token: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): User | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  // Método para hacer requests autenticados
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });
  }

  // Métodos específicos para reservas request
  async getReservasRequest(): Promise<any[]> {
    const response = await this.authenticatedRequest('/reservas-request');
    if (!response.ok) throw new Error('Error al cargar reservas request');
    return response.json();
  }

  async aprobarReservaRequest(id: number): Promise<any> {
    const response = await this.authenticatedRequest(`/reservas-request/${id}/aprobar`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Error al aprobar reserva');
    return response.json();
  }

  async rechazarReservaRequest(id: number, motivoRechazo: string): Promise<any> {
    const response = await this.authenticatedRequest(`/reservas-request/${id}/rechazar`, {
      method: 'PATCH',
      body: JSON.stringify({ motivoRechazo })
    });
    if (!response.ok) throw new Error('Error al rechazar reserva');
    return response.json();
  }
}

export const authService = new AuthService();
export type { User, LoginResponse };