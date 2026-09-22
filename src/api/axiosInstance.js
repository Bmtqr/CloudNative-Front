import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
<<<<<<< HEAD
import { msalConfig, loginRequest } from '../authConfig';

// Instancia de MSAL para obtener el token en segundo plano
const msalInstance = new PublicClientApplication(msalConfig);

// Crear la instancia de Axios apuntando al puerto de tu MS-BFF
const api = axios.create({
  baseURL: 'http://localhost:18080/api', // Puerto del BFF
=======
import { msalConfig, apiRequest } from '../authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

const api = axios.create({
  baseURL: 'https://mxw86gy6c3.execute-api.us-east-1.amazonaws.com/api',
>>>>>>> aws
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< HEAD
// Interceptor: Se ejecuta ANTES de que cualquier petición salga hacia el backend
api.interceptors.request.use(
  async (config) => {
    // Inicializar MSAL si aún no se ha inicializado
=======
api.interceptors.request.use(
  async (config) => {
>>>>>>> aws
    await msalInstance.initialize();

    const accounts = msalInstance.getAllAccounts();
    
    if (accounts.length > 0) {
      try {
<<<<<<< HEAD
        // Intenta obtener el token guardado en caché/sesión
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        // Adjunta el JWT token en las cabeceras
=======
        const response = await msalInstance.acquireTokenSilent({
          ...apiRequest,
          account: accounts[0],
        });

>>>>>>> aws
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