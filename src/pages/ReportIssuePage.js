import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Textarea, Select, Button, Alert, Card } from '../components/UI';
import { getProjects }  from '../api/projects';
import { createIssue }  from '../api/issues';

function ReportIssuePage() {
  const navigate = useNavigate();

  const [projects,        setProjects]        = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [form,   setForm]   = useState({ title: '', description: '', stepsToReproduce: '', project: '' });
  const [errors, setErrors] = useState({});
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState('');
  const [serverError, setServerError] = useState('');

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
    setServerError(''); setSuccess('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
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
        <h1 className="text-xl font-semibold text-gray-800">Report a Bug</h1>
        <p className="text-gray-400 text-sm mt-0.5">Provide clear details to help developers reproduce the issue</p>
      </div>

      {projects.length === 0 && !projectsLoading && (
        <div className="mb-4">
          <Alert message="No projects available. You must join a team that has projects before reporting bugs." type="info" />
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select label="Project" value={form.project} onChange={updateField('project')}
            error={errors.project} disabled={projectsLoading || projects.length === 0}>
            {projectsLoading && <option>Loading projects...</option>}
            {!projectsLoading && projects.length === 0 && <option>No projects available</option>}
            {projects.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}{p.team?.name ? ` — ${p.team.name}` : ''}
              </option>
            ))}
          </Select>

          <Input label="Bug Title" placeholder="e.g. Login button unresponsive on mobile Safari"
            value={form.title} onChange={updateField('title')} error={errors.title} />

          <Textarea label="Description"
            placeholder="Describe the bug — what is happening vs what should happen?"
            rows={4} value={form.description} onChange={updateField('description')} error={errors.description} />

          <Textarea label="Steps to Reproduce (optional)"
            placeholder={"1. Open the app\n2. Navigate to...\n3. Click on...\n4. See error"}
            rows={4} value={form.stepsToReproduce} onChange={updateField('stepsToReproduce')} />

          {serverError && <Alert message={serverError} type="error"   />}
          {success     && <Alert message={success}     type="success" />}

          <div className="flex gap-3">
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
