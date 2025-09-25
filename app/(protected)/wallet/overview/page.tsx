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
import { useVendorStore } from '@/store';
import { useWalletStore } from '@/store/useWalletStore';
import { useEffect, useState } from 'react';
import { RecentTransactions } from '@/features/wallet/components/overview/RecentTransactions';
import DeliveryPricingCard from '@/features/wallet/components/overview/DeliveryPricingCard';
import { CreateFallback } from '@/shared/components/fallback';

export default function WalletPage() {
  const vendorStore = useVendorStore();
  const { setTabBasedOnRole, prepareMashkor } = useWalletStore();
  const { handleAddCredit, handlePrepareMashkor } = useAddCredit();

  const [isOpen, setIsOpen] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setTab = async () => {
      await setTabBasedOnRole();
    };
    setTab();
    setIsLoading(false);
  }, [setTabBasedOnRole]);

  useEffect(() => {
    const fetchData = async () => {
      await handleAddCredit();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    vendorStore.branchId,
    vendorStore.vendorId,
    vendorStore.selectedBranch,
    vendorStore.selectedVendor,
  ]);

  useEffect(() => {
    if (prepareMashkor) {
      handlePrepareMashkor({ setIsOpen: setIsOpen });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prepareMashkor]);

  if (isLoading) return <CreateFallback />;

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
