'use client';


import BaseLayout from '@/shared/components/Layout/BaseLayout';
import { isMounted } from '@/shared/lib/hooks';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticatedCheck } = useAuthStore();
  useEffect(() => {
    if (isMounted) {
      isAuthenticatedCheck();
    }
  }, [isAuthenticatedCheck]);

  return <BaseLayout>{children}</BaseLayout>;
}

export default Layout;
