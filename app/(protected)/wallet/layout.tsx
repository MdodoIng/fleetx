'use client';

import { withAuth } from '@/shared/components/Layout/withAuth';

function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withAuth(Layout, [
  'FINANCE_MANAGER',
  'OPERATION_MANAGER',
  'SALES_HEAD',
  'VENDOR_USER',
]);
