'use client';

import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';

export default function AuthGuard({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      window.location.href = '/login';
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;
  return children;
}
