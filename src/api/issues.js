// api/issues.js
// Phase 2 refactor: extracted network calls from pages
// Phase 3 refactor: getIssues() now accepts { page, limit, search } for pagination and search

import api from './axiosInstance';

/**
 * Fetch issues with optional pagination and search.
 * Returns { issues, pagination: { total, page, limit, totalPages } }
 */
export async function getIssues({ page = 1, limit = 10, search = '' } = {}) {
  const params = { page, limit };
  if (search.trim()) params.search = search.trim();
  const { data } = await api.get('/api/issues', { params });
  return data; // { issues, pagination }
}

export async function getIssue(id) {
  const { data } = await api.get(`/api/issues/${id}`);
  return data.issue;
}

export async function createIssue(payload) {
  const { data } = await api.post('/api/issues', payload);
  return data.issue;
}

export async function assignIssue(id, assignedTo) {
  const { data } = await api.patch(`/api/issues/${id}/assign`, { assignedTo });
  return data.issue;
}

export async function updateIssueStatus(id, status) {
  const { data } = await api.patch(`/api/issues/${id}/status`, { status });
  return data.issue;
}
