import api from "./api";



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

 
  
export const authApi = {
    register: async (credentials: RegisterCredentials) => {
      const response = await api.post('/auth/register', credentials);
      return response.data;
    }
  };
  