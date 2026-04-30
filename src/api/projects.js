import api from './axiosInstance';

export async function getProjects(teamId) {
  const params = teamId ? { teamId } : {};
  const { data } = await api.get('/api/projects', { params });
  return data.projects;
}

export async function createProject(name, description, teamId) {
  const { data } = await api.post('/api/projects', { name, description, teamId });
  return data.project;
}
