import api from './axiosInstance';

export async function getTeams() {
  const { data } = await api.get('/api/teams');
  return data.teams;
}

export async function getTeam(id) {
  const { data } = await api.get(`/api/teams/${id}`);
  return data.team;
}

export async function createTeam(name, description) {
  const { data } = await api.post('/api/teams', { name, description });
  return data.team;
}

export async function joinTeam(joinCode) {
  const { data } = await api.post('/api/teams/join', { joinCode });
  return data.team;
}

export async function removeMember(teamId, userId) {
  const { data } = await api.delete(`/api/teams/${teamId}/members/${userId}`);
  return data;
}
