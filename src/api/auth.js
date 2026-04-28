// api/auth.js
// Phase 2 refactor: all auth network calls extracted from AuthPage and AuthContext
// Pages call these functions instead of using raw fetch()

import api from './axiosInstance';

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data; // { token, user }
}

export async function signup(name, email, password, role) {
  const { data } = await api.post('/api/auth/signup', { name, email, password, role });
  return data; // { token, user }
}

export async function getMe() {
  const { data } = await api.get('/api/auth/me');
  return data; // { user }
}
