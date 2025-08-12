'use client';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LocaleSwitcher from '../LocaleSwitcher';
import { Button } from '../../ui/button';

const Header: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasAnyRole, logout, hasRole } =
    useAuthStore();

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const navLinkClass = (path: string) => {
    const baseClass =
      'px-3 py-2 rounded-md text-sm font-medium transition duration-300';
    const activeClass = 'bg-blue-600 text-white';
    const inactiveClass =
      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

    return `${baseClass} ${isActivePath(path) ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="">
      <div className="ml-10 flex items-center md:space-x-4">
        <p className="">Order</p>
        <LocaleSwitcher />
        <div className="flex ml-auto">
          {isAuthenticated ? (
            <Button onClick={logout} variant={'destructive'}>
              Logout
            </Button>
          ) : (
            <Link href="/register" className={navLinkClass('/register')}>
              <Button>Register</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
