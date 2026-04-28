// hooks/useStats.js
// Phase 2 refactor: extracted from DashboardPage
// Fetches dashboard stats and exposes { stats, loading, error, refetch }

import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '../api/dashboard';

export function useStats() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, error, refetch: fetch };
}
