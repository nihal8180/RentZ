'use client';

import { useEffect } from 'react';
import { getToken } from '@/lib/auth';

export default function RootPage() {
  useEffect(() => {
    window.location.href = getToken() ? '/dashboard' : '/login';
  }, []);

  return null;
}
