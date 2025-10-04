'use client';

import BaseLayout from '@/shared/components/Layout/BaseLayout';
import { isMounted, ViewTransition } from '@/shared/lib/hooks';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticatedCheck } = useAuthStore();
  useEffect(() => {
    if (isMounted) {
      isAuthenticatedCheck();
    }
  }, [isAuthenticatedCheck]);

  return (
    <ViewTransition>
      <BaseLayout>{children}</BaseLayout>
    </ViewTransition>
  );
}

export default Layout;
