'use client';
import { useAuthStore, useSharedStore, useVenderStore } from '@/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../../LocaleSwitcher';

import Notification from './Notification';
import { Button } from '@/shared/components/ui/button';
import UserAndBranchSelecter from './UserAndBranchSelecter';
import { cn } from '@/shared/lib/utils';
import main_padding from '@/styles/padding';
import { Profiler } from 'react';
import Profile from './Profile';
import logoCollapsed from '@/assets/images/logo white Collapsed.webp';
import hamburgerIon from '@/assets/icons/hamburger.svg';

import Image from 'next/image';

const Header: React.FC<{ title?: string }> = ({ title = 'Order' }) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasAnyRole, logout, hasRole, user } =
    useAuthStore();
  const venderStore = useVenderStore();
  const { isCollapsed, setValue } = useSharedStore();

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

  const t = useTranslations('component.common.header');

  const handleChangeBranch = (e: string) => {
    const branch = venderStore.branchDetails?.find((r) => r.id === e);
    venderStore.setValue('selectedBranch', branch);
    venderStore.setValue('branchId', e);
  };
  const handleChangeVender = (e: string) => {
    const vender = venderStore.venderList?.find((r) => r.id === e);
    venderStore.setValue('selectedVendor', vender);
    venderStore.setValue('vendorId', e);
    venderStore.setValue('selectedBranch', undefined);
    venderStore.setValue('branchId', undefined);
  };

  const handleClear = () => {
    venderStore.setValue('selectedBranch', undefined);
    venderStore.setValue('branchId', undefined);
    if (!user?.roles.includes('VENDOR_USER')) {
      venderStore.setValue('vendorId', undefined);
      venderStore.setValue('selectedVendor', undefined);
    }
  };

  return (
    <nav
      className={cn(
        'lg:bg-white bg-primary-blue flex items-center justify-between h-auto sticky top-0 z-50',
        main_padding.dashboard.x,
        main_padding.dashboard.y
      )}
    >
      <p className="font-medium max-lg:hidden">{t('title')}</p>
      <div className="lg:hidden flex items-center gap-4">
        <Button
          variant={'ghost'}
          onClick={() => setValue('isCollapsed', false)}
        >
          <Image
            src={hamburgerIon}
            alt=""
            className="h-5 w-auto object-contain"
          />
        </Button>
        <Image
          src={logoCollapsed}
          alt=""
          className="h-10 w-auto object-contain"
        />
      </div>
      <div className="flex items-center lg:gap-4 gap-0 h-full ">
        <Notification />
        <Profile />
        <LocaleSwitcher variant="dashboard" />
      </div>
    </nav>
  );
};

export default Header;
