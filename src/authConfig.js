export const msalConfig = {
  auth: {
    // Reemplaza "TU_CLIENT_ID" por el ID real de Azure que te pase tu equipo
    clientId: "TU_CLIENT_ID", 

    // Si usan un Tenant específico, cámbialo a: "https://login.microsoftonline.com/TU_TENANT_ID"
    authority: "https://login.microsoftonline.com/common", 

    redirectUri: window.location.origin // Detecta automáticamente http://localhost:5173
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

// Permisos iniciales requeridos
export const loginRequest = {
  scopes: ["User.Read"],
  prompt: "select_account" // <--- OBLIGA A MICROSOFT A PREGUNTAR CON QUÉ CUENTA INICIAR
};
