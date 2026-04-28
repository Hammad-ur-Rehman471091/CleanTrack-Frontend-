// hooks/useIssues.js
// Phase 2 refactor: extracted from IssuesPage
// Exposes { issues, loading, error, assignIssue, updateStatus }

import { useState, useEffect, useCallback } from 'react';
import * as issuesApi from '../api/issues';

export function useIssues() {
  const [issues,  setIssues]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await issuesApi.getIssues();
      setIssues(data);
    } catch (err) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { issues, loading, error, assignIssue, updateStatus, refetch: fetchIssues };
}
