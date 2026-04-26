// pages/AuthPage.js
// Login + Signup in one file/component — intentionally unstructured
// TODO (refactor): split into LoginForm.js and SignupForm.js
// TODO (refactor): extract API calls into api/auth.js service
// TODO (refactor): add form validation library (e.g. react-hook-form)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert, Select } from '../components/UI';

const API = process.env.REACT_APP_API_URL || '';

function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state - all fields in one object (unstructured)
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'tester'
  });

  const updateField = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role };

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      login(data.user, data.token);
    } catch (err) {
      setError('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-bold">CT</div>
            <span className="text-2xl font-bold text-slate-800">CleanTrack</span>
          </div>
          <p className="text-slate-500 text-sm">Smart Bug & Issue Tracking System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {/* Tab switcher */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize
                  ${mode === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Full Name"
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={updateField('name')}
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={updateField('email')}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={form.password}
              onChange={updateField('password')}
              required
              minLength={mode === 'signup' ? 6 : undefined}
            />

            {mode === 'signup' && (
              <Select
                label="Role"
                value={form.role}
                onChange={updateField('role')}
              >
                <option value="tester">Tester</option>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
              </Select>
            )}

            {error && <Alert message={error} type="error" />}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login' ? 'Sign In' : 'Create Account'
              }
            </Button>
          </form>

          {/* Role hint */}
          {mode === 'signup' && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 space-y-1">
              <div><strong>Manager</strong> — create projects, assign issues</div>
              <div><strong>Tester</strong> — report bugs and track your reports</div>
              <div><strong>Developer</strong> — view assigned issues, update status</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
