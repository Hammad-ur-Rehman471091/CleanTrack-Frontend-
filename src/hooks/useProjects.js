import { useState, useEffect, useCallback } from 'react';
import * as projectsApi from '../api/projects';

export function useProjects(teamId) {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await projectsApi.getProjects(teamId);
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (name, description, teamId) => {
    const newProject = await projectsApi.createProject(name, description, teamId);
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  return { projects, loading, error, createProject, refetch: fetchProjects };
}
