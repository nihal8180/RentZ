const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080';

/**
 * Search listings. Called from server components, so this runs on the
 * server at request time (or build time for static params) - never
 * ships gateway URLs or fetch logic to the browser bundle.
 */
export async function searchListings(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  ).toString();

  const res = await fetch(`${GATEWAY_URL}/api/listings/search?${query}`, {
    // Revalidate periodically rather than caching forever or fetching
    // fresh every time - keeps search pages fast but not stale for long.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return { results: [], total: 0, page: 1, limit: 20 };
  }
  return res.json();
}

export async function getListing(id) {
  const res = await fetch(`${GATEWAY_URL}/api/listings/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getCities() {
  const res = await fetch(`${GATEWAY_URL}/api/locations/cities`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getLocalities(city) {
  const res = await fetch(
    `${GATEWAY_URL}/api/locations/localities?city=${encodeURIComponent(city)}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}
