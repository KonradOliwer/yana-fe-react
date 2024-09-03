import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refresh } from './api';

let ACCESS_TOKEN_EXPIRES_AT_IN_SECONDS_KEY = 'access_token_expires_at';

export function rememberTokenExpiration(expiresAt: number) {
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_IN_SECONDS_KEY, expiresAt.toString());
}

export function provideAutoRefreshTokenHandler() {
  return async function (config: InternalAxiosRequestConfig) {
    let tokenExpiresAt = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_IN_SECONDS_KEY);
    if (tokenExpiresAt) {
      let expiresAt = parseInt(tokenExpiresAt);
      let currentInSeconds = Date.now() / 1000;
      if (currentInSeconds > expiresAt) {
        console.log('token no longer valid');
        try {
          const response = await refresh();
          rememberTokenExpiration(response.token_expire_at);
          console.log('token refreshed');
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error('failed to refresh token', error);
          if (axiosError.isAxiosError && axiosError.response!.status === 403) {
            console.log('fail to refresh token');
            localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_IN_SECONDS_KEY);
            window.location.reload();
          }
        }
      }
    }
    return config;
  };
}
