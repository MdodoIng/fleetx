/** eslint-disable react-hooks/exhaustive-deps */
'use client';
import LoadingPage from '@/app/loading';
import { isMounted } from '@/shared/lib/hooks';
import { UserRole } from '@/shared/types/user';

import { useAuthStore, useSharedStore } from '@/store';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '../../ui/button';
import { useGetSidebarMeta } from '@/shared/lib/helpers';

// HOC for role-based access control
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  if (!isMounted) <LoadingPage />;

  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, hasAnyRole, isAuthenticatedCheck } =
      useAuthStore();

    const { setValue } = useSharedStore();
    const { push } = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      isAuthenticatedCheck();
    }, [isAuthenticatedCheck]);

    const handleRedirectToLogin = () => {
      setValue('lastPathname', pathname);
      push('/auth/login');
    };

    const { roles } = useGetSidebarMeta();

    useEffect(() => {
      if (!isAuthenticated && !isLoading) {
        handleRedirectToLogin();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
      return <LoadingPage />;
    }

    const effectiveRequiredRoles = requiredRoles || roles;
    if (effectiveRequiredRoles && !hasAnyRole(effectiveRequiredRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              You don't have permission to access this page.
            </p>
            <Link
              href="/order/create"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Go Order
            </Link>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
