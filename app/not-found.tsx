'use client';
import { useRedirectToHome } from '@/shared/lib/hooks/useRedirectToHome';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFound() {
  const { isAuthenticatedCheck } = useAuthStore();
  const redirectToHome = useRedirectToHome();
  const { push } = useRouter();

  useEffect(() => {
    const isAuthenticated = isAuthenticatedCheck();
    if (isAuthenticated) {
      redirectToHome();
    } else {
      push('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
