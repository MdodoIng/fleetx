'use client';
import { AlertSettings } from '@/features/wallet/components/AlertSettings';
import { RecentTransactions } from '@/features/wallet/components/RecentTransactions';
import { WalletBalance } from '@/features/wallet/components/WalletBalance';
import { commonConstants } from '@/shared/constants/storageConstants';
import { notificationService } from '@/shared/services/notification';
import { VendorService } from '@/shared/services/vender';
import { TypeNotificationItem } from '@/shared/types/notification';
import { TypeWallet } from '@/shared/types/vender';
import { useVenderStore } from '@/store';
import { useEffect, useState } from 'react';

export default function WalletPage() {
  const venderStore = useVenderStore();

  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState<TypeWallet>();
  const [walletHistory, setWalletHistory] = useState<TypeNotificationItem[]>();

  const fetchVendorWalletBalance = async () => {
    setIsLoading(true);
    try {
      // Check if vendorId and branchId are not null before calling the service
      if (venderStore.vendorId && venderStore.branchId) {
        const historyUrl = notificationService.getNotificationHistoryUrl(
          commonConstants.notificationPerPage,
          null,
          null
        );
        const [walletRes, historyRes] = await Promise.all([
          VendorService.getVendorWalletBalance(
            venderStore.vendorId,
            venderStore.branchId
          ),
          notificationService.getNotification(historyUrl),
        ]);
        setWallet(walletRes.data);
        setWalletHistory(historyRes.data!);
        console.log(historyRes);
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
        />
        <AlertSettings />
      </div>
      <RecentTransactions walletHistory={walletHistory} />
    </div>
  );
}
