import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Importaciones de MSAL
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig.js';

// Crear la instancia de MSAL
const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
)