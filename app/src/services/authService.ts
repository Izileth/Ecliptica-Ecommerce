import api from './api'
import type { User } from './type'

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  user?: User // Não precisa mais do token, pois ele está sendo armazenado no cookie HttpOnly
}
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true // Confirme que está true
    });

    if (!response.data.user) {
      throw new Error('Resposta da API não contém dados do usuário');
    }

    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};
export const logout = async (): Promise<void> => {
  await api.post('auth/logout');
};

export const register = async (userData: { 
  name: string; 
  email: string; 
  password: string 
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/users/register', userData);
  return response.data;
};
