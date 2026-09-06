import HeroSearchForm from '@/components/HeroSearchForm';
import { getCities } from '@/lib/api';

export default async function HomePage() {
  const cities = await getCities();

  return (
    <div className="hero">
      <h1>Find a room, PG, flat, or house to rent — near where you actually want to live.</h1>
      <p>
        Search by locality, not just city. See real photos, rent, and bathroom count before
        you ever call an owner.
      </p>
      <HeroSearchForm />

      {cities.length > 0 && (
        <div className="city-links">
          {cities.map((city) => (
            <a key={city} href={`/search?city=${encodeURIComponent(city)}`}>
              {city}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
