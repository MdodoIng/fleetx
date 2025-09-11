'use client';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout';
import Header from '@/shared/components/Layout/ProtectedLayout/Header';
import SideBar from '@/shared/components/Layout/ProtectedLayout/Sidebar';
import { isMounted } from '@/shared/lib/hooks';
import LoadingPage from '../loading';
import { APP_SIDEBAR_MENU } from '@/shared/constants/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useGetSidebarMeta } from '@/shared/lib/helpers/index';

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { title } = useGetSidebarMeta(pathname);

  return (
    <ProtectedLayout
      header={{
        title: title,
      }}
    >
      {children}
    </ProtectedLayout>
  );
}

export default withAuth(Layout);
