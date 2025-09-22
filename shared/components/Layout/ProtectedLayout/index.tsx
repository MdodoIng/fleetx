'use client';

import Header from './Header';
import SideBar from './Sidebar';
import { useEffect } from 'react';
import { useVenderStore } from '@/store';
import {
  setBranchDetails,
  updateZoneAndSome,
  setHeadingForVendorBranch,
  getVendorList,
} from '@/shared/services/header';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const venderStore = useVenderStore();

  useEffect(() => {
    async function init() {
      await updateZoneAndSome();
      await setBranchDetails();
      await setHeadingForVendorBranch();
    }

    init();
  }, [venderStore.branchId, venderStore.vendorId]);

  useEffect(() => {
    getVendorList();
  }, [venderStore.isSearchVenderParams]);

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
