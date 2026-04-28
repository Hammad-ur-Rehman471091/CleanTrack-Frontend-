// hooks/useDevelopers.js
// Phase 2 refactor: extracted from IssuesPage (manager-only developer list)

import { useState, useEffect } from 'react';
import { fetchDevelopers } from '../api/users';
import { useAuth } from '../context/AuthContext';

export function useDevelopers() {
  const { user } = useAuth();
  const [developers, setDevelopers] = useState([]);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (user?.role !== 'manager') return;
    setLoading(true);
    fetchDevelopers()
      .then(setDevelopers)
      .catch(() => {}) // non-critical
      .finally(() => setLoading(false));
  }, [user?.role]);

  return { developers, loading };
}
