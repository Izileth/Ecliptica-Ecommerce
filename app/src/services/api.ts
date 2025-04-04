import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3232/api',
  timeout: 10000, // Aumente para 10 segundos
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout - servidor demorou muito para responder');
    }
    
    if (error.response) {
      console.error('Erro detalhado:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;