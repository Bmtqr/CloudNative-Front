import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../authConfig';

// Instancia de MSAL para obtener el token en segundo plano
const msalInstance = new PublicClientApplication(msalConfig);

// Crear la instancia de Axios apuntando al puerto de tu MS-BFF
const api = axios.create({
  baseURL: 'http://localhost:18080/api', // Puerto del BFF
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Se ejecuta ANTES de que cualquier petición salga hacia el backend
api.interceptors.request.use(
  async (config) => {
    // Inicializar MSAL si aún no se ha inicializado
    await msalInstance.initialize();

    const accounts = msalInstance.getAllAccounts();
    
    if (accounts.length > 0) {
      try {
        // Intenta obtener el token guardado en caché/sesión
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        // Adjunta el JWT token en las cabeceras
        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error('Error al obtener el token silenciosamente:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;