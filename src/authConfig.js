export const msalConfig = {
  auth: {
    clientId: "a4c9aac0-2590-4e9b-baab-31ac26dc6e47", 
    authority: "https://login.microsoftonline.com/03bb15ff-2ba9-4e00-8ebd-10c0986f5c28", 
    redirectUri: window.location.origin
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  }
};

// login en microsoft
export const loginRequest = {
  scopes: ["User.Read"],
  prompt: "select_account"
};

// pide el token para mandarlo al api gateway
export const apiRequest = {
  scopes: ["api://e07cac17-7005-4a0b-87ff-45971efefb1f/access_as_user"]
};