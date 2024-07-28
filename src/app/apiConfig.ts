import axios from 'axios';
import { ClientError } from './apiErrors';

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
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
