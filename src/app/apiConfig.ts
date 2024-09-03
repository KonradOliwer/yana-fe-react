import axios from 'axios';
import { ClientError } from './apiErrors';
import { provideAutoRefreshTokenHandler } from './auth/apiAuthConfig';

export let clientWithAuth = axios.create();

clientWithAuth.defaults.withCredentials = true;


clientWithAuth.interceptors.request.use(provideAutoRefreshTokenHandler());

clientWithAuth.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.data.code) {
      return Promise.reject(new ClientError(error.response.data));
    }
    return Promise.reject(error);
  },
);
