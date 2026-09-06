import Link from 'next/link';

function firstImage(listing) {
  return listing.images && listing.images.length > 0 ? listing.images[0] : null;
}

export default function ListingRow({ listing }) {
  const img = firstImage(listing);

  return (
    <li className="listing-row">
      <div className="listing-row__thumb">
        {img ? (
          // Plain <img> on purpose - listing photos come from many owners with
          // unpredictable dimensions, and next/image's remote-pattern config
          // would need constant updates as media-service/S3 hosts change.
          <img src={img} alt={listing.title} loading="lazy" />
        ) : (
          <div />
        )}
      </div>
      <div className="listing-row__body">
        <h3 className="listing-row__title">
          <Link href={`/listing/${listing._id}`}>{listing.title}</Link>
        </h3>
        <p className="listing-row__meta">
          {listing.location?.locality}, {listing.location?.city} · {listing.type}
          {listing.bhk ? ` · ${listing.bhk} BHK` : ''} · {listing.bathrooms} bath
        </p>
        <div className="listing-row__rent">
          ₹{listing.rent?.toLocaleString('en-IN')} <span>/ month</span>
        </div>
        {listing.amenities?.length > 0 && (
          <div className="tag-list">
            {listing.amenities.slice(0, 4).map((a) => (
              <span className="tag" key={a}>
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
