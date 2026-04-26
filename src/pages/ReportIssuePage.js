// pages/ReportIssuePage.js
// Tester only — report a new bug
// TODO (refactor): extract form logic to useReportIssue() hook
// TODO (refactor): add rich text editor for steps to reproduce

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input, Textarea, Select, Button, Alert, Card } from '../components/UI';

const API = process.env.REACT_APP_API_URL || '';

function ReportIssuePage({ setCurrentPage }) {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    description: '',
    stepsToReproduce: '',
    project: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data.projects || []);
      if (data.projects?.length > 0) {
        setForm(prev => ({ ...prev, project: data.projects[0]._id }));
      }
    } catch (err) {
      // fail silently, handled by empty projects state
    } finally {
      setProjectsLoading(false);
    }
  };

  const updateField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Basic client-side validation
  // TODO (refactor): use a form validation library
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.project) newErrors.project = 'Please select a project';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess('Bug reported successfully!');
      setForm({ title: '', description: '', stepsToReproduce: '', project: projects[0]?._id || '' });

      // Navigate to issues list after 1.5s
      setTimeout(() => setCurrentPage('issues'), 1500);
    } catch (err) {
      setServerError(err.message || 'Failed to submit bug report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Report a Bug</h1>
        <p className="text-slate-500 text-sm mt-1">Provide clear details to help developers reproduce and fix the issue</p>
      </div>

      {projects.length === 0 && !projectsLoading && (
        <Alert
          message="No projects found. A manager needs to create a project before you can report bugs."
          type="info"
        />
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Project"
            value={form.project}
            onChange={updateField('project')}
            error={errors.project}
            disabled={projectsLoading || projects.length === 0}
          >
            {projectsLoading && <option>Loading projects...</option>}
            {!projectsLoading && projects.length === 0 && <option>No projects available</option>}
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </Select>

          <Input
            label="Bug Title"
            placeholder="e.g. Login button unresponsive on mobile Safari"
            value={form.title}
            onChange={updateField('title')}
            error={errors.title}
          />

          <Textarea
            label="Description"
            placeholder="Describe the bug in detail — what is happening vs what should happen?"
            rows={4}
            value={form.description}
            onChange={updateField('description')}
            error={errors.description}
          />

          <Textarea
            label="Steps to Reproduce (optional)"
            placeholder={`1. Open the app\n2. Navigate to...\n3. Click on...\n4. See error`}
            rows={4}
            value={form.stepsToReproduce}
            onChange={updateField('stepsToReproduce')}
          />

          {serverError && <Alert message={serverError} type="error" />}
          {success && <Alert message={success} type="success" />}

          <div className="flex gap-3 pt-1">
            <Button
              type="submit"
              disabled={loading || projects.length === 0}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Bug Report'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCurrentPage('issues')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ReportIssuePage;
