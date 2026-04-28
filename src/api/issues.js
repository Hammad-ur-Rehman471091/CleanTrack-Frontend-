// api/issues.js
// Phase 2 refactor: all issue network calls extracted from IssuesPage and ReportIssuePage

import api from './axiosInstance';

export async function getIssues() {
  const { data } = await api.get('/api/issues');
  return data.issues; // []
}

export async function getIssue(id) {
  const { data } = await api.get(`/api/issues/${id}`);
  return data.issue; // {}
}

export async function createIssue(payload) {
  // payload: { title, description, stepsToReproduce, project }
  const { data } = await api.post('/api/issues', payload);
  return data.issue; // {}
}

export async function assignIssue(id, assignedTo) {
  // assignedTo: developer userId string, or null to unassign
  const { data } = await api.patch(`/api/issues/${id}/assign`, { assignedTo });
  return data.issue; // {}
}

export async function updateIssueStatus(id, status) {
  const { data } = await api.patch(`/api/issues/${id}/status`, { status });
  return data.issue; // {}
}
