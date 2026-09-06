import { getCities, getLocalities, searchListings } from '@/lib/api';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const entries = [
    { url: `${siteUrl}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/search`, changeFrequency: 'hourly', priority: 0.9 },
  ];

  const cities = await getCities();

  for (const city of cities) {
    const localities = await getLocalities(city);
    for (const loc of localities) {
      entries.push({
        url: `${siteUrl}/locality/${encodeURIComponent(city)}/${encodeURIComponent(loc.locality)}`,
        changeFrequency: 'daily',
        priority: 0.7,
      });
    }
  }

  // Include a bounded number of individual listing pages directly in the
  // sitemap; for large volumes, switch to a sitemap index with generateSitemaps().
  const { results } = await searchListings({ limit: 200 });
  for (const listing of results) {
    entries.push({
      url: `${siteUrl}/listing/${listing._id}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return entries;
}
