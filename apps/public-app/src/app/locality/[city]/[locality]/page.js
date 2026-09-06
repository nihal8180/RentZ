import ListingRow from '@/components/ListingRow';
import { searchListings } from '@/lib/api';

export async function generateMetadata({ params }) {
  const city = decodeURIComponent(params.city);
  const locality = decodeURIComponent(params.locality);

  return {
    title: `Rooms, PGs & Flats for Rent in ${locality}, ${city}`,
    description: `Browse current rental listings in ${locality}, ${city} — rooms, PGs, flats, and houses with photos, rent, and direct owner contact on RentZ.`,
  };
}

export default async function LocalityPage({ params }) {
  const city = decodeURIComponent(params.city);
  const locality = decodeURIComponent(params.locality);

  const data = await searchListings({ city, locality, limit: 20 });
  const { results, total } = data;

  return (
    <div className="container">
      <h1 className="section-title" style={{ marginTop: 40 }}>
        Rentals in {locality}, {city}
      </h1>
      <p className="results-meta">{total} listing{total === 1 ? '' : 's'} currently available</p>

      {results.length === 0 ? (
        <div className="empty-state">
          No active listings in {locality} right now. Try browsing all of{' '}
          <a href={`/search?city=${encodeURIComponent(city)}`}>{city}</a> instead.
        </div>
      ) : (
        <ul className="listing-list">
          {results.map((listing) => (
            <ListingRow key={listing._id} listing={listing} />
          ))}
        </ul>
      )}
    </div>
  );
}
