// api/dashboard.js
// Phase 2 refactor: dashboard stats call extracted from DashboardPage

import api from './axiosInstance';

export async function getDashboardStats() {
  const { data } = await api.get('/api/dashboard/stats');
  return data.stats; // {}
}
