'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import ListingForm from '@/components/ListingForm';
import { api } from '@/lib/api';

function EditListingContent({ id }) {
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getListing(id)
      .then(setListing)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Edit listing</h1>
      </div>
      {error && <p className="error-text">{error}</p>}
      {listing && (
        <ListingForm
          initialValue={listing}
          listingId={id}
          onSaved={() => (window.location.href = '/dashboard')}
        />
      )}
    </div>
  );
}

export default function EditListingPage({ params }) {
  return (
    <AuthGuard>
      <EditListingContent id={params.id} />
    </AuthGuard>
  );
}
