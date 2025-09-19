'use client';

import { withAuth } from './withAuth';
import Header from './Header';
import SideBar from './Sidebar';
import { useEffect } from 'react';
import { useSharedStore, useVenderStore } from '@/store';
import {
  setBranchDetails,
  updateZoneAndSome,
  setHeadingForVendorBranch,
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

  return (
    <section className="flex items-start justify-start h-svh w-full">
      <SideBar />
      <div className="h-full overflow-y-auto w-full flex flex-col relative z-0">
        <Header />
        {children}
      </div>
    </section>
  );
};

export default ProtectedLayout;
