'use client';

import {
  getVendorList,
  setBranchDetails,
  setHeadingForVendorBranch,
  updateZoneAndSome,
} from '@/shared/services/header';
import { useVendorStore } from '@/store';
import { useEffect } from 'react';
import Header from './Header';
import SideBar from './Sidebar';

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
      <SideBar />

      <div className="h-full overflow-y-auto w-full flex flex-col relative z-0 bg-off-white">
        <Header />

        {children}
      </div>
    </section>
  );
};

export default ProtectedLayout;
