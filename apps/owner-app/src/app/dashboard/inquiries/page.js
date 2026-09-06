'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';

const STATUSES = ['NEW', 'CONTACTED', 'CLOSED'];

function InquiriesContent() {
  const [inquiries, setInquiries] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .ownerInquiries()
      .then(setInquiries)
      .catch((err) => setError(err.message));
  }, []);

  async function handleStatusChange(id, status) {
    try {
      const updated = await api.updateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((i) => (i._id === id ? updated : i)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Inquiries</h1>
      </div>

      {error && <p className="error-text">{error}</p>}

      {inquiries === null ? (
        <p>Loading...</p>
      ) : inquiries.length === 0 ? (
        <div className="empty-state">No inquiries yet. They&apos;ll show up here as people contact you.</div>
      ) : (
        <table className="listing-table">
          <thead>
            <tr>
              <th>Listing</th>
              <th>Message</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id}>
                <td>
                  <a href={`/dashboard/${inq.listingId}/edit`}>{inq.listingId}</a>
                </td>
                <td style={{ maxWidth: 280 }}>{inq.message}</td>
                <td>{inq.contactPhone || '—'}</td>
                <td>
                  <select value={inq.status} onChange={(e) => handleStatusChange(inq._id, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function InquiriesPage() {
  return (
    <AuthGuard>
      <InquiriesContent />
    </AuthGuard>
  );
}
