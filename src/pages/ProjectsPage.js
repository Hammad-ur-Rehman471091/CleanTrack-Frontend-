// pages/ProjectsPage.js
// Manager only — create and view projects
// TODO (refactor): extract useProjects() custom hook
// TODO (refactor): split CreateProjectForm into its own component

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Textarea, Modal, Alert, EmptyState, Spinner } from '../components/UI';

const API = process.env.REACT_APP_API_URL || '';

function ProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProjects(data.projects);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!form.name.trim()) { setFormError('Project name is required'); return; }
    setFormLoading(true);

    try {
      const res = await fetch(`${API}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProjects(prev => [data.project, ...prev]);
      setForm({ name: '', description: '' });
      setFormSuccess('Project created!');
      setTimeout(() => { setShowModal(false); setFormSuccess(''); }, 1000);
    } catch (err) {
      setFormError(err.message || 'Failed to create project');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ New Project</Button>
      </div>

      {error && <Alert message={error} type="error" />}

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          subtitle="Create your first project to start tracking bugs"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project._id} className="p-5 hover:border-violet-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center text-violet-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
              )}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                Created by {project.createdBy?.name || 'Unknown'}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setFormError(''); setFormSuccess(''); }} title="New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. Mobile App v2"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Textarea
            label="Description (optional)"
            placeholder="What is this project about?"
            rows={3}
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          />
          {formError && <Alert message={formError} type="error" />}
          {formSuccess && <Alert message={formSuccess} type="success" />}
          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={formLoading} className="flex-1">
              {formLoading ? 'Creating...' : 'Create Project'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectsPage;
