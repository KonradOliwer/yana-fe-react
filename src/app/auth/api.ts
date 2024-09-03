import axios from 'axios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token_expire_at: number; // Unix timestamp in seconds
}

export interface User {
  username: string;
}

export let authClient = axios.create();

export const login = async (loginRequest: LoginRequest): Promise<AuthResponse> => {
  return (await authClient.post(`/access-token/login`, loginRequest)).data;
};

export const logout = async (): Promise<void> => {
  return (await authClient.post(`/access-token/logout`)).data;
};

export const refresh = async (): Promise<AuthResponse> => {
  return (await authClient.post(`/access-token/refresh`, { withCredentials: true })).data;
};

export const whoAmI = async (): Promise<User> => {
  return (await authClient.get(`/users/whoami`, { withCredentials: true })).data;
};
