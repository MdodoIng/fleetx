'use client';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout';
import { routes } from '@/shared/constants/routes';
import { useAuthStore, useSharedStore } from '@/store';

function Layout({ children }: { children: React.ReactNode }) {
  const { lastPathname } = useSharedStore();
  const { user } = useAuthStore();
  

  const allowedRoute = Object.values(routes).find((route) =>
    route.path.endsWith(lastPathname)
  );
  
  console.log(allowedRoute,allowedRoute?.roles ? allowedRoute.roles?.some((role) => user?.roles?.includes(role)) : "")

  return <ProtectedLayout>{children}</ProtectedLayout>;
}

export default withAuth(Layout);
