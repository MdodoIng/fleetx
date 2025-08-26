'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { TypeNotificationItem } from '@/shared/types/notification';
import { cn } from '@/shared/lib/utils';
import { useEffect, useState } from 'react';
import { useVenderStore } from '@/store';
import { vendorService } from '@/shared/services/vender';
import { commonConstants } from '@/shared/constants/storageConstants';
import { reportService } from '@/shared/services/report';

export function RecentTransactions() {
  const [walletHistory, setWalletHistory] = useState<TypeNotificationItem[]>();
  const venderStore = useVenderStore();
  const [isLoading, setIsLoading] = useState(false);

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
        const reportRes = await reportService.getVendorBalanceReport(reportUrl);

        setWalletHistory(reportRes.data!);
        console.log(reportRes);
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">
          All your confirmed orders are listed here
        </p>
      </CardHeader>
      {/*<CardContent className="space-y-3">
        {walletHistory?.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-3 mb-3">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500">{item.entity_id}</p>
                <p className={` max-w-[36ch]`}>{item.message}</p>
                <p className="text-xs text-gray-400 ">
                  {new Date(item.notify_at).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-2 rounded-full h-max text-xs bg-yellow-500 text-center`}
              >
                {item.message.includes('debited')
                  ? 'Delivery Fee'
                  : 'Wallet Recharged'}
              </span>
            </div>
          </div>
        ))}
      </CardContent>*/}
    </Card>
  );
}
