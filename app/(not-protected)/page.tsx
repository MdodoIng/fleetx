'use client';

import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Home() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasAnyRole, logout, hasRole } =
    useAuthStore();

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const t = useTranslations('HomePage');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-gray-800">
          Welcome
          <p>{t('title')}</p>
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-gray-600">
          {isAuthenticated ? 'You are logged in!' : 'Please login to continue'}
        </p>
        {isAuthenticated ? (
          <Button variant="destructive" onClick={handleLogout} className="">
            Logout
          </Button>
        ) : (
          <Link href="/auth/login">
            <Button variant="default" className="">
              Go to Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
