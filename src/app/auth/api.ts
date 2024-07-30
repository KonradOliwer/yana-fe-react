import axios from 'axios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token_expire_at: number; // Unix timestamp
}

export interface User {
  username: string;
}

export const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  return (await axios.post(`/access-token/login`, loginRequest)).data;
};

export const logout = async (): Promise<LoginResponse> => {
  return (await axios.post(`/access-token/logout`)).data;
};

export const whoAmI = async (): Promise<User> => {
  return (await axios.get(`/users/whoami`, {withCredentials:true})).data;
};
