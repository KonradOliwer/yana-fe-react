import axios from 'axios';
import { ClientError } from './apiErrors';
import { provideAutoRefreshTokenHandler } from './auth/apiAuthConfig';

export let client = axios.create();

client.defaults.withCredentials = true;

client.interceptors.request.use(provideAutoRefreshTokenHandler());

client.interceptors.response.use(
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
