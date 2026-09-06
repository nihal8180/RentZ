'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(form);
      saveSession(data.token, data.user);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-box">
      <h1>Log in to RentZ</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        No account? <Link href="/signup">Sign up as an owner</Link>
      </p>
    </div>
  );
}
