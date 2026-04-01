'use client';
import { useState } from 'react';

interface AuthProps { onLogin: () => void; onCancel: () => void; }

export function Auth({ onLogin, onCancel }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email format'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (mode === 'register' && password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      localStorage.setItem('moonly_user', JSON.stringify({ email, createdAt: Date.now() }));
      onLogin();
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl border p-8" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="text-center mb-6">
        <p className="text-3xl mb-2">🌙</p>
        <h2 className="text-xl font-semibold">{mode === 'login' ? 'Welcome back!' : 'Join Moonly'}</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
          {mode === 'login' ? "We're so glad you're here again 💜" : 'Start your emotional wellness journey'}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <button className="w-full py-3 rounded-xl font-medium border flex items-center justify-center gap-2 hover:opacity-80"
                style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <button className="w-full py-3 rounded-xl font-medium border flex items-center justify-center gap-2 hover:opacity-80"
                style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          Continue with Apple
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'var(--border)' }} /></div>
        <div className="relative flex justify-center text-xs"><span className="px-2" style={{ background: 'var(--card)', color: 'var(--foreground-muted)' }}>or</span></div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
        </div>
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
          </div>
        )}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-60" style={{ background: '#7C3AED' }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <button className="text-sm" style={{ color: '#7C3AED' }}
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </button>
      </div>
      <div className="mt-3 text-center">
        <button className="text-sm" style={{ color: 'var(--foreground-muted)' }} onClick={onCancel}>Continue as guest →</button>
      </div>
    </div>
  );
}
