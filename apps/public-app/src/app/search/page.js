import FiltersBar from '@/components/FiltersBar';
import ListingRow from '@/components/ListingRow';
import { searchListings } from '@/lib/api';

export async function generateMetadata({ searchParams }) {
  const { city, locality } = searchParams;
  let title = 'Browse rentals';
  if (city && locality) title = `Rentals in ${locality}, ${city}`;
  else if (city) title = `Rentals in ${city}`;

  return {
    title,
    description: `Search rooms, PGs, flats, and houses for rent${
      city ? ` in ${city}` : ''
    }${locality ? `, ${locality}` : ''} on RentZ.`,
  };
}

export default async function SearchPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const data = await searchListings({ ...searchParams, page, limit: 20 });
  const { results, total, limit } = data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container">
      <h1 className="section-title" style={{ marginTop: 40 }}>
        {searchParams.city
          ? `Rentals in ${searchParams.locality ? `${searchParams.locality}, ` : ''}${searchParams.city}`
          : 'Browse all listings'}
      </h1>

      <FiltersBar searchParams={searchParams} />

      <p className="results-meta">{total} listing{total === 1 ? '' : 's'} found</p>

      {results.length === 0 ? (
        <div className="empty-state">
          No listings match those filters yet. Try widening your search or check back soon —
          new listings are added regularly.
        </div>
      ) : (
        <ul className="listing-list">
          {results.map((listing) => (
            <ListingRow key={listing._id} listing={listing} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams({ ...searchParams, page: p });
            return (
              <a key={p} href={`/search?${params.toString()}`}>
                {p}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
