// src/services/UserService.ts
import api from './api';
import type { User } from './type';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends Omit<User, 'id' | 'isAdmin'> {
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
}

export const UserService = {
  /**
   * Autentica um usuário
   */
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error('Credenciais inválidas ou serviço indisponível');
    }
  },

  /**
   * Registra um novo usuário
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/users/register', userData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao registrar usuário';
      throw new Error(errorMessage);
    }
  },

  /**
   * Atualiza o perfil do usuário
   */
  updateProfile: async (userId: string, data: UpdateProfileData): Promise<User> => {
    try {
      const response = await api.put<User>(`/users/${userId}/profile`, data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil';
      throw new Error(errorMessage);
    }
  },

  /**
   * Busca todos os usuários (apenas admin)
   */
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar usuários');
    }
  },

  /**
   * Busca um usuário por ID
   */
  getById: async (userId: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Usuário não encontrado');
    }
  },

  /**
   * Deleta um usuário
   */
  delete: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      throw new Error('Erro ao excluir usuário');
    }
  },

  /**
   * Atualiza a senha do usuário
   */
  updatePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.put(`/users/${userId}/password`, { currentPassword, newPassword });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar senha';
      throw new Error(errorMessage);
    }
  }
};