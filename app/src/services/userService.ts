// src/services/authUserService.ts
import api from './api';
import type { User } from './type';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export const AuthUserService = {
  /**
   * Autenticação
   */
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials, {
        withCredentials: true
      });
      
      if (!response.data?.user) {
        throw new Error('Dados do usuário não retornados pela API');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Erro durante o login';
      throw new Error(errorMessage);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Erro durante logout:', error);
      // Não lançar erro para não impedir o logout local
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/users/register', userData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Erro durante o registro';
      throw new Error(errorMessage);
    }
  },

  /**
   * Gestão do Perfil
   */
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/users/profile');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || 'Erro ao carregar perfil';
      throw new Error(errorMessage);
    }
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    try {
      const response = await api.put<User>('/users/profile', data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || 'Erro ao atualizar perfil';
      
      // Tratamento especial para erro de email duplicado
      if (error.response?.status === 409) {
        throw new Error('Este email já está em uso por outro usuário');
      }
      
      throw new Error(errorMessage);
    }
  },

  updatePassword: async (data: PasswordUpdateData): Promise<void> => {
    try {
      await api.put('/users/profile/password', data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || 'Erro ao atualizar senha';
      
      // Tratamento especial para senha atual incorreta
      if (error.response?.status === 400) {
        throw new Error('Senha atual incorreta');
      }
      
      throw new Error(errorMessage);
    }
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao solicitar redefinição de senha');
    }
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<void> => {
    try {
      await api.post('/auth/reset-password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
    }
  },

  /**
   * Admin-only
   */
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || 'Erro ao buscar usuários';
      throw new Error(errorMessage);
    }
  },

  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || 'Usuário não encontrado';
      throw new Error(errorMessage);
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || 'Erro ao excluir usuário';
      throw new Error(errorMessage);
    }
  }
};