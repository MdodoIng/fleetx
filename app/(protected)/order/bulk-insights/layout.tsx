'use client';

import { withAuth } from '@/shared/components/Layout/withAuth';

function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withAuth(Layout, ['VENDOR_USER']);
