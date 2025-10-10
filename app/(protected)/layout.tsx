'use client';

import { defaultLocale } from '@/locales/config';
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { setUserLocale } from '@/shared/services/locale';
import { useSharedStore } from '@/store';
import { useEffect } from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  const { showLanguage } = useSharedStore();

  useEffect(() => {
    if (showLanguage) return;
    setUserLocale(defaultLocale);
  }, [showLanguage]);

  return <ProtectedLayout>{children}</ProtectedLayout>;
}

export default withAuth(Layout);
