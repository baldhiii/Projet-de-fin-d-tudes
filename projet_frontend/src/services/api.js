// src/api/api.js
// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // <-- corriger avec backticks
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
