'use client';

import {
  getVendorList,
  setBranchDetails,
  setHeadingForVendorBranch,
  updateZoneAndSome,
} from '@/shared/services/header';
import { useAuthStore, useVendorStore } from '@/store';
import { useEffect } from 'react';
import Header from './Header';
import SideBar from './Sidebar';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const vendorStore = useVendorStore();
  const { setValue } = useAuthStore();

  useEffect(() => {
    async function init() {
      setValue('isLoading', true);
      await setHeadingForVendorBranch();
      setValue('isLoading', false);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function init() {
      setValue('isLoading', true);
      await updateZoneAndSome();
      if (vendorStore.vendorId) {
        await setBranchDetails();
      }
      setValue('isLoading', false);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorStore.branchId, vendorStore.vendorId]);

  useEffect(() => {
    async function init() {
      setValue('isLoading', true);
      await getVendorList();
      setValue('isLoading', false);
    }

    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorStore.isSearchVendorParams]);

  return (
    <section className="flex items-start justify-start h-svh w-full">
      <SideBar />

      <div className="h-full overflow-y-auto w-full flex flex-col relative z-0 bg-off-white will-change-auto">
        <Header />

        {children}
      </div>
    </section>
  );
};

export default ProtectedLayout;
