import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert, Select } from '../components/UI';
import * as authApi from '../api/auth';

function AuthPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [mode,     setMode]    = useState('login');
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');
  const [form,     setForm]    = useState({ name: '', email: '', password: '', role: 'tester' });

  const updateField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const data = mode === 'login'
        ? await authApi.login(form.email, form.password)
        : await authApi.signup(form.name, form.email, form.password, form.role);
      login(data.user, data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">CT</div>
            <span className="text-xl font-semibold text-gray-800">CleanTrack</span>
          </div>
          <p className="text-gray-500 text-sm">Bug & Issue Tracking System</p>
        </div>

        <div className="bg-white rounded-lg border border-blue-100 shadow-sm p-7">
          <div className="flex rounded-md bg-gray-100 p-0.5 mb-5">
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-1.5 text-sm font-medium rounded transition-all
                  ${mode === m ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input label="Full Name" type="text" placeholder="Jane Smith"
                value={form.name} onChange={updateField('name')} required />
            )}
            <Input label="Email" type="email" placeholder="you@company.com"
              value={form.email} onChange={updateField('email')} required />
            <Input label="Password" type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
              value={form.password} onChange={updateField('password')}
              required minLength={mode === 'signup' ? 6 : undefined} />
            {mode === 'signup' && (
              <Select label="Role" value={form.role} onChange={updateField('role')}>
                <option value="tester">Tester</option>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
              </Select>
            )}
            {error && <Alert message={error} type="error" />}
            <Button type="submit" disabled={loading} className="w-full py-2">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {mode === 'signup' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-gray-500 space-y-1">
              <div><strong>Manager</strong> — create teams and projects, assign issues</div>
              <div><strong>Tester</strong> — join teams, report bugs</div>
              <div><strong>Developer</strong> — join teams, resolve assigned issues</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
