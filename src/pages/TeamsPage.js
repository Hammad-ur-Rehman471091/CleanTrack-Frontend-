import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Textarea, Modal, Alert, EmptyState, TeamGridSkeleton } from '../components/UI';
import { useTeams } from '../hooks/useTeams';
import { removeMember } from '../api/teams';

function TeamsPage() {
  const { user } = useAuth();
  const { teams, loading, error, createTeam, joinTeam, refetch } = useTeams();

  const [createModal, setCreateModal] = useState(false);
  const [joinModal,   setJoinModal]   = useState(false);
  const [detailTeam,  setDetailTeam]  = useState(null);

  const [createForm,    setCreateForm]    = useState({ name: '', description: '' });
  const [joinCode,      setJoinCode]      = useState('');
  const [formLoading,   setFormLoading]   = useState(false);
  const [formError,     setFormError]     = useState('');
  const [formSuccess,   setFormSuccess]   = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    if (!createForm.name.trim()) { setFormError('Team name is required'); return; }
    setFormLoading(true);
    try {
      await createTeam(createForm.name, createForm.description);
      setCreateForm({ name: '', description: '' });
      setFormSuccess('Team created!');
      setTimeout(() => { setCreateModal(false); setFormSuccess(''); }, 1000);
    } catch (err) {
      setFormError(err.message || 'Failed to create team');
    } finally {
      setFormLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    if (!joinCode.trim()) { setFormError('Join code is required'); return; }
    setFormLoading(true);
    try {
      await joinTeam(joinCode.trim().toUpperCase());
      setJoinCode('');
      setFormSuccess('You have joined the team!');
      setTimeout(() => { setJoinModal(false); setFormSuccess(''); }, 1000);
    } catch (err) {
      setFormError(err.message || 'Invalid join code');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await removeMember(teamId, userId);
      refetch();
      setDetailTeam(prev => ({
        ...prev,
        members: prev.members.filter(m => m.user._id !== userId)
      }));
    } catch (err) {
      alert(err.message || 'Failed to remove member');
    }
  };

  const openDetail = (team) => {
    setDetailTeam(team);
  };

  const resetModal = () => {
    setFormError(''); setFormSuccess('');
    setCreateForm({ name: '', description: '' });
    setJoinCode('');
  };

  if (loading) return <TeamGridSkeleton count={3} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Teams</h1>
          <p className="text-gray-400 text-sm mt-0.5">{teams.length} team{teams.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          {user?.role === 'manager' && (
            <Button onClick={() => { resetModal(); setCreateModal(true); }}>
              Create Team
            </Button>
          )}
          {(user?.role === 'tester' || user?.role === 'developer') && (
            <Button onClick={() => { resetModal(); setJoinModal(true); }}>
              Join Team
            </Button>
          )}
        </div>
      </div>

      {error && <Alert message={error} type="error" />}

      {teams.length === 0 ? (
        <EmptyState
          title={user?.role === 'manager' ? 'No teams yet' : 'You have not joined any team yet'}
          subtitle={
            user?.role === 'manager'
              ? 'Create a team to start collaborating'
              : 'Ask your manager for a join code'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <Card key={team._id} className="p-5 hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-blue-50 rounded-md flex items-center justify-center text-blue-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-400">{team.members?.length || 0} members</span>
              </div>

              <h3 className="font-medium text-gray-800 mb-1">{team.name}</h3>
              {team.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{team.description}</p>
              )}

              {/* Join code — visible to manager only */}
              {user?.role === 'manager' && team.createdBy?._id === user.id && (
                <div className="mb-3 p-2.5 bg-blue-50 rounded-md border border-blue-100">
                  <div className="text-xs text-gray-500 mb-0.5">Join Code</div>
                  <div className="font-mono font-semibold text-blue-700 text-sm tracking-widest">
                    {team.joinCode}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  By {team.createdBy?.name}
                </span>
                <button
                  onClick={() => openDetail(team)}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                >
                  View members
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      <Modal open={createModal} onClose={() => { setCreateModal(false); resetModal(); }} title="Create Team">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Team Name" placeholder="e.g. Backend Team"
            value={createForm.name}
            onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} required />
          <Textarea label="Description (optional)" placeholder="What does this team work on?"
            rows={3} value={createForm.description}
            onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} />
          {formError   && <Alert message={formError}   type="error"   />}
          {formSuccess && <Alert message={formSuccess} type="success" />}
          <div className="flex gap-2">
            <Button type="submit" disabled={formLoading} className="flex-1">
              {formLoading ? 'Creating...' : 'Create Team'}
            </Button>
            <Button variant="secondary" onClick={() => setCreateModal(false)} className="flex-1">Cancel</Button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            A unique join code will be generated automatically.
          </p>
        </form>
      </Modal>

      {/* Join Team Modal */}
      <Modal open={joinModal} onClose={() => { setJoinModal(false); resetModal(); }} title="Join a Team">
        <form onSubmit={handleJoin} className="space-y-4">
          <p className="text-sm text-gray-500">
            Enter the join code provided by your team manager.
          </p>
          <Input
            label="Join Code"
            placeholder="e.g. A3FX9K2M"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            className="font-mono tracking-widest uppercase text-center text-lg"
            maxLength={8}
            required
          />
          {formError   && <Alert message={formError}   type="error"   />}
          {formSuccess && <Alert message={formSuccess} type="success" />}
          <div className="flex gap-2">
            <Button type="submit" disabled={formLoading} className="flex-1">
              {formLoading ? 'Joining...' : 'Join Team'}
            </Button>
            <Button variant="secondary" onClick={() => setJoinModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Team Detail / Members Modal */}
      <Modal open={!!detailTeam} onClose={() => setDetailTeam(null)} title={detailTeam?.name || ''}>
        {detailTeam && (
          <div>
            {user?.role === 'manager' && detailTeam.createdBy?._id === user.id && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                <div className="text-xs text-gray-500 mb-1">Share this code with your team members</div>
                <div className="font-mono font-bold text-blue-700 text-xl tracking-[0.3em] text-center py-1">
                  {detailTeam.joinCode}
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Members ({detailTeam.members?.length || 0})
            </h3>

            <div className="space-y-2">
              {detailTeam.members?.map(m => (
                <div key={m.user._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{m.user.name}</div>
                    <div className="text-xs text-gray-400">{m.user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                      ${m.user.role === 'manager'   ? 'bg-blue-100 text-blue-700' :
                        m.user.role === 'developer' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-sky-100 text-sky-700'}`}>
                      {m.user.role}
                    </span>
                    {user?.role === 'manager' &&
                     detailTeam.createdBy?._id === user.id &&
                     m.user._id !== user.id && (
                      <button
                        onClick={() => handleRemoveMember(detailTeam._id, m.user._id)}
                        className="text-xs text-red-400 hover:text-red-600 ml-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TeamsPage;
