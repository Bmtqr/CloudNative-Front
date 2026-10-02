import { jwtDecode } from "jwt-decode";
import { apiRequest } from "../authConfig"; 

export const fetchUserRoles = async (instance, account) => {
  if (!account) return [];

  try {
    const response = await instance.acquireTokenSilent({
      ...apiRequest,
      account: account,
    });
    
    const decodedToken = jwtDecode(response.accessToken);
    return decodedToken.roles || [];
  } catch (error) {
    console.error("Error obteniendo el token en authUtils:", error);
    return [];
  }
};