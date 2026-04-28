// api/client.js
// Phase 2 refactor: centralised axios instance
// All API calls go through this client — token is attached automatically via interceptor.
// Pages and hooks no longer call fetch() directly.

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT from localStorage on every request
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ct_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data, surface error messages uniformly
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default client;
