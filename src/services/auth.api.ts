import api from "./api";
import { tokenService } from "./tokenService";



  export interface UserInfo {
    id: number;
    name: string;
    email: string;
  }
  interface RegisterCredentials {
    email: string;
    name: string;
    password: string;
  }
  interface LoginCredentials {
    email: string;
    password: string;
  }
 
  
export const authApi = {
  login: async ({ email, password }: LoginCredentials) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token } = response.data;
    tokenService.setTokens(access_token, refresh_token);
    return response.data;
  },
    register: async (credentials: RegisterCredentials) => {
      const response = await api.post('/auth/register', credentials);
      return response.data;
    },
    logout: async (refresh_token: string | null) => {
      const response = await api.post('/auth/logout', {
        refresh_token
      });
      return response.data;
    },
    getUserInfo: async () => {
      const response = await api.get('/auth/user');
      return response.data;
    }
  };
  