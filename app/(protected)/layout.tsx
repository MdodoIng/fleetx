'use client';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout';
import Header from '@/shared/components/Layout/ProtectedLayout/Header';
import SideBar from '@/shared/components/Layout/ProtectedLayout/Sidebar';
import { isMounted } from '@/shared/lib/hooks';
import LoadingPage from '../loading';

function Layout({ children }: { children: React.ReactNode }) {
  if (!isMounted) <LoadingPage />;
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

export default withAuth(Layout);
