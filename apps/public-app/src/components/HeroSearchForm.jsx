export default function HeroSearchForm() {
  return (
    <form className="search-form" action="/search" method="get">
      <input type="text" name="city" placeholder="City (e.g. Lucknow)" />
      <input type="text" name="locality" placeholder="Locality (e.g. Gomti Nagar)" />
      <button className="btn" type="submit">
        Search
      </button>
    </form>
  );
}
