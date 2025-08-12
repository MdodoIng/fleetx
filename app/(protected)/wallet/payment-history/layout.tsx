'use client';

import { withAuth } from '@/shared/services/withAuth';

function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withAuth(Layout, ['FINANCE_MANAGER']);
