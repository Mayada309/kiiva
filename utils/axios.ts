import 'axios';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

export const customFetch = axios.create({
  baseURL: 'http://kiiva.localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

customFetch.interceptors.request.use(
  function (config) {
    const token = getCookie('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

customFetch.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.status === 401) {
      deleteCookie('token');
    }
  }
);

export const adminFetch = axios.create({
  baseURL: 'http://kiiva.localhost:8000/admin',
  headers: {
    Accept: 'application/json',
  },
});
adminFetch.interceptors.request.use(
  function (config) {
    const token = getCookie('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
