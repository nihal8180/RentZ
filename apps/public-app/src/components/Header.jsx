import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="logo">
          Rent<span>Z</span>
        </Link>
        <nav>
          <Link href="/search">Browse all listings</Link>
        </nav>
      </div>
    </header>
  );
}
