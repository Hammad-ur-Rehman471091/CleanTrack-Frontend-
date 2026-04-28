// hooks/useProjects.js
// Phase 2 refactor: extracted from ProjectsPage
// Exposes { projects, loading, error, createProject }

import { useState, useEffect, useCallback } from 'react';
import * as projectsApi from '../api/projects';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await projectsApi.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (name, description) => {
    const newProject = await projectsApi.createProject(name, description);
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  return { projects, loading, error, createProject, refetch: fetchProjects };
}
