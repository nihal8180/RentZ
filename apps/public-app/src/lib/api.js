const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080';

/**
 * All fetches below are wrapped in try/catch and return a safe empty
 * fallback on ANY failure - not just a non-2xx response, but also network
 * errors (ECONNREFUSED, DNS failure, timeout) which fetch() throws rather
 * than returning as a response. This matters because sitemap.js and the
 * homepage call these at BUILD time - if a downstream service is briefly
 * unreachable (still deploying, cold-starting on a free tier, etc.), the
 * whole production build would otherwise fail instead of just shipping
 * with an empty city list / sitemap for that run.
 */

export async function searchListings(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  ).toString();

  try {
    const res = await fetch(`${GATEWAY_URL}/api/listings/search?${query}`, {
      // Revalidate periodically rather than caching forever or fetching
      // fresh every time - keeps search pages fast but not stale for long.
      next: { revalidate: 60 },
    });
    if (!res.ok) return { results: [], total: 0, page: 1, limit: 20 };
    return await res.json();
  } catch (err) {
    console.error('searchListings failed:', err.message);
    return { results: [], total: 0, page: 1, limit: 20 };
  }
}

export async function getListing(id) {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/listings/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('getListing failed:', err.message);
    return null;
  }
}

export async function getCities() {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/locations/cities`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('getCities failed:', err.message);
    return [];
  }
}

export async function getLocalities(city) {
  try {
    const res = await fetch(
      `${GATEWAY_URL}/api/locations/localities?city=${encodeURIComponent(city)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('getLocalities failed:', err.message);
    return [];
  }
}