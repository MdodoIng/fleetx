'use client';

import {
  getVendorList,
  setBranchDetails,
  setHeadingForVendorBranch,
  updateZoneAndSome,
} from '@/shared/services/header';
import { useAuthStore, useSharedStore, useVendorStore } from '@/store';
import { useEffect } from 'react';
import Header from './Header';
import SideBar from './Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const vendorStore = useVendorStore();
  const { setValue: setValueAuthStore } = useAuthStore();
  const { setValue: setValueSharedStore } = useSharedStore();

  useEffect(() => {
    async function init() {
      setValueAuthStore('isLoading', true);
      await setHeadingForVendorBranch();
      setValueAuthStore('isLoading', false);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function init() {
      setValueAuthStore('isLoading', true);
      await updateZoneAndSome();
      if (vendorStore.vendorId) {
        await setBranchDetails();
      }
      setValueAuthStore('isLoading', false);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorStore.branchId, vendorStore.vendorId]);

  useEffect(() => {
    async function init() {
      setValueAuthStore('isLoading', true);
      await getVendorList();
      setValueAuthStore('isLoading', false);
    }

    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorStore.isSearchVendorParams]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setValueSharedStore('isCollapsed', true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-start h-svh w-full"
      >
        <SideBar />

        <div className="h-full overflow-y-auto w-full flex flex-col relative z-0 bg-off-white will-change-auto">
          <Header />

          {children}
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default ProtectedLayout;
