'use client';
import { AlertSettings } from '@/features/wallet/components/AlertSettings';
import ModelBoxCredit from '@/features/wallet/components/ModelBoxCredit';
import ModelBox from '@/features/wallet/components/ModelBoxCredit';
import { RecentTransactions } from '@/features/wallet/components/RecentTransactions';
import { WalletBalance } from '@/features/wallet/components/WalletBalance';
import { useAddCredit } from '@/features/wallet/hooks/useAddCredit';
import { commonConstants } from '@/shared/constants/storageConstants';
import { notificationService } from '@/shared/services/notification';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vender';
import { TypeNotificationItem } from '@/shared/types/notification';
import { TypeWallet } from '@/shared/types/vender';
import { useVenderStore } from '@/store';
import { useWalletStore } from '@/store/useWalletStore';
import { useEffect, useState } from 'react';

export default function WalletPage() {
  const venderStore = useVenderStore();
  const {
    walletBalance,
    getCentralWalletEnabled,
    isCentralWalletEnabled,
    checkWallet,
    setTabBasedOnRole,
  } = useWalletStore();
  const { handleAddCredit } = useAddCredit();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<Number | undefined>(undefined);

  useEffect(() => {
    const setTab = async () => {
      await setTabBasedOnRole();
    };
    setTab();
  }, []);

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
  ]);

  console.log(venderStore.selectedVendor?.id, 'sagfda');

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <div className="grid gap-6 w-full h-max">
        <WalletBalance setIsOpen={setIsOpen} />
        <AlertSettings />
      </div>
      <RecentTransactions />

      <ModelBoxCredit isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
