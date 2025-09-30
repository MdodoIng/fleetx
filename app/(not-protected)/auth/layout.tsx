'use client';

import SlaAccept from '@/features/auth/components/SlaAccept';
import { useRedirectToHome } from '@/shared/lib/hooks/useRedirectToHome';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const redirectToHome = useRedirectToHome();

  useEffect(() => {
    if (isAuthenticated) {
      redirectToHome();
    }
  }, [isAuthenticated, redirectToHome]);

  return (
    <>
      {children}
      <SlaAccept />
    </>
  );
}

export default Layout;
