import axios from 'axios';

// Cache para evitar múltiplos redirecionamentos
let isRedirecting = false;

// Tempo mínimo entre redirecionamentos (em milissegundos)
const REDIRECT_COOLDOWN = 5000;
let lastRedirectTime = 0;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api-ecliptica.onrender.com/api',
  timeout: 10000,
  withCredentials: true,
  
  
  // Adicione esta configuração para prevenir transformação automática
  transformRequest: [
    function (data, headers) {
      // Se for FormData, não transforme e deixe o axios lidar com os headers
      if (data instanceof FormData) {
        return data;
      }
      
      // Para outros tipos de dados, transforme em JSON
      if (typeof data === 'object') {
        headers['Content-Type'] = 'application/json';
        return JSON.stringify(data);
      }
      
      return data;
    }
  ]
});
  
// Interceptor para adicionar o token de autorização, se disponível
// Interceptor para adicionar Headers comuns
api.interceptors.request.use(config => {
  // Não mexa nos headers para FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  // Não precisamos adicionar o token manualmente porque o cookie HTTP-only
  // será enviado automaticamente em todas as requisições devido ao withCredentials: true
  
  return config;
});

// Interceptor de resposta para tratamento de erros
// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    // Logs para depuração
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
    
    // Tratamento de erros de autenticação (401)
    if (error.response?.status === 401) {
      // Verifica se já estamos na página de login para evitar loops
      const isLoginPage = window.location.pathname === '/login';
      const currentTime = Date.now();
      
      // Evita redirecionamentos em cascata ou muito frequentes
      if (!isLoginPage && !isRedirecting && (currentTime - lastRedirectTime > REDIRECT_COOLDOWN)) {
        isRedirecting = true;
        lastRedirectTime = currentTime;
        
        console.log('Sessão expirada. Redirecionando para login...');
        
        // Usa setTimeout para garantir que o redirecionamento aconteça após a conclusão
        // de outras operações pendentes
        setTimeout(() => {
          window.location.href = '/login';
          // Reseta a flag após o redirecionamento
          setTimeout(() => {
            isRedirecting = false;
          }, 1000);
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);
export default api;