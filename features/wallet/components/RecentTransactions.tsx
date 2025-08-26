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

const transactions = [
  {
    balance: { balance_amount: '-12.000' },
    updated_at: '2025-08-18T15:51:17.868003Z',
    txn_number: 'F-6M5ET',
    txn_amount: '-1.500',
    txn_type: 1,
    txn_at: '2025-08-18T15:51:17.868051Z',
    operation_type: 4,
    vendor_id: 'ae07ee31-e901-4605-b04b-aa3d8dd13c85',
    branch_id: '8fa72811-8960-499c-81ed-01af7cf3e28d',
    initial_amount: '1.500',
    tax_amount: '0.000',
    wallet_type: 1,
    source: 1,
    delivery_model: 1,
    delivery_distance: '1.0000',
  },
  {
    balance: { balance_amount: '-12.000' },
    updated_at: '2025-08-18T15:51:17.868003Z',
    txn_number: 'B-6M5EC',
    txn_amount: '50.000',
    txn_type: 2,
    txn_at: '2025-08-21T13:54:10.868051Z',
    operation_type: 2,
    vendor_id: 'ae07ee31-e901-4605-b04b-aa3d8dd13c85',
    branch_id: '8fa72811-8960-499c-81ed-01af7cf3e28d',
    initial_amount: '50.000',
    tax_amount: '0.000',
    wallet_type: 1,
    source: 1,
    delivery_model: 1,
    delivery_distance: '1.0000',
  },
];

export function RecentTransactions() {
  const [walletHistory, setWalletHistory] =
    useState<TypeWalletTransactionHistoryRes['data']>();
  const venderStore = useVenderStore();
  const sharedStore = useSharedStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchVendorWalletBalance = async () => {
    setIsLoading(true);
    try {
      if (venderStore.vendorId && venderStore.branchId) {
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
  }, [venderStore.vendorId, venderStore.branchId]);

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
