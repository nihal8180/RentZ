'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';

function DashboardContent() {
  const [listings, setListings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .myListings()
      .then(setListings)
      .catch((err) => setError(err.message));
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    await api.deleteListing(id);
    setListings((prev) => prev.filter((l) => l._id !== id));
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My listings</h1>
        <Link href="/dashboard/new" className="btn">
          + Add listing
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      {listings === null ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          You haven&apos;t listed any properties yet.{' '}
          <Link href="/dashboard/new">Add your first listing</Link>.
        </div>
      ) : (
        <table className="listing-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Rent</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l._id}>
                <td>{l.title}</td>
                <td>
                  {l.location?.locality}, {l.location?.city}
                </td>
                <td>₹{l.rent?.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`status-pill status-${l.status}`}>
                    {l.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <Link href={`/dashboard/${l._id}/edit`}>Edit</Link>
                    <button
                      className="btn-danger"
                      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => handleDelete(l._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
