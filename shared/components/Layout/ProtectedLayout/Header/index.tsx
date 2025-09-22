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
  const {
    isVendorAccess,
    isBranchAccess,
    branchDetails,
    setValue: setValueVenderStore,
    venderList,
  } = useVenderStore();

  const { setValue: setSharedStore } = useSharedStore();

  const t = useTranslations('component.common.header');
  const isAccess = isVendorAccess || isBranchAccess;
  const handleClickBranch = (e: string | undefined) => {
    const branch = branchDetails?.find((r) => r.id === e);
    setValueVenderStore('selectedBranch', branch);
    setValueVenderStore('branchId', e);
  };


  const handleChangeVender = (e: string | undefined) => {
    const vender = venderList?.find((r) => r.id === e);
    setValueVenderStore('selectedVendor', vender);
    setValueVenderStore('vendorId', e);
    setValueVenderStore('selectedBranch', undefined);
    setValueVenderStore('branchId', undefined);
  };

  const handleClear = () => {
    setValueVenderStore('selectedBranch', undefined);
    setValueVenderStore('branchId', undefined);
    if (!user?.roles.includes('VENDOR_USER')) {
      setValueVenderStore('vendorId', undefined);
      setValueVenderStore('selectedVendor', undefined);
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
      {isAccess ? (
        <UserAndBranchSelecter
          handleChangeBranch={handleClickBranch}
          handleChangeVender={handleChangeVender}
          handleClear={handleClear}
        />
      ) : (
        <p className="font-medium max-lg:hidden">{t('title')}</p>
      )}
      <div className="lg:hidden flex items-center gap-4">
        <Button
          variant={'ghost'}
          onClick={() => setSharedStore('isCollapsed', false)}
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
