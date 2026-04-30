import api from './axiosInstance';

export async function getDevelopers(teamId) {
  const params = teamId ? { teamId } : {};
  const { data } = await api.get('/api/users/developers', { params });
  return data.developers;
}
