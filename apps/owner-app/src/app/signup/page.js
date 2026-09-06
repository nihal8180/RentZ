'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.signup({ ...form, role: 'OWNER' });
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
      <h1>Create your owner account</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Full name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
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
          <label>Phone</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
