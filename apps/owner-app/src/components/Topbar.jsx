'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUser, clearSession } from '@/lib/auth';

export default function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    clearSession();
    window.location.href = '/login';
  }

  return (
    <div className="topbar">
      <Link href="/dashboard" className="topbar__logo">
        RentZ Owner
      </Link>
      <nav>
        {user ? (
          <>
            <Link href="/dashboard">My listings</Link>
            <Link href="/dashboard/inquiries">Inquiries</Link>
            <Link href="/dashboard/new">+ Add listing</Link>
            <button className="btn-secondary" onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              Log out ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/signup">Sign up</Link>
          </>
        )}
      </nav>
    </div>
  );
}
