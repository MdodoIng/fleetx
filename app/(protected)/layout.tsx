'use client';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout';
import Header from '@/shared/components/Layout/ProtectedLayout/Header';
import SideBar from '@/shared/components/Layout/ProtectedLayout/Sidebar';
import { isMounted } from '@/shared/lib/hooks';
import LoadingPage from '../loading';
import { APP_SIDEBAR_MENU } from '@/shared/constants/sidebar';
import { usePathname, useRouter } from 'next/navigation';

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = APP_SIDEBAR_MENU.reduce((acc, item) => {
    if (item.children) {
      const childMatch = item.children.find((child) =>
        pathname.startsWith(child.route)
      );
      if (childMatch) {
        return childMatch.labelKey;
      }
    }
    if (pathname.startsWith(item.route)) {
      return item.labelKey;
    }
    return acc;
  }, '');

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
