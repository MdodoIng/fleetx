'use client';
import { useAuthStore, useSharedStore, useVendorStore } from '@/store';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../../LocaleSwitcher';

import hamburgerIon from '@/assets/icons/hamburger.svg';
import logoCollapsed from '@/assets/images/logo white Collapsed.webp';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import main_padding from '@/styles/padding';
import Notification from './Notification';
import Profile from './Profile';

import UserAndBranchSelector from '@/shared/components/selectors/UserAndBranchSelector';
import { routes } from '@/shared/constants/routes';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const {
    isVendorAccess,
    isBranchAccess,
    branchDetails,
    setValue: setValueVendorStore,
    vendorList: vendorList,
  } = useVendorStore();
  const pathname = usePathname();

  const { setValue: setSharedStore } = useSharedStore();
  const routesForHideUserAndBranchSelector = [
    routes.VENDOR_ADD.path,
    routes.VENDOR_ACCOUNT_MANAGER.path,
    routes.INSIGHTS_OVERVIEW.path,
    routes.INSIGHTS_CHURN_REASONS.path,
    routes.INSIGHTS_FIRST_ORDER.path,
    routes.INSIGHTS_AFF_REFERRALS.path,
    routes.INSIGHTS_USER_REFERRALS.path,
    routes.RATING.path,
  ];

  const hideUserAndBranchSelector = routesForHideUserAndBranchSelector.some(
    (item) => pathname.startsWith(item) && pathname.endsWith(item)
  );

  const t = useTranslations('component.common.header');
  const isAccess = hideUserAndBranchSelector
    ? false
    : isVendorAccess || isBranchAccess;
  const handleClickBranch = (e: string | undefined) => {
    const branch = branchDetails?.find((r) => r.id === e);
    setValueVendorStore('selectedBranch', branch);
    setValueVendorStore('branchId', e);
  };

  const handleChangeVendor = (e: string | undefined) => {
    const vendor = vendorList?.find((r) => r.id === e);
    setValueVendorStore('selectedVendor', vendor);
    setValueVendorStore('vendorId', e);
    setValueVendorStore('selectedBranch', undefined);
    setValueVendorStore('branchId', undefined);
  };

  const handleClear = () => {
    setValueVendorStore('selectedBranch', undefined);
    setValueVendorStore('branchId', undefined);
    if (!user?.roles.includes('VENDOR_USER')) {
      setValueVendorStore('vendorId', undefined);
      setValueVendorStore('selectedVendor', undefined);
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
        <UserAndBranchSelector
          handleChangeBranch={handleClickBranch}
          handleChangeVendor={handleChangeVendor}
          handleClear={handleClear}
          classNameFroInput="border"
          type="header"
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
