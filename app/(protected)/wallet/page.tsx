'use client';
import { AlertSettings } from '@/features/wallet/components/AlertSettings';
import ModelBox from '@/features/wallet/components/ModelBox';
import { RecentTransactions } from '@/features/wallet/components/RecentTransactions';
import { WalletBalance } from '@/features/wallet/components/WalletBalance';
import { commonConstants } from '@/shared/constants/storageConstants';
import { notificationService } from '@/shared/services/notification';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vender';
import { TypeNotificationItem } from '@/shared/types/notification';
import { TypeWallet } from '@/shared/types/vender';
import { useVenderStore } from '@/store';
import { useEffect, useState } from 'react';

export default function WalletPage() {
  const venderStore = useVenderStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<Number | undefined>(undefined);
  const [wallet, setWallet] = useState<TypeWallet>();

  const fetchVendorWalletBalance = async () => {
    setIsLoading(true);
    try {
      // Check if vendorId and branchId are not null before calling the service
      if (venderStore.vendorId && venderStore.branchId) {
        const reportUrl = reportService.getVendorBalanceUrl(
          commonConstants.notificationPerPage,
          venderStore.vendorId,
          null
        );
        const walletRes = await vendorService.getVendorWalletBalance(
          venderStore.vendorId,
          venderStore.branchId
        );

        setWallet(walletRes.data);
      } else {
        console.warn(
          'vendorId or branchId is null. Cannot fetch wallet balance.'
        );
      }
    } catch (err: any) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        'An unknown error occurred while fetching wallet balance.';
      console.error('Error in fetchVendorWalletBalance:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialWalletBalance = async () => {
      await fetchVendorWalletBalance();
    };
    loadInitialWalletBalance();
  }, [venderStore.vendorId, venderStore.branchId]);

  // console.log(wallet);

  const handleCreditAction = () => {};

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <div className="grid gap-6 w-full h-max">
        <WalletBalance
          wallet={wallet!}
          handleCreditAction={handleCreditAction}
          setIsOpen={setIsOpen}
        />
        <AlertSettings />
      </div>
      <RecentTransactions />

      <ModelBox isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
