'use client';

import AuthGuard from '@/components/AuthGuard';
import ListingForm from '@/components/ListingForm';

function NewListingContent() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Add a new listing</h1>
      </div>
      <ListingForm onSaved={() => (window.location.href = '/dashboard')} />
    </div>
  );
}

export default function NewListingPage() {
  return (
    <AuthGuard>
      <NewListingContent />
    </AuthGuard>
  );
}
