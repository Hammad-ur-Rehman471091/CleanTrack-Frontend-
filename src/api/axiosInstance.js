// api/axiosInstance.js
// Phase 2 refactor: shared axios instance with auth interceptor
// All api/* service files import from here instead of using raw fetch()
// The request interceptor auto-attaches the JWT token from localStorage
// so individual service functions never need to read the token themselves

import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || '';

if (!baseURL && typeof window !== 'undefined') {
  console.warn(
    'REACT_APP_API_URL is not set. API requests will be sent to the current origin.\n' +
    'If the backend is deployed separately, set REACT_APP_API_URL to your backend URL.'
  );
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ct_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwrap error messages into a consistent shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
