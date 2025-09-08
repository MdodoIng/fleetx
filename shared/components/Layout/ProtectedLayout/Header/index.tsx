'use client';
import { useAuthStore, useVenderStore } from '@/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../../LocaleSwitcher';
import { Button } from '@/shared/components/ui/button';
import UserAndBranchSelecter from './UserAndBranchSelecter';

const Header: React.FC<{ title?: string }> = ({ title = 'Order' }) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasAnyRole, logout, hasRole } =
    useAuthStore();
  const venderStore = useVenderStore();

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

  const t = useTranslations();

  const handleChangeBranch = (e: string) => {
    const branch = venderStore.branchDetails?.find((r) => r.id === e);
    venderStore.setValue('selectedBranch', branch);
    venderStore.setValue('branchId', e);
  };
  const handleChangeVender = (e: string) => {
    const vender = venderStore.venderList?.find((r) => r.id === e);
    venderStore.setValue('selectedVendor', vender);
    venderStore.setValue('vendorId', e);
  };

  const handleClear = () => {
    venderStore.setValue('selectedBranch', undefined);
    venderStore.setValue('branchId', undefined);
    venderStore.setValue('selectedVendor', undefined);
    venderStore.setValue('vendorId', undefined);
  };

  return (
    <nav className="">
      <div className="ml-10 flex items-center md:space-x-4">
        <p className="">{t(title)}</p>
        <LocaleSwitcher />
        <UserAndBranchSelecter
          handleChangeBranch={handleChangeBranch}
          handleChangeVender={handleChangeVender}
          branchs={venderStore.branchDetails}
          handleClear={handleClear}
          
        />
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
