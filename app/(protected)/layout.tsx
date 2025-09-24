'use client';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout';
import { useSharedStore } from '@/store';
import { setUserLocale } from '@/shared/services/locale';
import { useEffect } from 'react';
import { defaultLocale } from '@/locales/config';

function Layout({ children }: { children: React.ReactNode }) {
  const { showLanguage } = useSharedStore();

  useEffect(() => {
    if (showLanguage) return;
    setUserLocale(defaultLocale);
  }, [showLanguage]);

  return <ProtectedLayout>{children}</ProtectedLayout>;
}

export default withAuth(Layout);
