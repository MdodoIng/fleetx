'use client';

import Header from './Header';
import SideBar from './Sidebar';
import { useEffect } from 'react';
import { useVendorStore } from '@/store';
import {
  setBranchDetails,
  updateZoneAndSome,
  setHeadingForVendorBranch,
  getVendorList,
} from '@/shared/services/header';
import { ViewTransition } from '@/shared/lib/hooks';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const vendorStore = useVendorStore();

  useEffect(() => {
    async function init() {
      await updateZoneAndSome();
      await setBranchDetails();
      await setHeadingForVendorBranch();
    }

    init();
  }, [vendorStore.branchId, vendorStore.vendorId]);

  useEffect(() => {
    getVendorList();
  }, [vendorStore.isSearchVendorParams]);

  return (
    <section className="flex items-start justify-start h-svh w-full">
      <ViewTransition>
        <SideBar />
      </ViewTransition>
      <div className="h-full overflow-y-auto w-full flex flex-col relative z-0 bg-off-white">
        <Header />

        {children}
      </div>
    </section>
  );
};

export default ProtectedLayout;
