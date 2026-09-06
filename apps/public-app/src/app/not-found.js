import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <h1 className="section-title">Listing not found</h1>
      <p>It may have been rented out or removed. Try browsing current listings instead.</p>
      <p style={{ marginTop: 16 }}>
        <Link href="/search" className="btn">
          Browse listings
        </Link>
      </p>
    </div>
  );
}
