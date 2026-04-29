// hooks/useIssues.js
// Phase 2 refactor: extracted from IssuesPage
// Phase 3 refactor:
//   - supports pagination (page, limit)
//   - supports search query (search)
//   - exposes pagination metadata alongside issues

import { useState, useEffect, useCallback } from 'react';
import * as issuesApi from '../api/issues';

export function useIssues({ page = 1, limit = 10, search = '' } = {}) {
  const [issues,     setIssues]     = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await issuesApi.getIssues({ page, limit, search });
      setIssues(data.issues);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const assignIssue = async (id, assignedTo) => {
    const updated = await issuesApi.assignIssue(id, assignedTo);
    setIssues(prev => prev.map(i => i._id === updated._id ? updated : i));
    return updated;
  };

  const updateStatus = async (id, status) => {
    const updated = await issuesApi.updateIssueStatus(id, status);
    setIssues(prev => prev.map(i => i._id === updated._id ? updated : i));
    return updated;
  };

  return { issues, pagination, loading, error, assignIssue, updateStatus, refetch: fetchIssues };
}
