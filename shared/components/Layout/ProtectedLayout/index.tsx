'use client';
import { withAuth } from './withAuth';
import Header from './Header';
import SideBar from './Sidebar';
import { SearchX } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { useSharedStore, useVenderStore } from '@/store';
import { setBranchDetails, updateZoneAndSome } from '@/shared/services/header';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const sharedStore = useSharedStore();
  const venderStore = useVenderStore();
  useEffect(() => {
    async function callUpdateZone() {
      await updateZoneAndSome();
    }
    callUpdateZone();
  }, [updateZoneAndSome]);

  useMemo(async () => {
    await setBranchDetails();
  }, [venderStore.branchId, venderStore.vendorId]);

  return (
    <section className="flex items-start justify-start h-svh  w-full">
      <SideBar />
      <div className="h-full overflow-y-auto w-full flex flex-col relative z-0">
        <Header />

        {children}
      </div>
    </section>
  );
};

export default ProtectedLayout;
