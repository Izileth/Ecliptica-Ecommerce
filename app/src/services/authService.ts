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
    const response = await api.post<AuthResponse>('auth/login', credentials);
    
    if (!response.data.user) {
      throw new Error('Usuário não encontrado na resposta');
    }

    // Retorna apenas o usuário, pois o token já está no cookie HttpOnly
    return {
      user: response.data.user || {
        id: 'temp-id',
        name: credentials.email.split('@')[0] || 'Usuário',
        email: credentials.email,
        isAdmin: false
      }
    };
  } catch (error: any) {
    // Preserva a mensagem de erro original quando disponível
    if (error.response) {
      throw error; // Passa o erro completo para a store
    } else {
      throw new Error('Serviço indisponível. Tente novamente mais tarde.');
    }
  }
};

export const register = async (userData: { 
  name: string; 
  email: string; 
  password: string 
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/users/register', userData);
  return response.data;
};
