const TYPES = ['ROOM', 'HOUSE', 'PG', 'FLAT'];
const FURNISHING = ['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'];

export default function FiltersBar({ searchParams }) {
  return (
    <div className="filters-bar">
      <form action="/search" method="get">
        <label>
          City
          <input type="text" name="city" defaultValue={searchParams.city || ''} />
        </label>
        <label>
          Locality
          <input type="text" name="locality" defaultValue={searchParams.locality || ''} />
        </label>
        <label>
          Type
          <select name="type" defaultValue={searchParams.type || ''}>
            <option value="">Any</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          Min rent
          <input type="number" name="minRent" defaultValue={searchParams.minRent || ''} />
        </label>
        <label>
          Max rent
          <input type="number" name="maxRent" defaultValue={searchParams.maxRent || ''} />
        </label>
        <label>
          BHK
          <input type="number" name="bhk" defaultValue={searchParams.bhk || ''} />
        </label>
        <label>
          Min bathrooms
          <input type="number" name="bathrooms" defaultValue={searchParams.bathrooms || ''} />
        </label>
        <label>
          Furnishing
          <select name="furnishing" defaultValue={searchParams.furnishing || ''}>
            <option value="">Any</option>
            {FURNISHING.map((f) => (
              <option key={f} value={f}>
                {f.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <button className="btn" type="submit">
          Apply filters
        </button>
      </form>
    </div>
  );
}
