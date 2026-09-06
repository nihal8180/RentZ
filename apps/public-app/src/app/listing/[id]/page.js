import { notFound } from 'next/navigation';
import { getListing } from '@/lib/api';
import InquiryForm from '@/components/InquiryForm';

export async function generateMetadata({ params }) {
  const listing = await getListing(params.id);
  if (!listing) return { title: 'Listing not found' };

  const desc = `${listing.type} for rent in ${listing.location?.locality}, ${listing.location?.city} — ₹${listing.rent}/month, ${listing.bathrooms} bathroom(s).`;

  return {
    title: listing.title,
    description: desc,
    openGraph: {
      title: listing.title,
      description: desc,
      images: listing.images?.[0] ? [listing.images[0]] : [],
    },
  };
}

export default async function ListingDetailPage({ params }) {
  const listing = await getListing(params.id);
  if (!listing) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description || listing.title,
    image: listing.images || [],
    offers: {
      '@type': 'Offer',
      price: listing.rent,
      priceCurrency: 'INR',
      availability: listing.status === 'ACTIVE' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="container">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="detail-title">{listing.title}</h1>
      <p className="detail-location">
        {listing.location?.addressLine ? `${listing.location.addressLine}, ` : ''}
        {listing.location?.locality}, {listing.location?.city}
        {listing.location?.pincode ? ` — ${listing.location.pincode}` : ''}
      </p>

      <div className="detail-grid">
        <div>
          {listing.images?.length > 0 && (
            <div className="detail-images">
              {listing.images.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt={listing.title} loading="lazy" />
              ))}
            </div>
          )}

          <div className="detail-rent">
            ₹{listing.rent?.toLocaleString('en-IN')} <span style={{ fontSize: 15, fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>/ month</span>
          </div>

          <ul className="spec-list">
            <li>
              <span>Type</span>
              <span>{listing.type}</span>
            </li>
            {listing.bhk > 0 && (
              <li>
                <span>BHK</span>
                <span>{listing.bhk}</span>
              </li>
            )}
            <li>
              <span>Bathrooms</span>
              <span>{listing.bathrooms}</span>
            </li>
            <li>
              <span>Furnishing</span>
              <span>{listing.furnishing?.replace('_', ' ')}</span>
            </li>
            <li>
              <span>Deposit</span>
              <span>₹{listing.deposit?.toLocaleString('en-IN') || 0}</span>
            </li>
          </ul>

          {listing.description && <p>{listing.description}</p>}

          {listing.amenities?.length > 0 && (
            <div className="tag-list">
              {listing.amenities.map((a) => (
                <span className="tag" key={a}>
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <InquiryForm listingId={listing._id} ownerId={listing.ownerId} />
        </div>
      </div>
    </div>
  );
}
