'use client';

import { withAuth } from '@/shared/services/withAuth';
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout';
import Header from '@/shared/components/Layout/ProtectedLayout/Header';
import SideBar from '@/shared/components/Layout/ProtectedLayout/Sidebar';

function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

export default withAuth(Layout);
