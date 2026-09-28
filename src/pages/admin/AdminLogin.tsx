import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ok = await login(form.username, form.password);
      if (ok) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Unable to reach the authentication service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary font-serif text-2xl font-bold mx-auto mb-4">V</div>
          <h1 className="font-serif text-2xl text-white mb-1">Admin Panel</h1>
          <p className="text-white/50 text-sm">Vedant Multispeciality Hospital</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-sm text-danger bg-danger/10 px-4 py-2.5 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-muted rounded-lg text-xs text-text-muted text-center">
            Sign in with your administrator account.
          </div>
        </div>
      </div>
    </div>
  );
}
