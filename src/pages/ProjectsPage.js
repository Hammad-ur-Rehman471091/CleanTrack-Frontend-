import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Textarea, Select, Modal, Alert, EmptyState, ProjectGridSkeleton } from '../components/UI';
import { useProjects } from '../hooks/useProjects';
import { useTeams }    from '../hooks/useTeams';

function ProjectsPage() {
  const { user }     = useAuth();
  const { teams }    = useTeams();
  const { projects, loading, error, createProject } = useProjects();

  const [showModal,   setShowModal]   = useState(false);
  const [form,        setForm]        = useState({ name: '', description: '', teamId: '' });
  const [formError,   setFormError]   = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  // manager-owned teams only for creating projects
  const myTeams = teams.filter(t => t.createdBy?._id === user?.id || t.createdBy === user?.id);

  const openModal = () => {
    setForm({ name: '', description: '', teamId: myTeams[0]?._id || '' });
    setFormError(''); setFormSuccess('');
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    if (!form.name.trim())   { setFormError('Project name is required'); return; }
    if (!form.teamId)        { setFormError('Please select a team');     return; }
    setFormLoading(true);
    try {
      await createProject(form.name, form.description, form.teamId);
      setFormSuccess('Project created!');
      setTimeout(() => { setShowModal(false); setFormSuccess(''); }, 1000);
    } catch (err) {
      setFormError(err.message || 'Failed to create project');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <ProjectGridSkeleton count={6} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Projects</h1>
          <p className="text-gray-400 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role === 'manager' && (
          <Button onClick={openModal} disabled={myTeams.length === 0}>
            New Project
          </Button>
        )}
      </div>

      {myTeams.length === 0 && user?.role === 'manager' && (
        <Alert message="You need to create a team first before adding projects." type="info" />
      )}

      {error && <Alert message={error} type="error" />}

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" subtitle="Create a team first, then add projects to it" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project._id} className="p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-blue-50 rounded-md flex items-center justify-center text-blue-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{project.description}</p>
              )}
              {project.team?.name && (
                <span className="inline-block text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                  {project.team.name}
                </span>
              )}
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Created by {project.createdBy?.name || 'Unknown'}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select label="Team" value={form.teamId}
            onChange={e => setForm(p => ({ ...p, teamId: e.target.value }))}>
            <option value="">Select a team</option>
            {myTeams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </Select>
          <Input label="Project Name" placeholder="e.g. Mobile App v2"
            value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          <Textarea label="Description (optional)" placeholder="What is this project about?"
            rows={3} value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          {formError   && <Alert message={formError}   type="error"   />}
          {formSuccess && <Alert message={formSuccess} type="success" />}
          <div className="flex gap-2">
            <Button type="submit" disabled={formLoading} className="flex-1">
              {formLoading ? 'Creating...' : 'Create Project'}
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectsPage;
