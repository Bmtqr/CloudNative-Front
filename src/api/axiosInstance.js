import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';


import { msalConfig, apiRequest } from '../authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

const api = axios.create({
  baseURL: 'https://mxw86gy6c3.execute-api.us-east-1.amazonaws.com/api',

  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  async (config) => {
    await msalInstance.initialize();

    const accounts = msalInstance.getAllAccounts();
    
    if (accounts.length > 0) {
      try {

        const response = await msalInstance.acquireTokenSilent({
          ...apiRequest,
          account: accounts[0],
        });
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