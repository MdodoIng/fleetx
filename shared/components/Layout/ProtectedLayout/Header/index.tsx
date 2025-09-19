'use client';
import { useAuthStore, useSharedStore, useVenderStore } from '@/store';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../../LocaleSwitcher';

import Notification from './Notification';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import main_padding from '@/styles/padding';
import Profile from './Profile';
import logoCollapsed from '@/assets/images/logo white Collapsed.webp';
import hamburgerIon from '@/assets/icons/hamburger.svg';

import Image from 'next/image';
import UserAndBranchSelecter from '@/shared/components/selectors/UserAndBranchSelecter';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const venderStore = useVenderStore();
  const { setValue } = useSharedStore();

  const t = useTranslations('component.common.header');

  const handleChangeBranch = (e: string | undefined) => {
    const branch = venderStore.branchDetails?.find((r) => r.id === e);
    venderStore.setValue('selectedBranch', branch);
    venderStore.setValue('branchId', e);
  };
  const handleChangeVender = (e: string | undefined) => {
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
      <UserAndBranchSelecter
        handleChangeBranch={handleChangeBranch}
        handleChangeVender={handleChangeVender}
        handleClear={handleClear}
      />
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
