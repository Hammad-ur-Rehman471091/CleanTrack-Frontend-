// pages/ReportIssuePage.js
// Phase 2 refactor:
//   - raw fetch() replaced with api/issues.js and api/projects.js service calls
//   - navigation uses useNavigate() from react-router-dom

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Textarea, Select, Button, Alert, Card } from '../components/UI';
import { getProjects } from '../api/projects';
import { createIssue }  from '../api/issues';

function ReportIssuePage() {
  const navigate = useNavigate();

  const [projects,        setProjects]        = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [form,            setForm]            = useState({ title: '', description: '', stepsToReproduce: '', project: '' });
  const [errors,          setErrors]          = useState({});
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState('');
  const [serverError,     setServerError]     = useState('');

  useEffect(() => {
    getProjects()
      .then(data => {
        setProjects(data);
        if (data.length > 0) setForm(prev => ({ ...prev, project: data[0]._id }));
      })
      .catch(() => {})
      .finally(() => setProjectsLoading(false));
  }, []);

  const updateField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.project)            e.project     = 'Please select a project';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      await createIssue(form);
      setSuccess('Bug reported successfully!');
      setForm({ title: '', description: '', stepsToReproduce: '', project: projects[0]?._id || '' });
      setTimeout(() => navigate('/issues'), 1500);
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
        <Alert message="No projects found. A manager needs to create a project before you can report bugs." type="info" />
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select label="Project" value={form.project} onChange={updateField('project')}
            error={errors.project} disabled={projectsLoading || projects.length === 0}>
            {projectsLoading && <option>Loading projects...</option>}
            {!projectsLoading && projects.length === 0 && <option>No projects available</option>}
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </Select>

          <Input label="Bug Title" placeholder="e.g. Login button unresponsive on mobile Safari"
            value={form.title} onChange={updateField('title')} error={errors.title} />

          <Textarea label="Description"
            placeholder="Describe the bug in detail — what is happening vs what should happen?"
            rows={4} value={form.description} onChange={updateField('description')} error={errors.description} />

          <Textarea label="Steps to Reproduce (optional)"
            placeholder={"1. Open the app\n2. Navigate to...\n3. Click on...\n4. See error"}
            rows={4} value={form.stepsToReproduce} onChange={updateField('stepsToReproduce')} />

          {serverError && <Alert message={serverError} type="error"   />}
          {success     && <Alert message={success}     type="success" />}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={loading || projects.length === 0} className="flex-1">
              {loading ? 'Submitting...' : 'Submit Bug Report'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/issues')} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ReportIssuePage;
