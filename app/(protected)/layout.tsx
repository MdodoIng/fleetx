'use client';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout';
import { useAuthStore, useSharedStore, useVendorStore } from '@/store';
import { setUserLocale } from '@/shared/services/locale';
import { useEffect } from 'react';
import { defaultLocale } from '@/locales/config';

function Layout({ children }: { children: React.ReactNode }) {
  const { showLanguage } = useSharedStore();
  const { vendorId, branchId } = useVendorStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (showLanguage) return;
    setUserLocale(defaultLocale);
  }, [showLanguage]);

  console.log(vendorId, branchId, user);

  return <ProtectedLayout>{children}</ProtectedLayout>;
}

export default withAuth(Layout);
