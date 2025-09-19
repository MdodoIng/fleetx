'use client';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';

function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default Layout;
