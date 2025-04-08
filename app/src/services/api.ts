import axios from 'axios';

// Cache para evitar múltiplos redirecionamentos
let isRedirecting = false;

// Tempo mínimo entre redirecionamentos (em milissegundos)
const REDIRECT_COOLDOWN = 5000;
let lastRedirectTime = 0;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3232/api',
  timeout: 10000, // 10 segundos
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para adicionar o token de autorização, se disponível
api.interceptors.request.use(
  config => {
    // Verifica se não estamos no processo de login/registro (que não precisa de token)
    const isAuthEndpoint = config.url?.includes('/auth/login') || 
                          config.url?.includes('/auth/register');
    
    if (!isAuthEndpoint) {
      // Recupera o token do storage (pode ser adaptado para sua estrutura)
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const { state } = JSON.parse(authData);
          if (state.tokenData?.token) {
            // Verifica se o token está expirado
            if (state.tokenData.expiresAt && Date.now() < state.tokenData.expiresAt) {
              config.headers.Authorization = `Bearer ${state.tokenData.token}`;
            } else {
              // Se o token estiver expirado, podemos limpar o storage aqui
              // mas sem redirecionar para evitar loops durante requests paralelos
              console.warn('Token expirado detectado no interceptor de requisição');
            }
          }
        } catch (error) {
          console.error('Erro ao processar token:', error);
        }
      }
    }
    
    return config;
  },
  error => Promise.reject(error)
);

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
        
        // Limpa os dados de autenticação primeiro
        try {
          // Limpa o storage
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            const data = JSON.parse(authStorage);
            // Mantém outras configurações, mas remove user e tokenData
            data.state = { 
              ...data.state,
              user: null,
              tokenData: null
            };
            localStorage.setItem('auth-storage', JSON.stringify(data));
          }
          
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
          
        } catch (e) {
          console.error('Erro ao limpar dados de autenticação:', e);
          isRedirecting = false;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;