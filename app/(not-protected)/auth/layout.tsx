'use client';

import SlaAccept from '@/features/auth/components/SlaAccept';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SlaAccept />
    </>
  );
}

export default Layout;
