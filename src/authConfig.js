export const msalConfig = {
  auth: {
    // Reemplaza "TU_CLIENT_ID" por el ID real de Azure que te pase tu equipo
    clientId: "a4c9aac0-2590-4e9b-baab-31ac26dc6e47", 

    // Si usan un Tenant específico, cámbialo a: "https://login.microsoftonline.com/TU_TENANT_ID"
    authority: "https://login.microsoftonline.com/03bb15ff-2ba9-4e00-8ebd-10c0986f5c28", 

    redirectUri: window.location.origin // Detecta automáticamente http://localhost:5173
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

// Permisos iniciales requeridos
export const loginRequest = {
  scopes: [
    "User.Read",
    "api://e07cac17-7005-4a0b-87ff-45971efefb1f/access_as_user"
  ],
  prompt: "select_account" // <--- OBLIGA A MICROSOFT A PREGUNTAR CON QUÉ CUENTA INICIAR
};
