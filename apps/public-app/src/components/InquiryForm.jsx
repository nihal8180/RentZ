'use client';

import { useState } from 'react';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080';

export default function InquiryForm({ listingId, ownerId }) {
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  async function handleSubmit(e) {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('rentz_token') : null;

    if (!token) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(`${GATEWAY_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId, ownerId, message, contactPhone: phone }),
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) setMessage('');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <div className="contact-card">
      <h3>Contact the owner</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="Your phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          placeholder="Hi, I'm interested in this listing..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button className="btn btn-accent" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send inquiry'}
        </button>
      </form>
      {status === 'sent' && <p className="form-status success">Sent — the owner will contact you.</p>}
      {status === 'error' && (
        <p className="form-status error">
          Couldn&apos;t send that. You may need to log in first, or try again in a moment.
        </p>
      )}
    </div>
  );
}
