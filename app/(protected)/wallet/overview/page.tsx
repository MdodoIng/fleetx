'use client';
import { AlertSettings } from '@/features/wallet/components/overview/AlertSettings';
import ModelBoxCredit from '@/features/wallet/components/ModelBoxCredit';
import { WalletBalance } from '@/features/wallet/components/overview/WalletBalance';
import { useAddCredit } from '@/features/wallet/hooks/useAddCredit';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { useVenderStore } from '@/store';
import { useWalletStore } from '@/store/useWalletStore';
import { useEffect, useState } from 'react';
import { RecentTransactions } from '@/features/wallet/components/overview/RecentTransactions';
import DeliveryPricingCard from '@/features/wallet/components/overview/DeliveryPricingCard';

export default function WalletPage() {
  const venderStore = useVenderStore();
  const {
    setTabBasedOnRole,

    prepareMashkor,
  } = useWalletStore();
  const { handleAddCredit, handlePrepareMashkor } = useAddCredit();

  const [isOpen, setIsOpen] = useState<number | undefined>(undefined);

  useEffect(() => {
    const setTab = async () => {
      await setTabBasedOnRole();
    };
    setTab();
  }, [setTabBasedOnRole]);

  useEffect(() => {
    const fetchData = async () => {
      await handleAddCredit();
    };
    fetchData();
  }, [
    venderStore.branchId,
    venderStore.vendorId,
    venderStore.selectedBranch,
    venderStore.selectedVendor,
    handleAddCredit,
  ]);

  useEffect(() => {
    if (prepareMashkor) {
      handlePrepareMashkor({ setIsOpen: setIsOpen });
    }
  }, [prepareMashkor, handlePrepareMashkor]);

  return (
    <Dashboard className="h-auto w-full">
      <DashboardHeader>
        <DashboardHeaderRight />
      </DashboardHeader>
      <DashboardContent className="w-full grid gap-6 md:grid-cols-2">
        <div className="grid gap-6 w-full h-max">
          <WalletBalance setIsOpen={setIsOpen} />
          <DeliveryPricingCard />
          <AlertSettings />
        </div>
        <RecentTransactions isOpen={isOpen} />
        <ModelBoxCredit isOpen={isOpen} setIsOpen={setIsOpen} />
      </DashboardContent>
    </Dashboard>
  );
}
