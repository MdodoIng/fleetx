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
import { useSharedStore, useVenderStore } from '@/store';
import { vendorService } from '@/shared/services/vender';
import { commonConstants } from '@/shared/constants/storageConstants';
import { reportService } from '@/shared/services/report';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import { format } from 'date-fns';
import { OperationType } from '@/shared/types/orders';

export function RecentTransactions({ isOpen }: { isOpen: any }) {
  const [walletHistory, setWalletHistory] =
    useState<TypeWalletTransactionHistoryRes['data']>();
  const venderStore = useVenderStore();
  const sharedStore = useSharedStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchVendorWalletBalance = async () => {
    setIsLoading(true);
    try {
      if (venderStore.vendorId) {
        const walletHistoryUrl = reportService.getWalletHistoryUrl(
          4,
          null,
          null,
          null,
          null
        );
        const walletHistoryRes =
          await reportService.getWalletHistory(walletHistoryUrl);

        setWalletHistory(walletHistoryRes.data!);
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
  }, [venderStore.vendorId, venderStore.branchId, isOpen]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'dd MMM yyyy, hh:mm a');
  };

  return (
    <Card className="w-full h-auto">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">
          All your confirmed orders are listed here
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {walletHistory?.map((txn, idx) => {
          const isCredit = Number(txn.txn_amount) > 0;
          const operation_type = OperationType.find(
            (x) => x.key === txn?.operation_type
          );

          return (
            <div
              key={idx}
              className="border rounded-lg p-3 shadow-sm flex flex-col gap-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {txn.txn_number}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${operation_type?.color}`}
                >
                  {operation_type?.value}
                </span>
              </div>

              <div
                className={`text-lg font-bold ${
                  isCredit ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isCredit ? '+' : ''}
                {txn.txn_amount} {sharedStore.appConstants?.currency}
              </div>

              <div className="text-sm text-gray-500">
                {formatDate(txn.txn_at)}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
