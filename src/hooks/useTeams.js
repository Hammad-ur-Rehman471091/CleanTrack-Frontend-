import { useState, useEffect, useCallback } from 'react';
import * as teamsApi from '../api/teams';

export function useTeams() {
  const [teams,   setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchTeams = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await teamsApi.getTeams();
      setTeams(data);
    } catch (err) {
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const createTeam = async (name, description) => {
    const team = await teamsApi.createTeam(name, description);
    setTeams(prev => [team, ...prev]);
    return team;
  };

  const joinTeam = async (joinCode) => {
    const team = await teamsApi.joinTeam(joinCode);
    setTeams(prev => {
      if (prev.find(t => t._id === team._id)) return prev;
      return [team, ...prev];
    });
    return team;
  };

  return { teams, loading, error, createTeam, joinTeam, refetch: fetchTeams };
}
