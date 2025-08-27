'use client';
import { withAuth } from './withAuth';
import Header from './Header';
import SideBar from './Sidebar';
import { SearchX } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { setBranchDetails, updateZoneAndSome } from '@/shared/services/header';
import { useSharedStore, useVenderStore } from '@/store';

interface BaseLayoutProps {
  children: React.ReactNode;
  header?: {
    title: string;
  };
}

const ProtectedLayout: React.FC<BaseLayoutProps> = ({ children, header }) => {
  const sharedStore = useSharedStore();
  const venderStore = useVenderStore();
  useEffect(() => {
    async function callUpdateZone() {
      await updateZoneAndSome();
    }
    callUpdateZone();
    console.log('dfa');
  }, [updateZoneAndSome]);

  useMemo(async () => {
    await setBranchDetails();
  }, [venderStore.branchId, venderStore.vendorId]);

  return (
    <section className="flex items-start justify-start h-svh overflow-hidden">
      <SideBar header={header} />
      <div className="h-full overflow-y-auto w-full">
        <Header {...header} />
        {children}
      </div>
    </section>
  );
};

export default ProtectedLayout;
