// api/users.js
// Phase 2 refactor: user network calls extracted from IssuesPage

import api from './axiosInstance';

export async function getDevelopers() {
  const { data } = await api.get('/api/users/developers');
  return data.developers; // []
}
