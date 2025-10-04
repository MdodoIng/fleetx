'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  MapPin,
  User,
  Phone,
  Car,
  CreditCard,
  Clock,
  Star,
  Truck,
  Navigation,
  Info,
  Receipt,
  User2,
  ServerCrash,
  BetweenVerticalEndIcon,
} from 'lucide-react';
import { statusColors, paymentMap } from '@/features/orders/constants';

import { useSharedStore, useVendorStore } from '@/store';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import { OperationType } from '@/shared/types/orders';
import { cn } from '@/shared/lib/utils';
import { vendorService } from '@/shared/services/vendor';
import { TypeBranch } from '@/shared/types/vendor';

interface OrdersPageProps {
  data: [
    TypeWalletTransactionHistoryRes['data'][number] & {
      branch: TypeBranch | undefined;
    },
  ];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  nextSetItemTotal: any;
}

export default function TableComponent({
  data,
  page,
  setPage,
  nextSetItemTotal,
}: OrdersPageProps) {
  const { appConstants } = useSharedStore();
  const vendorStore = useVendorStore();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 10);
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [handleLoadMore]);

  return (
    <div className="p-6 bg-gray-50 w-full">
      <div className="space-y-6 w-full">
        {data.map((txn, idx) => {
          const isCredit = Number(txn.txn_amount) > 0;
          const operation_type = OperationType.find(
            (x) => x.key === txn?.operation_type
          );

          return (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-4 flex flex-col border border-gray-100 w-full"
            >
              {/* Header Row */}
              <div className="flex justify-between items-center mb-3 w-full">
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      operation_type?.color || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {operation_type?.value}
                  </span>
                  <span className="font-semibold text-gray-700">
                    FleetX{' '}
                    <span className="text-sm font-normal">
                      {txn.branch?.main_branch
                        ? 'Main Branch' + ' ' + txn.branch?.name
                        : txn.branch?.name}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500 gap-1.5">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(txn.updated_at).toLocaleString()}
                  </span>{' '}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] w-full gap-4 text-sm">
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <User2 size={14} /> User.
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {txn.branch?.vendor.name}
                  </span>
                </div>
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <ServerCrash size={14} /> Amount.
                  </span>
                  <span
                    className={cn(
                      'text-sm font-medium text-gray-800',
                      isCredit ? 'text-red-500' : 'text-green-500'
                    )}
                  >
                    {isCredit ? '+' : '-'}
                    {txn.tax_amount} {appConstants?.currency}
                  </span>
                </div>
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <BetweenVerticalEndIcon size={14} /> Balence.
                  </span>
                  <span
                    className={cn(
                      'text-sm font-medium text-gray-800',
                      isCredit ? 'text-red-500' : 'text-green-500'
                    )}
                  >
                    {isCredit ? '+' : '-'}
                    {txn.balance.balance_amount} {appConstants?.currency}
                  </span>
                </div>
              </div>

              {/* Footer */}
            </div>
          );
        })}
      </div>

      {/* Pagination */}

      <div
        hidden={nextSetItemTotal === null}
        className="flex justify-center mt-6 gap-2 bg-white w-full shadow rounded-md py-3"
      >
        <div
          ref={loadMoreRef}
          className="flex justify-center items-center py-4 text-gray-500"
        >
          Loading more...
        </div>
      </div>
    </div>
  );
}
