'use client';
import BaseLayout from '@/shared/components/Layout/BaseLayout';

function Layout({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}

export default Layout;
