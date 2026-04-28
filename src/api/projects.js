// api/projects.js
// Phase 2 refactor: all project network calls extracted from ProjectsPage

import api from './axiosInstance';

export async function getProjects() {
  const { data } = await api.get('/api/projects');
  return data.projects; // []
}

export async function createProject(name, description) {
  const { data } = await api.post('/api/projects', { name, description });
  return data.project; // {}
}
