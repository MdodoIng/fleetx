'use client';
import LoadingPage from '@/app/loading';
import { isMounted } from '@/shared/lib/hooks';
import type { UserRole } from '@/shared/types/auth';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { useEffect } from 'react';

// HOC for role-based access control
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  if (!isMounted) <LoadingPage />;

  return function AuthenticatedComponent(props: P) {
    const {
      isAuthenticated,
      isLoading,
      hasAnyRole,
      isAuthenticatedCheck,
      user,
    } = useAuthStore();

    useEffect(() => {
      isAuthenticatedCheck();
    }, [isAuthenticatedCheck]);

    console.log(user);
    if (isLoading) {
      return <LoadingPage />;
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Please log in to access this page.
            </p>
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Go to Login
            </Link>
          </div>
        </div>
      );
    }

    if (requiredRoles && !hasAnyRole(requiredRoles)) {
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
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
